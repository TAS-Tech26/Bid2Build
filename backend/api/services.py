# services.py


from decimal import Decimal
from django.db import transaction, IntegrityError

from .models import Team, Technology


def process_bid(team_id, tech_id, bid_amount):
    """Executes a thread-safe atomic bid. Returns a tuple : Success bool, msg str"""
    try:
        with transaction.atomic():
            tech = Technology.objects.select_for_update().get(id = tech_id) # Lock the Technology row 1st to prevent concurrent read/writes. All other requests will be
                                                                                # queued.
            
            if tech.status != 'ACTIVE':

                return (False, "This technology is not currently active for bidding.")
            
            if bid_amount <= tech.current_highest_bid:

                return (False, "Bid must be strictly higher than the current highest bid.")
            
            team = Team.objects.select_for_update().get(id = team_id) # Lock the bidding team row

            if team.available_credits < bid_amount:

                return (False, "Insufficient available credits.")
            
            # Escrow refund mechanism
            if tech.highest_bidder:
                # Lock the previous highest bidder to refund them
                previous_team = Team.objects.select_for_update().get(id = tech.highest_bidder)
                previous_team.escrow_credits -= tech.current_highest_bid
                previous_team.available_credits += tech.current_highest_bid
                previous_team.save()
            
            # Escrow deduction mechanism (For new bids)
            team.available_credits -= bid_amount
            team.escrow_credits += bid_amount
            team.save()
            
            tech.current_highest_bid = bid_amount
            tech.highest_bidder = team

            tech.save()

            return (True, "Bid successfully placed.")
    except Technology.DoesNotExist:

        return (False, "Technology not found.")
    
    except Team.DoesNotExist:

        return (False, "Team not found.")
    
    except IntegrityError:

        return (False, "Critical integrity error: Transaction rejected by DB.")
    
    except Exception as e:

        return (False, f"System error: {str(e)}")