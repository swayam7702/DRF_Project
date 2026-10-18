from django.contrib import admin

from .models import FinancialProfile


@admin.register(FinancialProfile)
class FinancialProfileAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "currency",
        "salary_day",
        "updated_at",
    ]

    search_fields = [
        "user__username",
        "user__email",
    ]

    readonly_fields = [
        "created_at",
        "updated_at",
    ]