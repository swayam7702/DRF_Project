# from django.shortcuts import render
# from rest_framework.permissions import AllowAny
# from rest_framework import viewsets, generics
# from django.contrib.auth.models import User
# from django.contrib.auth import authenticate,login,logout
# from .serializers import *
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken
# class RegisterView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]


#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)

#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {
#                     "message":"Registration Successfull!"
#                 },
#                 status=status.HTTP_201_CREATED
#             )
        
#         errors = serializer.errors
#         first_field = list(errors.keys())[0]
#         first_message = errors[first_field][0]

#         return Response(
#             {
#                 "message":first_message
#             },
#             status = status.HTTP_400_BAD_REQUEST
#         )


# from django.contrib.auth import authenticate
# from rest_framework.permissions import AllowAny
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework_simplejwt.tokens import RefreshToken

# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         username = request.data.get("username")
#         password = request.data.get("password")

#         # 1️⃣ Validate input
#         if not username or not password:
#             return Response(
#                 {"message": "Username and password are required"},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         user = authenticate(username=username, password=password)

#         if user is None:
#             return Response(
#                 {"message": "Invalid credentials"},
#                 status=status.HTTP_401_UNAUTHORIZED
#             )

#         refresh = RefreshToken.for_user(user)

#         return Response(
#             {
#                 "message": "Login successful",
#                 "access": str(refresh.access_token),
#                 "refresh": str(refresh),
#                 "user": {
#                     "id": user.id,
#                     "username": user.username,
#                     "email": user.email,
#                 }
#             },
#             status=status.HTTP_200_OK
#         )

# # class LoginView(APIView):
# #     permission_classes = [AllowAny]
# #     def post(self,request):
# #         username = request.data.get("username")
# #         password = request.data.get("password")

# #         user = authenticate(username=username, password=password)
# #         if not username or not password:
# #             return Response(
# #                 {
# #                     "messgae":"Username and Password are required!"
# #                 },
# #                 status=status.HTTP_400_BAD_REQUEST
# #             )
            

# #         refresh = RefreshToken.for_user(user)
# #         return Response(
# #             {
# #                 "message":"Login Sucess",
# #                 "access" : str(refresh.access_token),
# #                 "refresh":str(refresh),
# #                 "user":{
# #                         # "id":user.id,
# #                         "username":user.username,
# #                         "email":user.email
# #                     }
# #             }
# #         )
# #         # if user is not None:
# #         #     login(request,user)
# #         #     return Response(
# #         #         {
# #         #             "message":"Login success!",
# #         #             "user":{
# #         #                 "id":user.id,
# #         #                 "username":user.username,
# #         #                 # "password":user.password
# #         #             }
# #         #         },
# #         #         status=status.HTTP_200_OK
# #         #     )
# #         else:
# #             return Response(
# #                 {
# #                     "message":"Invalid Credentials"
# #                 },
# #                 status=status.HTTP_401_UNAUTHORIZED
# #             )



# class ProfileView(APIView):
#     permission_classes = [IsAuthenticated]


#     def get(self,request):
#         serializer = ProfileSerializer(request.user)
#         return Response(serializer.data)

#     def patch(self,request):
#         serializer = ProfileSerializer(
#             request.user,
#             data = request.data,
#             partial = True
#         )

#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {
#                     'message':"Profile Updated!"
#                 },
#                 status = status.HTTP_200_OK
#             )
#         first_error = list(serializer.errors.values())[0][0]
#         return Response(
#             {
#                 'message':first_error,
#             },
#             status = status.HTTP_400_BAD_REQUEST
#         )


# =============================== OLD CODE END  ===============================
# =============================== New CODE Start  ===============================

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


from .serializers import (
    LoginSerializer,
    LogoutSerializer,
    ProfileSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Registration successful.",
                "data": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]
        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "success": True,
                "message": "Login successful.",
                "data": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "email": user.email,
                    },
                },
            },
            status=status.HTTP_200_OK,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Logout successful.",
            },
            status=status.HTTP_205_RESET_CONTENT,
        )





class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(
            request.user,
            context={"request": request}
        )

        return Response(
            {
                "success": True,
                "message": "Profile fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "success": True,
                    "message": "Profile updated successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "success": False,
                "message": "Profile update failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )