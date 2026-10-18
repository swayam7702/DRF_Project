# from rest_framework import routers
# from django.urls import path
# from .views import *
# from rest_framework_simplejwt.views import TokenRefreshView
# router = routers.DefaultRouter()


# urlpatterns =[
#     path('register/', RegisterView.as_view(),name="register"),
#     path('login/',LoginView.as_view(),name="login"),
#      path("token/refresh/", TokenRefreshView.as_view()),
#     path("profile/", ProfileView.as_view()),
# ]

# ==================== OLD Code End =============================
# ==================== New Code Start =============================

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, LogoutView, UserProfileAPIView, RegisterView


app_name = "users"


urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register",
    ),
    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),
    path(
        "logout/",
        LogoutView.as_view(),
        name="logout",
    ),
    path(
        "token/refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path("profile/", UserProfileAPIView.as_view(), name="user-profile"),
]