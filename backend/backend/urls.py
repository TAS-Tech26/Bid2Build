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
from django.urls import include, path

from api.views import back_out_auction_view, join_auction_view, place_bid_view


urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/bid/', place_bid_view, name = 'place_bid'),
    path('api/join/', join_auction_view, name = 'join_auction'),
    path('api/back-out/', back_out_auction_view, name = 'back_out_auction')
]
