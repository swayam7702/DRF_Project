from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, generics
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .serializers import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LoginView(APIView):
    def post(self,request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {
                    "messgae":"Username and Password are required!"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        user = authenticate(username=username, password=password)

        if user is not None:
            login(request,user)
            return Response(
                {
                    "message":"Login success!",
                    "user":{
                        "id":user.id,
                        "username":user.username,
                        "password":user.password
                    }
                },
                status=status.HTTP_200_OK
            )
        else:
            return Response(
                {
                    "message":"Invalid Credentials"
                },
                status=status.HTTP_401_UNAUTHORIZED
            )






