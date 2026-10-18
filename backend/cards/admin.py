from django.contrib import admin

from .models import CreditCard


@admin.register(CreditCard)
class CreditCardAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "bank_name",
        "card_nickname",
        "last_four_digits",
        "is_active",
    ]

    list_filter = [
        "is_active",
        "currency",
    ]

    search_fields = [
        "user__username",
        "card_nickname",
        "bank_name",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]