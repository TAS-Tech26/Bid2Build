# redis_service.py

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class RedisService:
    
    """It has only 1 job - Push data to Redis queue"""

    @staticmethod
    def broadcast_new_bid(tech_id, bid_amount, team_name):
        """Pushes the new highest bid to the specific technology's WS group"""

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tech_{tech_id}',
            {'type' : 'bid_update', 'payload' : {'tech_id' : tech_id, 'new_highest_bid' : bid_amount, 'highest_bidder_name' : team_name}}
        )

    @staticmethod
    def broadcast_participant_update(tech_id, team_name, status):
        """Pushes state changes for participants entering/exiting the room."""

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f'tech_{tech_id}',
            {'type' : 'participant_update', 'payload' : {'tech_id' : tech_id, 'team_name' : team_name, 'status' : status}}
        )

    @staticmethod
    def broadcast_auction_ended(tech_id, status, winner_name):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tech_{tech_id}',
            {'type' : 'auction_ended', 'payload' : {'tech_id' : tech_id, 'status' : status, 'winner_name' : winner_name}}
        )

    @staticmethod
    def broadcast_auction_started(tech_id, end_time):
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(f'tech_{tech_id}', {'type' : 'auction_started', 'payload' : {'tech_id' : tech_id, 'end_time' : end_time}})