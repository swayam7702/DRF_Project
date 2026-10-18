from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AuthenticationApiTests(APITestCase):
    register_url = "/api/v1/register/"
    login_url = "/api/v1/login/"
    profile_url = "/api/v1/profile/"
    refresh_url = "/api/v1/token/refresh/"
    logout_url = "/api/v1/logout/"

    def setUp(self):
        self.user = User.objects.create_user(
            username="existinguser",
            email="existing@example.com",
            password="StrongPassword123!",
        )

    def test_user_can_register(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )
        self.assertTrue(response.data["success"])
        self.assertTrue(
            User.objects.filter(username="newuser").exists()
        )

    def test_duplicate_username_is_rejected(self):
        response = self.client.post(
            self.register_url,
            {
                "username": "existinguser",
                "email": "another@example.com",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )
        self.assertIn("username", response.data)

    def test_user_can_login(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "existinguser",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertTrue(response.data["success"])
        self.assertIn("access", response.data["data"])
        self.assertIn("refresh", response.data["data"])

    def test_invalid_login_is_rejected(self):
        response = self.client.post(
            self.login_url,
            {
                "username": "existinguser",
                "password": "WrongPassword123!",
            },
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_profile_requires_authentication(self):
        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_authenticated_user_can_view_profile(self):
        login_response = self.client.post(
            self.login_url,
            {
                "username": "existinguser",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        access_token = login_response.data["data"]["access"]
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.get(self.profile_url)

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertEqual(
            response.data["data"]["username"],
            "existinguser",
        )

    def test_authenticated_user_can_update_email(self):
        login_response = self.client.post(
            self.login_url,
            {
                "username": "existinguser",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        access_token = login_response.data["data"]["access"]
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        response = self.client.patch(
            self.profile_url,
            {"email": "updated@example.com"},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.user.refresh_from_db()
        self.assertEqual(
            self.user.email,
            "updated@example.com",
        )

    def test_refresh_token_returns_new_access_token(self):
        login_response = self.client.post(
            self.login_url,
            {
                "username": "existinguser",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        refresh_token = login_response.data["data"]["refresh"]

        response = self.client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )
        self.assertIn("access", response.data)

    def test_logout_blacklists_refresh_token(self):
        login_response = self.client.post(
            self.login_url,
            {
                "username": "existinguser",
                "password": "StrongPassword123!",
            },
            format="json",
        )

        access_token = login_response.data["data"]["access"]
        refresh_token = login_response.data["data"]["refresh"]

        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {access_token}"
        )

        logout_response = self.client.post(
            self.logout_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(
            logout_response.status_code,
            status.HTTP_205_RESET_CONTENT,
        )

        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": refresh_token},
            format="json",
        )

        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )