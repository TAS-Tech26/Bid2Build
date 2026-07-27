# serializers.py


from decimal import Decimal, InvalidOperation

import json


class BidSerializer:

    def __init__(self, request_body):
        self.errors = None
        self.validated_data = None

        self._parse_and_validate(request_body)

    def _parse_and_validate(self, body):
        try:
            data = json.loads(body)
            team_id = data.get('team_id')
            tech_id = data.get('tech_id')
            bid_amount_str = data.get('bid_amount')

            if not all([team_id, tech_id, bid_amount_str]):
                self.errors = "Missing required fields."

                return

            self.validated_data = {'team_id' : int(team_id), 'tech_id' : int(tech_id), 'bid_amount' : Decimal(str(bid_amount_str))}
        except (json.JSONDecodeError, ValueError, InvalidOperation):
            self.errors = "Invalid payload format."

    def is_valid(self):

        return self.errors is None


class ParticipantActionSerializer:

    def __init__(self, request_body):
        self.errors = None
        self.validated_data = None
        
        self._parse_and_validate(request_body)

    def _parse_and_validate(self, body):
        try:
            data = json.loads(body)
            team_id = data.get('team_id')
            tech_id = data.get('tech_id')

            if not all([team_id, tech_id]):
                self.errors = "Missing required fields: team_id, tech_id"

                return

            self.validated_data = {'team_id' : int(team_id), 'tech_id' : int(tech_id)}
        except (json.JSONDecodeError, ValueError):
            self.errors = "Invalid payload format."

    def is_valid(self):

        return self.errors is None


class TechnologySerializer:

    @staticmethod
    def serialize_many(tech_queryset):

        return [{
            'id' : tech.id,
            'name' : tech.name,
            'status' : tech.status,
            'base_price' : str(tech.base_price),
            'current_highest_bid' : str(tech.current_highest_bid),
            'highest_bidder_id' : tech.highest_bidder_id,
            'highest_bidder_name' : tech.highest_bidder.name if tech.highest_bidder else None,
            'end_time' : tech.end_time.isoformat() if tech.end_time else None
        } for tech in tech_queryset]


class LeaderboardSerializer:

    @staticmethod
    def serialize_many(team_queryset):

        return [{
            'team_id' : team.id,
            'team_name' : team.name,
            'available_credits' : str(team.available_credits),
            'escrow_credits' : str(team.escrow_credits),
            'secured_technologies' : [{'tech_id' : tech.id, 'name' : tech.name, 'winning_bid' : str(tech.current_highest_bid)} for tech in team.won_technologies.all()]
        } for team in team_queryset]