from django.contrib import admin
from apps.transactions.models import Transaction, PaymentMethod, WithdrawalRequest


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'type', 'amount', 'status', 'created_at']
    list_filter = ['type', 'status', 'created_at']
    search_fields = ['user__username', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Transaction Information', {'fields': ('user', 'type', 'amount', 'status')}),
        ('Details', {'fields': ('description', 'lottery')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )


@admin.register(PaymentMethod)
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'type', 'is_primary', 'is_verified', 'created_at']
    list_filter = ['type', 'is_primary', 'is_verified', 'created_at']
    search_fields = ['user__username', 'name']
    readonly_fields = ['created_at']


@admin.register(WithdrawalRequest)
class WithdrawalRequestAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'status', 'payment_method', 'requested_at', 'processed_at']
    list_filter = ['status', 'requested_at', 'processed_at']
    search_fields = ['user__username']
    readonly_fields = ['requested_at', 'processed_at']
    fieldsets = (
        ('Request Information', {'fields': ('user', 'amount', 'status')}),
        ('Payment Details', {'fields': ('payment_method', 'transaction_id')}),
        ('Timestamps', {'fields': ('requested_at', 'processed_at')}),
    )
