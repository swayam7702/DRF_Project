from django.urls import path

from .views import FinancialProfileView


app_name = "financial_profiles"


urlpatterns = [
    path(
        "financial-profile/",
        FinancialProfileView.as_view(),
        name="financial-profile",
    ),
]