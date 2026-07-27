# views.py


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .handlers import BidHandler
from .serializers import BidSerializer


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