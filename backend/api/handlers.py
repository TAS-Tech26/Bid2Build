# handlers.py


from datetime import timedelta
from django.db import IntegrityError, transaction, OperationalError
from django.utils import timezone

from .models import AuctionParticipant, BidLog, Team, Technology
from .redis_service import RedisService

import logging


logger = logging.getLogger(__name__)


class BidHandler:

    @staticmethod
    def process_transaction(team_id, tech_id, bid_amount):
        try:
            with transaction.atomic():
                # Lock target tech for bidding
                tech = Technology.objects.select_for_update().get(id = tech_id)

                if tech.status != 'ACTIVE':

                    return False, "This technology isn't currently active."

                if tech.end_time and timezone.now() > tech.end_time:

                    return False, "This auction has already concluded."

                if bid_amount < tech.base_price:

                    return False, "Bid must meet or exceed the base price."

                if bid_amount <= tech.current_highest_bid:

                    return False, "Bid must be strictly higher than the current highest bid."

                # Lock bidder
                team = Team.objects.select_for_update().get(id = team_id)

                if tech.highest_bidder_id == team.id:

                    return False, "You already hold the highest bid."

                # Back out validation
                participant = AuctionParticipant.objects.filter(team = team, technology = tech).first()

                if participant and not participant.is_active:

                    return False, "You have backed out of this auction & cannot place further bids."

                if team.available_credits < bid_amount:

                    return False, "Insufficient available credits."

                # Outbid cond - Escrow refund
                if tech.highest_bidder_id:
                    previous_team = Team.objects.select_for_update().get(id = tech.highest_bidder_id)
                    previous_team.escrow_credits -= tech.current_highest_bid
                    previous_team.available_credits += tech.current_highest_bid
                    previous_team.save()

                # Escrow deduction
                team.available_credits -= bid_amount
                team.escrow_credits += bid_amount
                team.save()

                # Update state
                tech.current_highest_bid = bid_amount
                tech.highest_bidder = team
                tech.end_time = timezone.now() + timedelta(seconds = 15)
                tech.save()

                BidLog.objects.create(technology = tech, team = team, bid_amount = bid_amount)

                # Explicitly wait for Postgres to confirm the commit before hitting Redis
                transaction.on_commit(lambda: RedisService.broadcast_new_bid(tech_id = tech_id, bid_amount = str(bid_amount), team_name = team.name))

                return True, "Bid successfully placed."
        except Technology.DoesNotExist:

            return False, "Technology not found."

        except Team.DoesNotExist:

            return False, "Team not found."

        except OperationalError as e:
            logger.error(f"Database operational error (possible deadlock) on tech {tech_id}: {str(e)}")

            return False, "Transaction blocked due to high traffic. Try again."

        except IntegrityError:

            return False, "Database integrity error."

        except Exception as e:
            logger.error(f"System error during bid processing: {str(e)}")
            
            return False, f"System error: {str(e)}"


class ParticipantHandler:

    @staticmethod
    def join_auction(team_id, tech_id):
        try:
            with transaction.atomic():
                tech = Technology.objects.get(id = tech_id)

                team = Team.objects.get(id = team_id)

                if tech.status != 'ACTIVE':

                    return False, "This auction isn't active."

                participant, created = AuctionParticipant.objects.get_or_create(team = team, technology = tech, defaults = {'is_active' : True})

                if not created and not participant.is_active:

                    return False, "You have permanently backed out of this auction & cannot return."

                if created:
                    transaction.on_commit(lambda: RedisService.broadcast_participant_update(tech_id = tech_id, team_name = team.name, status = 'JOINED'))

                return True, "Successfully joined the auction."
        except Technology.DoesNotExist:

            return False, "Technology not found."

        except Team.DoesNotExist:

            return False, "Team not found."

        except Exception as e:
            logger.error(f"Error joining auction: {str(e)}")

            return False, "System error."

    @staticmethod
    def back_out_auction(team_id, tech_id):
        try:
            with transaction.atomic():
                tech = Technology.objects.select_for_update().get(id = tech_id)

                if tech.highest_bidder_id == team_id:

                    return False, "You cannot back out while holding the highest bid."

                participant = AuctionParticipant.objects.select_for_update().get(team_id = team_id, technology_id = tech_id)

                if not participant.is_active:

                    return False, "You have already backed out."

                participant.is_active = False
                participant.save()

                transaction.on_commit(lambda: RedisService.broadcast_participant_update(tech_id = tech_id, team_name = participant.team.name, status = 'BACKED_OUT'))

                return True, "Successfully backed out of the auction."
        except Technology.DoesNotExist:

            return False, "Technology not found."

        except AuctionParticipant.DoesNotExist:

            return False, "You are not an active participant in this auction."

        except Exception as e:
            logger.error(f"Error backing out of the auction: {str(e)}")

            return False, "System error."