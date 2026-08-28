# consumers.py


from channels.generic.websocket import AsyncWebsocketConsumer

import json


class BidConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        # Extract tech_id from URL routing
        self.tech_id = self.scope['url_route']['kwargs']['tech_id']
        self.room_group_name = f'tech_{self.tech_id}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name) # Join the tech-specific Redis group
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    # This func is called by RedisService
    async def bid_update(self, event):
        await self.send(text_data = json.dumps({'type': 'bid_update', 'data': event['payload']}))

    async def participant_update(self, event):
        await self.send(text_data = json.dumps({'type': 'participant_update', 'data': event['payload']}))

    async def auction_ended(self, event):
        """Triggered in the bg when timer hits 0."""

        await self.send(text_data = json.dumps({'type': 'auction_ended', 'data': event['payload']}))

    async def auction_started(self, event):
        """Triggered when the auction is started by the admin."""

        await self.send(text_data = json.dumps({'type': 'auction_started', 'data': event['payload']}))


class GlobalConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'global_notifications'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def market_disruption(self, event):
        await self.send(text_data = json.dumps({'type': 'market_disruption', 'data': event['payload']}))