from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=150,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Username already exists."
            )
        ],
        error_messages={
            "required": "Username is required.",
            "blank": "Username cannot be empty."
        }
    )

    email = serializers.EmailField(
        error_messages={
            "required": "Email is required.",
            "blank": "Email cannot be empty.",
            "invalid": "Enter a valid email address."
        }
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
        error_messages={
            "required": "Password is required.",
            "blank": "Password cannot be empty.",
            "min_length": "Password must be at least 8 characters long."
        }
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data["username"],
            validated_data["email"],
            validated_data["password"],
        )
        return user


# class LoginSerializer(serializers.Serializer):
#     username = serializers.CharField(
#         error_messages={
#             "required": "Username is required.",
#             "blank": "Username cannot be empty."
#         }
#     )
#     password = serializers.CharField(
#         write_only=True,
#         error_messages={
#             "required": "Password is required.",
#             "blank": "Password cannot be empty."
#         }
#     )



# class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["username", "email"]