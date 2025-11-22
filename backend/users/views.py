from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, generics
from django.contrib.auth.models import User
from .serializers import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
