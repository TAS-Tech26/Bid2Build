"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# urls.py


from django.contrib import admin
from django.urls import path

from api.views import (
    back_out_auction_view, get_all_technologies_view, get_leaderboard_view, get_room_details_view, join_auction_view, place_bid_view, push_final_results_view,
    sync_wallets_view
)


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/admin/sync-wallets/', sync_wallets_view, name = 'sync_wallets'),

    path('api/bid/', place_bid_view, name = 'place_bid'),
    path('api/join/', join_auction_view, name = 'join_auction'),
    path('api/back-out/', back_out_auction_view, name = 'back_out_auction'),

    path('api/items/', get_all_technologies_view, name = 'get_all_technologies'),
    path('api/leaderboard/', get_leaderboard_view, name = 'get_leaderboard'),
    path('api/items/<int:tech_id>/room/', get_room_details_view, name = 'get_room_details'),

    path('api/admin/end-tournament/', push_final_results_view, name = 'end_tournament'),
]
