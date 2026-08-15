# run_sweeper.py


from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from api.models import Technology
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

        with transaction.atomic():
            expired_techs = Technology.objects.select_for_update(skip_locked = True).filter(status = 'ACTIVE', end_time__lte = now)

            for tech in expired_techs:
                self.finalize_auction(tech)

    def finalize_auction(self, tech):
        if tech.highest_bidder:
            tech.status = 'SOLD'

            winner = tech.highest_bidder
            winner.escrow_credits -= tech.current_highest_bid
            winner.save(update_fields = ['escrow_credits'])

            winner_name = winner.name
        else:
            tech.status = 'UNSOLD'
            winner_name = None

        tech.save(update_fields = ['status'])

        RedisService.broadcast_auction_ended(tech_id = tech.id, winner_name = winner_name, status = tech.status)

        print(f"Finalized tech {tech.id} as {tech.status}.")