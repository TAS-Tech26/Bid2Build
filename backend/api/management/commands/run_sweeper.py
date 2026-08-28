# run_sweeper.py


from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from api.models import AssetPurchase, Team, Technology
from api.redis_service import RedisService

import logging, time


logger = logging.getLogger(__name__)


class Command(BaseCommand):

    """Continuously polls & finalizes expired auctions."""

    def handle(self, *args, **options):
        print("Starting sweeper...")

        while True:
            try:
                self.sweep_expired_auctions()
            except Exception as e:
                logger.error(f"Sweeper failed with error: {str(e)}")

            time.sleep(1) # Poll every second

    def sweep_expired_auctions(self):
        now = timezone.now()
        
        # Fetch IDs first to avoid long-running locks on multiple rows
        expired_tech_ids = list(Technology.objects.filter(status = 'ACTIVE', end_time__lte = now).values_list('id', flat = True))

        for tech_id in expired_tech_ids:
            try:
                self.finalize_auction_atomic(tech_id)
            except Exception as e:
                logger.error(f"Failed to finalize tech {tech_id}: {e}")

    def finalize_auction_atomic(self, tech_id):
        with transaction.atomic():
            try:
                tech = Technology.objects.select_for_update(skip_locked = True).get(id = tech_id, status = 'ACTIVE')
            except Technology.DoesNotExist:
                return # Might have been finalized by another process or view

            if tech.highest_bidder:
                # Fetch winner with a lock to prevent wallet race conditions    
                winner = Team.objects.select_for_update().get(id = tech.highest_bidder_id)
                winner.escrow_credits -= tech.current_highest_bid
                winner.save(update_fields = ['escrow_credits'])

                AssetPurchase.objects.create(team = winner, technology = tech, purchase_price = tech.current_highest_bid)

                winner_name = winner.name

                if tech.stock > 1:
                    tech.stock -= 1
                    tech.status = 'QUEUED'
                    tech.highest_bidder = None
                    tech.current_highest_bid = 0.00
                    tech.end_time = None
                else:
                    tech.stock = 0
                    tech.status = 'SOLD'
            else:
                tech.status = 'UNSOLD'
                tech.highest_bidder = None
                tech.current_highest_bid = 0.00
                tech.end_time = None
                winner_name = None

            tech.save(update_fields = ['status', 'stock', 'highest_bidder', 'current_highest_bid', 'end_time'])

            transaction.on_commit(lambda t=tech.id, w=winner_name, s=tech.status: RedisService.broadcast_auction_ended(tech_id = t, winner_name = w, status = s))

            print(f"Finalized tech {tech.id} as {tech.status}.")
