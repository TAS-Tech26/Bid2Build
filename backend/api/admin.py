# admin.py


from django.contrib import admin
from django.utils import timezone

from .models import AuctionParticipant, Team, Technology


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):

    list_display = ('name', 'available_credits', 'escrow_credits', 'total_assets')
    search_fields = ('name',)

    readonly_fields = ('escrow_credits',) # Prevent admins from manually altering money that's locked in a bid

    def total_assets(self, obj):

        return obj.available_credits + obj.escrow_credits

    total_assets.short_description = "Total Assets (Available + Escrow)"


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):

    list_display = ('name', 'status', 'base_price', 'current_highest_bid', 'highest_bidder', 'is_active_timer')
    list_filter = ('status',)
    search_fields = ('name',)

    readonly_fields = ('current_highest_bid', 'highest_bidder', 'end_time')

    def is_active_timer(self, obj):
        if obj.end_time and timezone.now() > obj.end_time:

            return 'Expired'

        return 'Running' if obj.end_time else "Not Started"

    is_active_timer.short_description = "Timer Status"


@admin.register(AuctionParticipant)
class AuctionParticipantAdmin(admin.ModelAdmin):
    
    list_display = ('team', 'technology', 'is_active')
    list_filter = ('is_active', 'technology')
    search_fields = ('team__name', 'technology__name')
