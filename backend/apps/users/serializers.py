from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.users.models import User, UserProfile, AuditLog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_admin', 'wallet_balance', 'phone_number', 'is_verified',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'wallet_balance', 'created_at', 'updated_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'total_spent', 'total_won', 'total_tickets_bought',
            'total_lotteries_participated', 'total_wins', 'avatar', 'bio'
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_admin', 'wallet_balance', 'phone_number', 'date_of_birth',
            'address', 'city', 'country', 'is_verified', 'profile',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'wallet_balance', 'created_at', 'updated_at']


class AuditLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = AuditLog
        fields = ['id', 'user', 'action', 'description', 'ip_address', 'timestamp']
        read_only_fields = ['id', 'timestamp']
