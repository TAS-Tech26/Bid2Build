# asgi.py


from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path

from api.consumers import BidConsumer, GlobalConsumer

import os


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': URLRouter([
        path('ws/bids/<int:tech_id>/', BidConsumer.as_asgi()),
        path('ws/global/', GlobalConsumer.as_asgi())
    ])
})
