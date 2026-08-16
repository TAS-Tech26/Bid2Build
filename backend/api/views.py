# views.py


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth import authenticate
from .handlers import BidHandler
from .serializers import BidSerializer, LoginSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

@api_view(['POST'])
def place_bid_view(request):
    serializer = BidSerializer(data=request.data)
    if not serializer.is_valid():
        return JsonResponse({'error' : serializer.errors}, status = 400)
    data = serializer.validated_data
    success, message = BidHandler.process_transaction(team_id = data['team_id'], tech_id = data['tech_id'], bid_amount = data['bid_amount'])
    if success:
        return JsonResponse({'message' : message}, status = 200)
    else:
        return JsonResponse({'error' : message}, status = 400)

@api_view(['POST'])
def login(request):
    serialiser=LoginSerializer(data=request.data)

    if not serialiser.is_valid():
        return Response(serialiser.errors, status=400)
    
    username=serialiser.validated_data["username"]   
    password=serialiser.validated_data["password"]
    user=authenticate(
        username=username,
        password=password,
    )

    if user is None:
        return Response({
            "success":False,
            "message":"Invalid username or password"
        }, status=401)

    team=user.team
    token,created=Token.objects.get_or_create(user=user)
    return Response({
        "successful":True,
        "token":token.key,
        "team":{
            "id":team.id,
            "name":team.name,
            "available_credits":team.available_credits,
            "escrow_credits":team.escrow_credits,
        }
    })

