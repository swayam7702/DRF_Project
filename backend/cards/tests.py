from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from .models import CreditCard


User = get_user_model()


class CreditCardApiTests(APITestCase):
    def setUp(self):
        self.user_a = User.objects.create_user(
            username="card_user_a",
            password="StrongPassword123!",
        )

        self.user_b = User.objects.create_user(
            username="card_user_b",
            password="StrongPassword123!",
        )

        self.url = reverse("cards:card-list-create")

        self.payload = {
            "bank_name": "HDFC Bank",
            "card_nickname": "Shopping Card",
            "last_four_digits": "0042",
            "credit_limit": "150000.00",
            "statement_day": 12,
            "due_day": 2,
        }

    def test_authentication_is_required(self):
        get_response = self.client.get(self.url)

        post_response = self.client.post(
            self.url,
            self.payload,
            format="json",
        )

        self.assertEqual(
            get_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

        self.assertEqual(
            post_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_user_can_create_card(self):
        self.client.force_authenticate(user=self.user_a)

        response = self.client.post(
            self.url,
            self.payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        card = CreditCard.objects.get(
            pk=response.data["data"]["id"]
        )

        self.assertEqual(card.user, self.user_a)
        self.assertEqual(card.last_four_digits, "0042")

    def test_user_only_sees_their_own_cards(self):
        own_card = CreditCard.objects.create(
            user=self.user_a,
            **self.payload,
        )

        CreditCard.objects.create(
            user=self.user_b,
            **self.payload,
        )

        self.client.force_authenticate(user=self.user_a)

        response = self.client.get(self.url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        returned_ids = [
            card["id"]
            for card in response.data["data"]
        ]

        self.assertEqual(returned_ids, [own_card.id])

    def test_invalid_fields_are_rejected(self):
        self.client.force_authenticate(user=self.user_a)

        invalid_cases = [
            ("bank_name", "   "),
            ("card_nickname", ""),
            ("last_four_digits", "12AB"),
            ("last_four_digits", "123"),
            ("credit_limit", "0.00"),
            ("credit_limit", "-100.00"),
            ("credit_limit", "100.123"),
            ("statement_day", 32),
            ("due_day", 0),
            ("currency", "USD"),
        ]

        for field, value in invalid_cases:
            with self.subTest(field=field, value=value):
                payload = {
                    **self.payload,
                    field: value,
                }

                response = self.client.post(
                    self.url,
                    payload,
                    format="json",
                )

                self.assertEqual(
                    response.status_code,
                    status.HTTP_400_BAD_REQUEST,
                )

                self.assertIn(
                    field,
                    response.data["errors"],
                )

        self.assertEqual(
            CreditCard.objects.count(),
            0,
        )

    def test_client_cannot_assign_another_owner(self):
        self.client.force_authenticate(user=self.user_a)

        payload = {
            **self.payload,
            "user_id": self.user_b.id,
        }

        response = self.client.post(
            self.url,
            payload,
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(
            CreditCard.objects.count(),
            0,
        )