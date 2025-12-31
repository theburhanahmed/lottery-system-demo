from rest_framework import serializers
from apps.transactions.models import Transaction, PaymentMethod, WithdrawalRequest
from apps.users.serializers import UserSerializer
from apps.lotteries.serializers import LotterySerializer


class TransactionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    lottery = LotterySerializer(read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'type', 'amount', 'status', 'description',
            'lottery', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = [
            'id', 'name', 'type', 'account_number', 'is_primary',
            'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class WithdrawalRequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)

    class Meta:
        model = WithdrawalRequest
        fields = [
            'id', 'user', 'amount', 'status', 'payment_method',
            'transaction_id', 'requested_at', 'processed_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'transaction_id', 'requested_at', 'processed_at'
        ]
