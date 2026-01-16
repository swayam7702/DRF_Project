from rest_framework import routers
from django.urls import path
from .views import *
router = routers.DefaultRouter()


urlpatterns =[
    path('register/', RegisterView.as_view(),name="register"),
    path('login/',LoginView.as_view(),name="login"),
    # path("profile/", ProfileView.as_view()),
]
