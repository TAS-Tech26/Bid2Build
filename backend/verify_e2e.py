
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()
from api.models import Team
team = Team.objects.filter(team_code='2SJ7T4').first()
if team:
    print(f"SUCCESS: B2B Team {team.team_code} found with wallet balance {team.wallet_balance}")
else:
    print("FAILED: B2B Team not found!")
