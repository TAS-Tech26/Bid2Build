# views.py


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET

from .handlers import BidHandler, ParticipantHandler
from .models import AuctionParticipant, BidLog, Team, Technology
from .serializers import BidSerializer, LeaderboardSerializer, ParticipantActionSerializer, TechnologySerializer


@csrf_exempt # Remove this when proper frontend auth has been est.
@require_POST
def place_bid_view(request):
    serializer = BidSerializer(request.body)

    if not serializer.is_valid():

        return JsonResponse({'error' : serializer.errors}, status = 400)

    data = serializer.validated_data

    success, message = BidHandler.process_transaction(team_id = data['team_id'], tech_id = data['tech_id'], bid_amount = data['bid_amount'])

    if success:

        return JsonResponse({'message' : message}, status = 200)

    else:

        return JsonResponse({'error' : message}, status = 400)

@csrf_exempt
@require_POST
def join_auction_view(request):
    serializer = ParticipantActionSerializer(request.body)

    if not serializer.is_valid():

        return JsonResponse({'error' : serializer.errors}, status = 400)

    data = serializer.validated_data
    success, message = ParticipantHandler.join_auction(team_id = data['team_id'], tech_id = data['tech_id'])

    if success:

        return JsonResponse({'message' : message}, status = 200)

    else:

        return JsonResponse({'error' : message}, status = 400)

@csrf_exempt
@require_POST
def back_out_auction_view(request):
    serializer = ParticipantActionSerializer(request.body)

    if not serializer.is_valid():

        return JsonResponse({'error' : serializer.errors}, status = 400)

    data = serializer.validated_data
    success, message = ParticipantHandler.back_out_auction(team_id = data['team_id'], tech_id = data['tech_id'])

    if success:

        return JsonResponse({'message' : message}, status = 200)

    else:

        return JsonResponse({'error' : message}, status = 400)

@require_GET
def get_all_technologies_view(request):
    technologies = Technology.objects.select_related('highest_bidder').all().order_by('id')

    data = TechnologySerializer.serialize_many(technologies)

    return JsonResponse({'technologies' : data}, status = 200)

@require_GET
def get_leaderboard_view(request):
    teams = Team.objects.prefetch_related('won_technologies').all().order_by('-available_credits')

    data = LeaderboardSerializer.serialize_many(teams)

    return JsonResponse({'leaderboard' : data}, status = 200)

@require_GET
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