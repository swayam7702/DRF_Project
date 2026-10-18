# from rest_framework import serializers
# from django.contrib.auth.models import User
# from rest_framework.validators import UniqueValidator

# class UserSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(
#         max_length=150,
#         validators=[
#             UniqueValidator(
#                 queryset=User.objects.all(),
#                 message="Username already exists."
#             )
#         ],
#         error_messages={
#             "required": "Username is required.",
#             "blank": "Username cannot be empty."
#         }
#     )

#     email = serializers.EmailField(
#         error_messages={
#             "required": "Email is required.",
#             "blank": "Email cannot be empty.",
#             "invalid": "Enter a valid email address."
#         }
#     )

#     password = serializers.CharField(
#         write_only=True,
#         min_length=8,
#         style={"input_type": "password"},
#         error_messages={
#             "required": "Password is required.",
#             "blank": "Password cannot be empty.",
#             "min_length": "Password must be at least 8 characters long."
#         }
#     )

#     class Meta:
#         model = User
#         fields = ["username", "email", "password"]

#     def create(self, validated_data):
#         user = User.objects.create_user(
#             validated_data["username"],
#             validated_data["email"],
#             validated_data["password"],
#         )
#         return user


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

# OLD Code End


# New Code Start 

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        max_length=150,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Username already exists.",
            )
        ],
        error_messages={
            "required": "Username is required.",
            "blank": "Username cannot be empty.",
        },
    )

    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="Email already exists.",
            )
        ],
        error_messages={
            "required": "Email is required.",
            "blank": "Email cannot be empty.",
            "invalid": "Enter a valid email address.",
        },
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
        error_messages={
            "required": "Password is required.",
            "blank": "Password cannot be empty.",
            "min_length": (
                "Password must be at least 8 characters long."
            ),
        },
    )

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        error_messages={
            "required": "Username is required.",
            "blank": "Username cannot be empty.",
        }
    )

    password = serializers.CharField(
        write_only=True,
        error_messages={
            "required": "Password is required.",
            "blank": "Password cannot be empty.",
        },
    )

    def validate(self, attrs):
        user = authenticate(
            username=attrs["username"],
            password=attrs["password"],
        )

        if user is None:
            raise serializers.ValidationError(
                {"message": "Invalid username or password."}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {"message": "This account is inactive."}
            )

        attrs["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
     class Meta:
        model = User
        fields = ["id", "username", "email"]
        read_only_fields = ["id"]

        def validate_email(self, value):
            user = self.context["request"].user

            if (
                User.objects.exclude(id=user.id)
                .filter(email__iexact=value)
                .exists()
            ):
                raise serializers.ValidationError(
                    "This email is already used by another account."
                )

            return value

        def validate_username(self, value):
            user = self.context["request"].user

            if (
                User.objects.exclude(id=user.id)
                .filter(username__iexact=value)
                .exists()
            ):
                raise serializers.ValidationError(
                    "This username is already taken."
                )

            return value


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def save(self, **kwargs):
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh_token = self.validated_data["refresh"]

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as exc:
            raise serializers.ValidationError(
                {
                    "refresh": (
                        "Invalid or expired refresh token."
                    )
                }
            ) from exc