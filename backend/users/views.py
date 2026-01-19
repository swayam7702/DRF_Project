from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework import viewsets, generics
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message":"Registration Successfull!"
                },
                status=status.HTTP_201_CREATED
            )
        
        errors = serializer.errors
        first_field = list(errors.keys())[0]
        first_message = errors[first_field][0]

        return Response(
            {
                "message":first_message
            },
            status = status.HTTP_400_BAD_REQUEST
        )


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
                        # "password":user.password
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



class ProfileView(APIView):
    permission_classes = [IsAuthenticated]


    def get(self,request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self,request):
        serializer = ProfileSerializer(
            request.user,
            data = request.data
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    'message':"Profile Updated!"
                }
            )
        first_error = list(serializer.errors.values())[0][0]
        return Response(
            {
                'message':first_error,
            },
            status = status.HTTP_400_BAD_REQUEST
        )