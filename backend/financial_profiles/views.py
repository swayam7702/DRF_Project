from django.db import IntegrityError, transaction

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FinancialProfile
from .serializers import FinancialProfileSerializer


class FinancialProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get_profile(self, user):
        return FinancialProfile.objects.filter(
            user=user
        ).first()

    def missing_profile_response(self):
        return Response(
            {
                "success": False,
                "message": "Financial profile has not been created.",
                "code": "financial_profile_not_found",
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    def duplicate_profile_response(self):
        return Response(
            {
                "success": False,
                "message": (
                    "Financial profile already exists. "
                    "Use PATCH to update it."
                ),
                "code": "financial_profile_already_exists",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def validation_error_response(self, errors):
        return Response(
            {
                "success": False,
                "message": "Please correct the highlighted fields.",
                "errors": errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    def get(self, request):
        profile = self.get_profile(request.user)

        if profile is None:
            return self.missing_profile_response()

        serializer = FinancialProfileSerializer(profile)

        return Response(
            {
                "success": True,
                "message": "Financial profile fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        if self.get_profile(request.user) is not None:
            return self.duplicate_profile_response()

        serializer = FinancialProfileSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return self.validation_error_response(
                serializer.errors
            )

        try:
            with transaction.atomic():
                serializer.save(user=request.user)
        except IntegrityError:
            # Handle simultaneous requests creating the same profile.
            if FinancialProfile.objects.filter(
                user=request.user
            ).exists():
                return self.duplicate_profile_response()

            raise

        return Response(
            {
                "success": True,
                "message": "Financial profile created successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request):
        profile = self.get_profile(request.user)

        if profile is None:
            return self.missing_profile_response()

        serializer = FinancialProfileSerializer(
            profile,
            data=request.data,
            partial=True,
        )

        if not serializer.is_valid():
            return self.validation_error_response(
                serializer.errors
            )

        serializer.save()

        return Response(
            {
                "success": True,
                "message": "Financial profile updated successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )