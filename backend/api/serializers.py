# serializers.py


from decimal import Decimal, InvalidOperation
import json
from rest_framework import serializers


class BidSerializer(serializers.Serializer):

    team_id = serializers.IntegerField()
    tech_id = serializers.IntegerField()    
    bid_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    '''def __init__(self, request_body):
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
'''

class LoginSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField()