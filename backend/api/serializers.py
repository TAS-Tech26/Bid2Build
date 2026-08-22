# serializers.py


from rest_framework import serializers


class BidSerializer(serializers.Serializer):
    tech_id = serializers.IntegerField()    
    bid_amount = serializers.DecimalField(max_digits = 10, decimal_places = 2)
    

class ParticipantActionSerializer(serializers.Serializer):
    tech_id = serializers.IntegerField()

class LoginSerializer(serializers.Serializer):
    team_code=serializers.CharField(max_length=4)

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