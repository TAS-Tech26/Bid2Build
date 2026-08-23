# models.py


from django.db import models
from django.db.models import CheckConstraint, Q


class Team(models.Model):

    name = models.CharField(max_length = 255, unique = True)
    team_code = models.CharField(max_length = 10, unique = True, db_index = True)
    available_credits = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0.00)
    escrow_credits = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0.00)

    class Meta:

        constraints = [
            CheckConstraint(condition = Q(available_credits__gte = 0), name = 'available_credits_non_negative'),
            CheckConstraint(condition = Q(escrow_credits__gte = 0), name = 'escrow_credits_non_negative')
        ]

    def __str__(self):

        return self.name


class Technology(models.Model):

    STATUS_CHOICES = [('QUEUED', 'Queued'), ('ACTIVE', 'Active'), ('SOLD', 'Sold'), ('UNSOLD', 'Unsold')]

    name = models.CharField(max_length = 255)
    description = models.TextField(blank = True)
    status = models.CharField(max_length = 10, choices = STATUS_CHOICES, default = 'QUEUED')
    base_price = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0.00)
    current_highest_bid = models.DecimalField(max_digits = 10, decimal_places = 2, default = 0.00)
    end_time = models.DateTimeField(null = True, blank = True)

    highest_bidder = models.ForeignKey(Team, null = True, blank = True, on_delete = models.SET_NULL, related_name = 'won_technologies')

    class Meta:

        # Index for the exact query the automated sweeper will use.
        indexes = [models.Index(fields = ['status', 'end_time'])]

        constraints = [
            CheckConstraint(condition = Q(base_price__gte = 0), name = 'base_price_non_negative'),
            CheckConstraint(condition = Q(current_highest_bid__gte = 0), name = 'bid_non_negative')
        ]

    def __str__(self):

        return f"{self.name} - {self.status}"


class AuctionParticipant(models.Model):

    is_active = models.BooleanField(default = True) # False means they clicked "Back Out"

    team = models.ForeignKey(Team, on_delete = models.CASCADE)
    technology = models.ForeignKey(Technology, on_delete = models.CASCADE)

    class Meta:

        unique_together = ('team', 'technology')


class BidLog(models.Model):

    bid_amount = models.DecimalField(max_digits = 10, decimal_places = 2)
    timestamp = models.DateTimeField(auto_now_add = True, db_index = True)

    team = models.ForeignKey(Team, on_delete = models.CASCADE)
    technology = models.ForeignKey(Technology, on_delete = models.CASCADE, related_name = 'bid_history')

    class Meta:

        ordering = ['-timestamp']