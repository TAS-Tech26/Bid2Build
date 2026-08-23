# views.py


from datetime import timedelta
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.utils import timezone
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

from .authentication import HubJWTAuthentication
from .handlers import BidHandler, ParticipantHandler
from .models import AuctionParticipant, BidLog, Team, Technology
from .redis_service import RedisService
from .serializers import BidSerializer, LeaderboardSerializer, ParticipantActionSerializer, TechnologySerializer

import json, hmac, requests
@api_view(['POST'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def place_bid_view(request):
    serializer = BidSerializer(data = request.data)

    if not serializer.is_valid():

        return JsonResponse({'error' : serializer.errors}, status = 400)

    data = serializer.validated_data

    success, message = BidHandler.process_transaction(team_code = request.user.team_code, tech_id = data['tech_id'], bid_amount = data['bid_amount'])

    return JsonResponse({'message' : message} if success else {'error' : message}, status = 200 if success else 400)

@api_view(['POST'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def join_auction_view(request):
    serializer = ParticipantActionSerializer(request.body)

    if not serializer.is_valid():

        return JsonResponse({'error' : serializer.errors}, status = 400)

    data = serializer.validated_data
    success, message = ParticipantHandler.join_auction(team_code = request.user.team_code, tech_id = data['tech_id'])

    return JsonResponse({'message' : message} if success else {'error' : message}, status = 200 if success else 400)

@api_view(['POST'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def back_out_auction_view(request):
    serializer = ParticipantActionSerializer(request.body)

    if not serializer.is_valid():

        return JsonResponse({'error' : serializer.errors}, status = 400)

    data = serializer.validated_data
    success, message = ParticipantHandler.back_out_auction(team_code = request.user.team_code, tech_id = data['tech_id'])

    return JsonResponse({'message' : message} if success else {'error' : message}, status = 200 if success else 400)

@api_view(['GET'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_all_technologies_view(request):
    technologies = Technology.objects.select_related('highest_bidder').all().order_by('id')
    tech_data = TechnologySerializer.serialize_many(technologies)
    return JsonResponse({'technologies' : tech_data}, status = 200)

@api_view(['GET'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def fetch_credits(request):
    team=Team.objects.get(team_code=request.user.team_code)
    return JsonResponse({'available_credits':team.available_credits})

@api_view(['GET'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_leaderboard_view(request):
    teams = Team.objects.prefetch_related('won_technologies').all().order_by('-available_credits')

    data = LeaderboardSerializer.serialize_many(teams)

    return JsonResponse({'leaderboard' : data}, status = 200)

@api_view(['GET'])
@authentication_classes([HubJWTAuthentication])
@permission_classes([IsAuthenticated])
def get_room_details_view(request, tech_id):
    try:
        tech = Technology.objects.get(id = tech_id)
    except Technology.DoesNotExist:

        return JsonResponse({'error' : "Technology not found"}, status = 404)

    # Fetch active teams in this specific room
    active_participants = AuctionParticipant.objects.filter(technology = tech, is_active = True).select_related('team')
    teams_in_room = [{'team_id' : p.team.id, 'team_name' : p.team.name} for p in active_participants]

    recent_bids = BidLog.objects.filter(technology = tech).select_related('team')[:20] # Fetch the latest 20 bids

    bid_history = [{'team_name' : bid.team.name, 'amount' : str(bid.bid_amount), 'timestamp' : bid.timestamp.isoformat()} for bid in recent_bids]

    return JsonResponse({'tech_id' : tech.id, 'teams_in_room' : teams_in_room, 'bid_history' : bid_history}, status = 200)

@api_view(['POST'])
def sync_wallets_view(request):
    """Endpoint to sync team wallets with the Hub service."""

    provided = request.headers.get('X-Host-Secret')
    expected = settings.B2B_HOST_SECRET

    if not expected or not hmac.compare_digest(provided, expected):

        return JsonResponse({'error' : "Unauthorized admin action."}, status = 403)

    try:
        data = json.loads(request.body)
        wallets = data.get('wallets', [])

        for wallet in wallets:
            Team.objects.update_or_create(
                team_code = wallet['team_code'],
                defaults = {'name' : wallet['team_name'], 'available_credits' : wallet['starting_balance'], 'escrow_credits' : 0.00}
            )

        return JsonResponse({'message' : "Wallets synced successfully."}, status = 200)
    except json.JSONDecodeError:

        return JsonResponse({'error' : "Invalid JSON payload."}, status = 400)
    
    except Exception as e:

        return JsonResponse({'error' : f"System error: {str(e)}"}, status = 500)

@api_view(['POST'])
def start_auction_view(request, tech_id):
    """Host endpoint to start an auction & the global clock."""

    provided = request.headers.get('X-Host-Secret')
    expected = settings.B2B_HOST_SECRET

    if not expected or not hmac.compare_digest(provided, expected):

        return JsonResponse({'error' : "Unauthorized admin action."}, status = 403)

    try:
        with transaction.atomic():
            tech = Technology.objects.select_for_update().get(id = tech_id)

            if tech.status != 'QUEUED':

                return JsonResponse({'error' : f"Cannot start auction. Current status is {tech.status}"}, status = 400)

            tech.status = 'ACTIVE'
            tech.end_time = timezone.now() + timedelta(minutes = 2)
            tech.save(update_fields = ['status', 'end_time'])

            end_time_iso = tech.end_time.isoformat()

            transaction.on_commit(lambda: RedisService.broadcast_auction_started(tech_id = tech.id, end_time = end_time_iso))

        return JsonResponse({'message' : f"Auction for tech {tech_id} started successfully.", 'end_time' : end_time_iso}, status = 200)
    except Technology.DoesNotExist:

        return JsonResponse({'error' : "Technology not found."}, status = 404)

@api_view(['POST'])
def settle_auction_view(request, tech_id):
    """Host endpoint triggered when countdown hits 0 to finalise the sale."""

    provided = request.headers.get('X-Host-Secret')
    expected = settings.B2B_HOST_SECRET

    if not expected or not hmac.compare_digest(provided, expected):

        return JsonResponse({'error' : "Unauthorized admin action."}, status = 403)

    try:
        with transaction.atomic():
            tech = Technology.objects.select_for_update().get(id = tech_id)

            if tech.status != 'ACTIVE':

                return JsonResponse({'error' : f"Cannot settle. Auction is currently {tech.status}."}, status = 400)

            if not tech.highest_bidder:
                tech.status = 'UNSOLD'
                tech.save(update_fields = ['status'])

                transaction.on_commit(lambda: RedisService.broadcast_auction_ended(tech_id = tech.id, status = 'UNSOLD', winner_name = None))

                return JsonResponse({'message' : "Auction closed with no bids. Status set to UNSOLD."}, status = 200)

            winner = Team.objects.select_for_update().get(id = tech.highest_bidder.id)
            winner.escrow_credits -= tech.current_highest_bid
            winner.save(update_fields = ['escrow_credits'])

            tech.status = 'SOLD'
            tech.save(update_fields = ['status'])

            winner_name = winner.name

            transaction.on_commit(lambda: RedisService.broadcast_auction_ended(tech_id = tech.id, status = 'SOLD', winner_name = winner_name))

        return JsonResponse({'message' : f"Auction settled. Won by {winner_name}."}, status = 200)
    except Technology.DoesNotExist:

        return JsonResponse({'error' : "Technology not found."}, status = 404)

    except Exception as e:

        return JsonResponse({'error' : f"System error : {str(e)}"}, status = 500)

@api_view(['POST'])
def push_final_results_view(request):
    """Master trigger to push final auction results to the hub."""

    provided = request.headers.get('X-Host-Secret')
    expected = settings.B2B_HOST_SECRET

    if not provided or not hmac.compare_digest(provided, expected):

        return JsonResponse({'error' : "Unauthorized admin action."}, status = 403)

    teams = Team.objects.prefetch_related('won_technologies').all().order_by('-available_credits')

    results = []

    for rank, team in enumerate(teams, start = 1):
        assets_won = ", ".join([tech.name for tech in team.won_technologies.all()])

        if not assets_won:
            assets_won = "No assets won"

        results.append({
            'rank' : rank,
            'team_code' : team.team_code,
            'assets' : assets_won
        })

    hub_url = getattr(settings, 'HUB_SERVICE_URL').rstrip('/')
    hub_secret = getattr(settings, 'HUB_SECRET_KEY')

    try:
        response = requests.post(f'{hub_url}/api/webhooks/ingest/bid2build/', json = {'results' : results}, headers = {'X-Hub-Secret' : hub_secret}, timeout = 5)

        if response.ok:

            return JsonResponse({'message' : "Tournament locked & results successfully synced to Hub."}, status = 200)
        
        else:

            return JsonResponse({'error' : f"Hub rejected payload: {response.text}"}, status = 502)
        
    except requests.exceptions.RequestException as e:

        return JsonResponse({'error' : f"Network error contacting Hub: {str(e)}"}, status = 503)

@api_view(['POST'])
def emergency_reset_auction_view(request, tech_id):
    """Admin endpoint to reset an auction in case of critical issues."""

    provided = request.headers.get('X-Host-Secret')
    expected = settings.B2B_HOST_SECRET

    if not expected or not hmac.compare_digest(provided, expected):

        return JsonResponse({'error' : "Unauthorized admin action."}, status = 403)

    try:
        with transaction.atomic():
            tech = Technology.objects.select_for_update().get(id = tech_id)

            if tech.status not in ['ACTIVE', 'QUEUED']:

                return JsonResponse({'error' : f"Can only reset auctions that are active or queued."}, status = 400)

            if tech.highest_bidder:
                bidder = Team.objects.select_for_update().get(id = tech.highest_bidder.id)
                bidder.available_credits += tech.current_highest_bid
                bidder.escrow_credits -= tech.current_highest_bid
                bidder.save(update_fields = ['available_credits', 'escrow_credits'])

            tech.status = 'QUEUED'
            tech.current_highest_bid = 0.00
            tech.highest_bidder = None
            tech.end_time = None
            tech.save()

            RedisService.broadcast_auction_ended(tech_id = tech.id, status = 'ABORTED', winner_name = None)

        return JsonResponse({'message' : "Auction aborted & all escrow refunded"}, status = 200)
    except Technology.DoesNotExist:

        return JsonResponse({'error' : "Technology not found."}, status = 404)
