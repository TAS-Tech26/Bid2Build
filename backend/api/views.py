# views.py


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .handlers import BidHandler, ParticipantHandler
from .serializers import BidSerializer, ParticipantActionSerializer


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