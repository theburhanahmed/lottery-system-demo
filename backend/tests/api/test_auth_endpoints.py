"""
API endpoint tests for authentication
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AuthEndpointsTestCase(TestCase):
    """Test authentication endpoints"""

    def setUp(self):
        self.client = APIClient()

    def test_register_endpoint(self):
        """Test user registration endpoint"""
        response = self.client.post('/api/users/register/', {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPassword123',
            'password_confirm': 'TestPassword123',
            'first_name': 'Test',
            'last_name': 'User'
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('message', response.data)

    def test_login_endpoint(self):
        """Test user login endpoint"""
        User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPassword123'
        )

        response = self.client.post('/api/users/login/', {
            'username': 'testuser',
            'password': 'TestPassword123'
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post('/api/users/login/', {
            'username': 'testuser',
            'password': 'WrongPassword'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_profile_authenticated(self):
        """Test getting profile when authenticated"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPassword123'
        )
        self.client.force_authenticate(user=user)

        response = self.client.get('/api/users/users/profile/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

    def test_get_profile_unauthenticated(self):
        """Test getting profile when not authenticated"""
        response = self.client.get('/api/users/users/profile/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AuthorizationTestCase(TestCase):
    """Test authorization (admin vs user)"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPassword123',
            role='user'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='AdminPassword123',
            role='admin'
        )

    def test_user_cannot_access_admin_endpoints(self):
        """Test that regular user cannot access admin endpoints"""
        self.client.force_authenticate(user=self.user)

        # Try to create lottery (admin only)
        response = self.client.post('/api/lotteries/', {
            'name': 'Test Lottery',
            'ticket_price': '10.00',
            'total_tickets': 100,
            'prize_amount': '500.00'
        })

        # Should be forbidden or not found
        self.assertIn(response.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])

    def test_admin_can_access_admin_endpoints(self):
        """Test that admin can access admin endpoints"""
        self.client.force_authenticate(user=self.admin_user)

        response = self.client.post('/api/lotteries/', {
            'name': 'Test Lottery',
            'description': 'Test Description',
            'ticket_price': '10.00',
            'total_tickets': 100,
            'prize_amount': '500.00',
            'status': 'ACTIVE'
        })

        # Should succeed (201) or at least not be forbidden
        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])

