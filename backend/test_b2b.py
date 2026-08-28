import os
import sys
import json
import django
from django.test import Client

# Set up Django environment to test without needing a running server
# This allows us to verify database changes directly
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Team
from django.conf import settings

def test_sync_wallets():
    print("Testing sync-wallets endpoint...")
    
    client = Client()
    
    # Payload similar to what Hub sends
    payload = {
        "wallets": [
            {
                "team_code": "TEST_T1",
                "team_name": "Test Alpha",
                "starting_balance": 1500.50
            },
            {
                "team_code": "TEST_T2",
                "team_name": "Test Beta",
                "starting_balance": 2500.00
            }
        ]
    }
    
    headers = {
        "HTTP_X_HOST_SECRET": settings.B2B_HOST_SECRET,
        "CONTENT_TYPE": "application/json"
    }
    
    print(f"\nSending payload to /api/admin/sync-wallets/:")
    print(json.dumps(payload, indent=2))
    
    # Clean up any existing test teams before running
    Team.objects.filter(team_code__in=["TEST_T1", "TEST_T2"]).delete()
    
    # Perform the POST request
    response = client.post(
        '/api/admin/sync-wallets/', 
        data=payload,
        content_type='application/json',
        **headers
    )
    
    print(f"\nResponse Status Code: {response.status_code}")
    print(f"Response Body: {response.json()}")
    
    if response.status_code == 200:
        print("\nVerifying database records...")
        team1 = Team.objects.filter(team_code="TEST_T1").first()
        team2 = Team.objects.filter(team_code="TEST_T2").first()
        
        if team1 and team2:
            print("Database Verification: SUCCESS")
            print(f"- Found Team 1: {team1.name}, Balance: {team1.available_credits}")
            print(f"- Found Team 2: {team2.name}, Balance: {team2.available_credits}")
        else:
            print("Database Verification: FAILED (Teams not saved in DB)")
    else:
        print("Test FAILED (Endpoint did not return 200 OK)")
        
if __name__ == "__main__":
    test_sync_wallets()
