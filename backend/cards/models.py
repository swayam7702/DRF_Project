from decimal import Decimal
from django.db.models.functions import Lower
from django.conf import settings
from django.core.validators import (
    MaxValueValidator,
    MinValueValidator,
    RegexValidator,
)
from django.db import models


class CreditCard(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="credit_cards",
    )

    bank_name = models.CharField(max_length=100)

    card_nickname = models.CharField(max_length=100)

    last_four_digits = models.CharField(
        max_length=4,
        validators=[
            RegexValidator(
                regex=r"\A[0-9]{4}\Z",
                message="Enter exactly four digits.",
            )
        ],
    )

    credit_limit = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[
            MinValueValidator(
                Decimal("0.01"),
                message="Credit limit must be greater than zero.",
            )
        ],
    )

    currency = models.CharField(
        max_length=3,
        choices=[("INR", "Indian Rupee")],
        default="INR",
    )

    statement_day = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(31),
        ],
    )

    due_day = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1),
            MaxValueValidator(31),
        ],
    )

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]

        constraints = [
            models.CheckConstraint(
                condition=models.Q(credit_limit__gt=0),
                name="cards_credit_limit_positive",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(statement_day__isnull=True)
                    | models.Q(
                        statement_day__gte=1,
                        statement_day__lte=31,
                    )
                ),
                name="cards_statement_day_valid",
            ),
            models.CheckConstraint(
                condition=(
                    models.Q(due_day__isnull=True)
                    | models.Q(
                        due_day__gte=1,
                        due_day__lte=31,
                    )
                ),
                name="cards_due_day_valid",
            ),
            models.UniqueConstraint(
                models.F("user"),
                Lower("bank_name"),
                models.F("last_four_digits"),
                name="cards_unique_user_bank_last4",
            ),
        ]

    def __str__(self):
        return f"{self.card_nickname} ending {self.last_four_digits}"