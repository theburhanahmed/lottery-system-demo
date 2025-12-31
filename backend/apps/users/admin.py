from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from apps.users.models import User, UserProfile, AuditLog


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Lottery Info', {'fields': ('is_admin', 'wallet_balance')}),
        ('Personal Info', {'fields': ('phone_number', 'date_of_birth', 'address', 'city', 'country')}),
        ('Verification', {'fields': ('is_verified',)}),
    )
    list_display = ['username', 'email', 'is_admin', 'wallet_balance', 'is_active', 'created_at']
    list_filter = ['is_admin', 'is_active', 'is_verified', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-created_at']


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'total_spent', 'total_won', 'total_wins']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'timestamp']
    list_filter = ['action', 'timestamp']
    search_fields = ['user__username', 'description']
    readonly_fields = ['timestamp']
    ordering = ['-timestamp']
