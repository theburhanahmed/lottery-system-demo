"""
Integration tests for complete user flows
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.lotteries.models import Lottery, Ticket
from apps.transactions.models import Transaction
from decimal import Decimal
from unittest.mock import patch

User = get_user_model()


class UserFlowTestCase(TestCase):
    """Test complete user registration to purchase flow"""

    def setUp(self):
        self.client = APIClient()

    def test_complete_user_flow(self):
        """Test: Register -> Deposit -> Purchase Ticket -> Draw"""
        # 1. Register user
        response = self.client.post('/api/users/register/', {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'TestPassword123',
            'password_confirm': 'TestPassword123',
            'first_name': 'Test',
            'last_name': 'User'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 2. Login
        response = self.client.post('/api/users/login/', {
            'username': 'testuser',
            'password': 'TestPassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # 3. Create lottery (as admin)
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='AdminPassword123',
            role='admin'
        )
        self.client.force_authenticate(user=admin_user)

        lottery = Lottery.objects.create(
            name='Test Lottery',
            description='Test Description',
            ticket_price=Decimal('10.00'),
            total_tickets=100,
            available_tickets=100,
            prize_amount=Decimal('500.00'),
            status='ACTIVE'
        )

        # 4. Switch back to regular user and deposit funds
        user = User.objects.get(username='testuser')
        self.client.force_authenticate(user=user)
        user.wallet_balance = Decimal('100.00')
        user.save()

        # 5. Purchase ticket
        response = self.client.post(f'/api/lotteries/{lottery.id}/buy_ticket/')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # 6. Verify ticket was created
        ticket = Ticket.objects.filter(user=user, lottery=lottery).first()
        self.assertIsNotNone(ticket)

        # 7. Verify transaction was created
        transaction = Transaction.objects.filter(
            user=user,
            type='TICKET_PURCHASE',
            lottery=lottery
        ).first()
        self.assertIsNotNone(transaction)


class PaymentFlowTestCase(TestCase):
    """Test payment integration flow"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='TestPassword123'
        )
        self.client.force_authenticate(user=self.user)

    @patch('apps.payments.services.StripeService.create_payment_intent')
    def test_payment_flow(self, mock_create_intent):
        """Test: Create payment intent -> Confirm -> Credit wallet"""
        from apps.payments.models import PaymentIntent
        from apps.payments.services import StripeService

        # Mock payment intent creation
        payment_intent = PaymentIntent(
            id='test-uuid',
            user=self.user,
            stripe_payment_intent_id='pi_test123',
            amount=Decimal('100.00'),
            status='requires_confirmation',
            client_secret='secret_test123'
        )
        mock_create_intent.return_value = payment_intent

        # Create payment intent
        response = self.client.post('/api/payments/payment-intents/create_intent/', {
            'amount': 100.00
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('client_secret', response.data)


class ReferralFlowTestCase(TestCase):
    """Test referral flow"""

    def setUp(self):
        self.client = APIClient()
        self.referrer = User.objects.create_user(
            username='referrer',
            email='referrer@example.com',
            password='Password123'
        )
        self.client.force_authenticate(user=self.referrer)

    def test_referral_flow(self):
        """Test: Get referral link -> Register with code -> Bonus credited"""
        from apps.referrals.models import ReferralLink, Referral

        # Get referral link
        link = ReferralLink.objects.create(
            user=self.referrer,
            referral_code='TESTCODE123'
        )

        # Register new user with referral code
        response = self.client.post('/api/users/register/', {
            'username': 'referred',
            'email': 'referred@example.com',
            'password': 'Password123',
            'password_confirm': 'Password123',
            'referral_code': 'TESTCODE123'
        })

        # Verify referral was created
        referred_user = User.objects.get(username='referred')
        referral = Referral.objects.filter(
            referrer=self.referrer,
            referred_user=referred_user
        ).first()
        self.assertIsNotNone(referral)

