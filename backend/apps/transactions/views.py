from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum

from apps.transactions.models import Transaction, PaymentMethod, WithdrawalRequest
from apps.transactions.serializers import (
    TransactionSerializer, PaymentMethodSerializer,
    WithdrawalRequestSerializer
)
from apps.users.models import AuditLog


class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    """View user transactions"""
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['type', 'status']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get transaction summary for current user"""
        transactions = Transaction.objects.filter(user=request.user)
        total_spent = transactions.filter(type='TICKET_PURCHASE').aggregate(
            total=Sum('amount')
        )['total'] or 0
        total_earned = transactions.filter(type='PRIZE_CLAIM').aggregate(
            total=Sum('amount')
        )['total'] or 0
        total_deposits = transactions.filter(type='DEPOSIT').aggregate(
            total=Sum('amount')
        )['total'] or 0

        return Response({
            'total_transactions': transactions.count(),
            'total_spent': str(total_spent),
            'total_earned': str(total_earned),
            'total_deposits': str(total_deposits),
            'net_balance': str(float(total_earned) + float(total_deposits) - float(total_spent))
        })


class PaymentMethodViewSet(viewsets.ModelViewSet):
    """Manage payment methods"""
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-is_primary', '-created_at']

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Add new payment method"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            AuditLog.objects.create(
                user=request.user,
                action='DEPOSIT',
                description=f'Added payment method: {serializer.data["name"]}'
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """Set payment method as primary"""
        payment_method = self.get_object()
        PaymentMethod.objects.filter(user=request.user).update(is_primary=False)
        payment_method.is_primary = True
        payment_method.save()
        AuditLog.objects.create(
            user=request.user,
            action='WITHDRAW',
            description=f'Set primary payment method: {payment_method.name}'
        )
        return Response({'message': 'Payment method set as primary'})


class WithdrawalRequestViewSet(viewsets.ModelViewSet):
    """Manage withdrawal requests"""
    serializer_class = WithdrawalRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    ordering = ['-requested_at']

    def get_queryset(self):
        return WithdrawalRequest.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        """Request withdrawal"""
        user = request.user
        amount = request.data.get('amount')
        payment_method_id = request.data.get('payment_method')

        # Validation
        try:
            amount = float(amount)
            if amount <= 0:
                return Response(
                    {'error': 'Amount must be greater than 0'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid amount'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if user.wallet_balance < amount:
            return Response(
                {'error': 'Insufficient balance'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            payment_method = PaymentMethod.objects.get(
                id=payment_method_id, user=user
            )
        except PaymentMethod.DoesNotExist:
            return Response(
                {'error': 'Payment method not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create withdrawal request
        withdrawal = WithdrawalRequest.objects.create(
            user=user,
            amount=amount,
            payment_method=payment_method,
            status='PENDING'
        )

        # Create transaction
        transaction = Transaction.objects.create(
            user=user,
            type='WITHDRAWAL',
            amount=amount,
            status='PENDING',
            description=f'Withdrawal request to {payment_method.name}'
        )

        withdrawal.transaction = transaction
        withdrawal.save()

        # Log action
        AuditLog.objects.create(
            user=user,
            action='WITHDRAW',
            description=f'Withdrawal request for ${amount}'
        )

        return Response(
            WithdrawalRequestSerializer(withdrawal).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def approve(self, request, pk=None):
        """Approve withdrawal (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can approve withdrawals'},
                status=status.HTTP_403_FORBIDDEN
            )

        withdrawal = self.get_object()

        if withdrawal.status != 'PENDING':
            return Response(
                {'error': 'Only pending withdrawals can be approved'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct from user wallet
        withdrawal.user.deduct_balance(withdrawal.amount)

        # Update withdrawal
        withdrawal.status = 'APPROVED'
        withdrawal.save()

        # Update transaction
        withdrawal.transaction.status = 'COMPLETED'
        withdrawal.transaction.save()

        # Log action
        AuditLog.objects.create(
            user=request.user,
            action='WITHDRAW',
            description=f'Approved withdrawal of ${withdrawal.amount} for {withdrawal.user.username}'
        )

        return Response({
            'message': 'Withdrawal approved',
            'withdrawal': WithdrawalRequestSerializer(withdrawal).data
        })

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        """Reject withdrawal (admin only)"""
        if not request.user.is_admin:
            return Response(
                {'error': 'Only admins can reject withdrawals'},
                status=status.HTTP_403_FORBIDDEN
            )

        withdrawal = self.get_object()

        if withdrawal.status != 'PENDING':
            return Response(
                {'error': 'Only pending withdrawals can be rejected'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update withdrawal
        withdrawal.status = 'REJECTED'
        withdrawal.save()

        # Update transaction
        withdrawal.transaction.status = 'FAILED'
        withdrawal.transaction.save()

        # Log action
        AuditLog.objects.create(
            user=request.user,
            action='WITHDRAW',
            description=f'Rejected withdrawal of ${withdrawal.amount} for {withdrawal.user.username}'
        )

        return Response({
            'message': 'Withdrawal rejected',
            'withdrawal': WithdrawalRequestSerializer(withdrawal).data
        })
