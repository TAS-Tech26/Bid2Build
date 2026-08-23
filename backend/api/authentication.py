# authentication.py


from django.conf import settings
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

import jwt


class HubJWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):

            return None

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.HUB_SECRET_KEY, algorithms = ['HS256'])

            class AuthenticatedTeam:

                def __init__(self, team_code, event_name):
                    self.team_code = team_code
                    self.event_name = event_name
                    self.is_authenticated = True

            return (AuthenticatedTeam(payload['team_code'], payload['event_name']), token)
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid cryptographic signature.")

        