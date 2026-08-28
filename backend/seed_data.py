import os
import django
import sys

# Set up Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from api.models import Technology, Team

# Clear existing technologies
Technology.objects.all().delete()
Team.objects.all().delete()

# Build-scale's technologies based on landing page and typical startup simulation items
techs = [
    {
        "name": "AI Assistant",
        "description": "Enable intelligent features such as chatbots, smart assistants, automation, and content generation.",
        "purpose": "Automate customer support and content.",
        "category": "Core Technologies",
        "base_price": 250.00,
        "max_stock": 1,
        "stock": 1
    },
    {
        "name": "Customer Data",
        "description": "Access anonymized customer insights and data to improve analytics, personalization, and AI-driven solutions.",
        "purpose": "Analytics and personalization.",
        "category": "Business Resources",
        "base_price": 150.00,
        "max_stock": 1,
        "stock": 1
    },
    {
        "name": "Global Expansion",
        "description": "Unlock international market opportunities and scale your startup beyond the domestic market.",
        "purpose": "Expand into foreign markets rapidly.",
        "category": "Premium Assets",
        "base_price": 400.00,
        "max_stock": 1,
        "stock": 1
    },
    {
        "name": "Blockchain Network",
        "description": "Secure, decentralized infrastructure for your products.",
        "purpose": "Enhance security and transparency.",
        "category": "Core Technologies",
        "base_price": 300.00,
        "max_stock": 1,
        "stock": 1
    },
    {
        "name": "Enterprise Contracts",
        "description": "Secured B2B contracts with major corporations.",
        "purpose": "Instant revenue stream and credibility.",
        "category": "Special Assets", # Wait, category choices are Core Technologies, Business Resources, Premium Assets
        "base_price": 500.00,
        "max_stock": 1,
        "stock": 1
    }
]

for t in techs:
    cat = t['category']
    if cat not in ["Core Technologies", "Business Resources", "Premium Assets"]:
        cat = "Premium Assets"
    
    Technology.objects.create(
        name=t['name'],
        description=t['description'],
        purpose=t['purpose'],
        category=cat,
        base_price=t['base_price'],
        max_stock=t['max_stock'],
        stock=t['stock'],
        status='QUEUED'
    )

print("Technologies seeded.")

# Create some test teams
Team.objects.create(name="Team Alpha", team_code="PIN123", available_credits=1000)
Team.objects.create(name="Team Beta", team_code="PIN456", available_credits=1000)

print("Teams seeded. Use team codes: PIN123, PIN456")

