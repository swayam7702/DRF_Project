from zoneinfo import ZoneInfo, ZoneInfoNotFoundError
from decimal import Decimal
from rest_framework import serializers

from .models import FinancialProfile


class FinancialProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialProfile

        fields = [
            "id",
            "monthly_income",
            "salary_day",
            "currency",
            "timezone",
            "planned_monthly_savings",
            "protected_cash_buffer",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]

    def validate_timezone(self, value):
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError):
            raise serializers.ValidationError(
                "Enter a valid timezone, such as Asia/Kolkata."
            )

        return value

    def validate(self, attrs):
        unknown_fields = set(self.initial_data) - set(self.fields)

        if unknown_fields:
            raise serializers.ValidationError(
                {
                    field: ["This field is not supported."]
                    for field in sorted(unknown_fields)
                }
            )

        monthly_income = attrs.get(
            "monthly_income",
            (
                self.instance.monthly_income
                if self.instance is not None
                else None
            ),
        )

        planned_savings = attrs.get(
            "planned_monthly_savings",
            (
                self.instance.planned_monthly_savings
                if self.instance is not None
                else Decimal("0.00")
            ),
        )

        if (
            monthly_income is not None
            and planned_savings > monthly_income
        ):
            raise serializers.ValidationError(
                {
                    "planned_monthly_savings": [
                        (
                            "Your planned monthly savings cannot exceed "
                            "your monthly take-home income. Reduce your "
                            "savings target or update your income."
                        )
                    ]
                }
            )

        return attrs