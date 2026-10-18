from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import IntegrityError, transaction
from .models import CreditCard
from .serializers import CreditCardSerializer


class CreditCardListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cards = CreditCard.objects.filter(
            user=request.user
        )

        serializer = CreditCardSerializer(
            cards,
            many=True,
        )

        return Response(
            {
                "success": True,
                "message": "Credit cards fetched successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = CreditCardSerializer(
            data=request.data,
            context={"request": request},
        )

        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": "Please correct the highlighted fields.",
                    "errors": serializer.errors,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                serializer.save(user=request.user)

        except IntegrityError:
            duplicate_exists = CreditCard.objects.filter(
                user=request.user,
                bank_name__iexact=(
                    serializer.validated_data["bank_name"]
                ),
                last_four_digits=(
                    serializer.validated_data["last_four_digits"]
                ),
            ).exists()

            if not duplicate_exists:
                raise

            return Response(
                {
                    "success": False,
                    "message": "This card has already been added.",
                    "errors": {
                        "last_four_digits": [
                            (
                                "You already have a card from this bank "
                                "ending with these digits. Use the "
                                "existing card instead."
                            )
                        ]
                    },
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "success": True,
                "message": "Credit card added successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )