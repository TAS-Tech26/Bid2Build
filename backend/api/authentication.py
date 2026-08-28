# authentication.py


from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed

import jwt


User = get_user_model()


class HubJWTAuthentication(authentication.BaseAuthentication):

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith("Bearer "):

            return None

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(token, settings.HUB_SECRET_KEY, algorithms = ['HS256'])

            if payload.get('role') in ['host', 'admin']:
                user, _ = User.objects.get_or_create(username = payload.get('username', 'admin'))
                
                if not user.is_staff:
                    user.is_staff = True
                    user.save(update_fields = ['is_staff'])
                
                # Assign role dynamically so views.py checks pass
                user.role = 'admin'
                return (user, token)

            elif 'team_code' in payload:
                class AuthenticatedTeam:

                    def __init__(self, team_code, event_name, role):
                        self.team_code = team_code
                        self.event_name = event_name
                        self.role = role
                        self.is_authenticated = True

                return (AuthenticatedTeam(payload['team_code'], payload.get('event_name', 'BID2BUILD'), payload.get('role', 'participant')), token)
            else:
                raise AuthenticationFailed("Unrecognised token payload structure.")
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid cryptographic signature.")