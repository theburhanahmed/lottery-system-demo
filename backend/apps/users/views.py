from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token
from django.contrib.auth import authenticate
from apps.users.models import User, UserProfile, AuditLog
from apps.users.serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    UserDetailSerializer, UserProfileSerializer
)


class RegisterView(viewsets.ViewSet):
    """Handle user registration"""
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            AuditLog.objects.create(
                user=user,
                action='LOGIN',
                description='User registered'
            )
            return Response(
                {'message': 'User registered successfully'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(viewsets.ViewSet):
    """Handle user login"""
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            AuditLog.objects.create(
                user=user,
                action='LOGIN',
                description='User logged in',
                ip_address=self.get_client_ip(request)
            )
            # Generate token
            from rest_framework_jwt.settings import api_settings
            jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
            jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            
            return Response({
                'token': token,
                'user': UserSerializer(user).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class UserViewSet(viewsets.ModelViewSet):
    """Manage user accounts"""
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def profile(self, request):
        """Get current user profile"""
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['put'])
    def update_profile(self, request):
        """Update current user profile"""
        user = request.user
        serializer = UserDetailSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def wallet(self, request):
        """Get user wallet balance"""
        user = request.user
        return Response({
            'wallet_balance': str(user.wallet_balance),
            'user_id': str(user.id)
        })

    @action(detail=False, methods=['post'])
    def add_funds(self, request):
        """Add funds to user wallet"""
        user = request.user
        amount = request.data.get('amount', 0)
        try:
            amount = float(amount)
            if amount <= 0:
                return Response(
                    {'error': 'Amount must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.add_balance(amount)
            AuditLog.objects.create(
                user=user,
                action='DEPOSIT',
                description=f'Deposited ${amount}'
            )
            return Response({
                'message': 'Funds added successfully',
                'wallet_balance': str(user.wallet_balance)
            })
        except ValueError:
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'])
    def transactions(self, request):
        """Get user transactions"""
        from apps.transactions.models import Transaction
        from apps.transactions.serializers import TransactionSerializer
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def logout(self, request):
        """Handle user logout"""
        user = request.user
        AuditLog.objects.create(
            user=user,
            action='LOGOUT',
            description='User logged out'
        )
        return Response({'message': 'Logged out successfully'})
