from collections.abc import Mapping

from rest_framework import serializers

from .models import CreditCard


class CreditCardSerializer(serializers.ModelSerializer):
    WRITABLE_FIELDS = {
        "bank_name",
        "card_nickname",
        "last_four_digits",
        "credit_limit",
        "currency",
        "statement_day",
        "due_day",
    }

    class Meta:
        model = CreditCard

        fields = [
            "id",
            "bank_name",
            "card_nickname",
            "last_four_digits",
            "credit_limit",
            "currency",
            "statement_day",
            "due_day",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "is_active",
            "created_at",
            "updated_at",
        ]

        extra_kwargs = {
            "bank_name": {
                "error_messages": {
                    "required": "Bank name is required.",
                    "blank": "Bank name cannot be empty.",
                }
            },
            "card_nickname": {
                "error_messages": {
                    "required": "Card nickname is required.",
                    "blank": "Card nickname cannot be empty.",
                }
            },
            "last_four_digits": {
                "error_messages": {
                    "required": "Last four digits are required.",
                    "blank": "Last four digits cannot be empty.",
                    "max_length": "Enter exactly four digits.",
                }
            },
        }

        validators = []

    def to_internal_value(self, data):
        if isinstance(data, Mapping):
            unsupported_fields = (
                set(data.keys()) - self.WRITABLE_FIELDS
            )

            if unsupported_fields:
                raise serializers.ValidationError(
                    {
                        field: ["This field is not accepted."]
                        for field in sorted(unsupported_fields)
                    }
                )

        return super().to_internal_value(data)

    def validate_bank_name(self, value):
        return self.normalize_label(value)

    def validate_card_nickname(self, value):
        return self.normalize_label(value)

    def validate(self, attrs):
        request = self.context["request"]

        bank_name = attrs.get(
            "bank_name",
            (
                self.instance.bank_name
                if self.instance is not None
                else None
            ),
        )

        last_four_digits = attrs.get(
            "last_four_digits",
            (
                self.instance.last_four_digits
                if self.instance is not None
                else None
            ),
        )

        if bank_name is None or last_four_digits is None:
            return attrs

        matching_cards = CreditCard.objects.filter(
            user=request.user,
            bank_name__iexact=bank_name,
            last_four_digits=last_four_digits,
        )

        if self.instance is not None:
            matching_cards = matching_cards.exclude(
                pk=self.instance.pk
            )

        if matching_cards.exists():
            raise serializers.ValidationError(
                {
                    "last_four_digits": [
                        (
                            "You already have a card from this bank "
                            "ending with these digits. Use the existing "
                            "card instead of adding it again."
                        )
                    ]
                }
            )

        return attrs

    @staticmethod
    def normalize_label(value):
        return " ".join(value.split())