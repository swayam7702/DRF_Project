from rest_framework import routers
from django.urls import path
from .views import RegisterView 
router = routers.DefaultRouter()


urlpatterns =[
    path('register/', RegisterView.as_view())
]
