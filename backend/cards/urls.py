from django.urls import path

from .views import CreditCardListCreateView


app_name = "cards"


urlpatterns = [
    path(
        "cards/",
        CreditCardListCreateView.as_view(),
        name="card-list-create",
    ),
]