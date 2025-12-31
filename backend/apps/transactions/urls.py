from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.transactions.views import (
    TransactionViewSet, PaymentMethodViewSet, WithdrawalRequestViewSet
)

router = DefaultRouter()
router.register(r'transactions', TransactionViewSet, basename='transaction')
router.register(r'payment-methods', PaymentMethodViewSet, basename='payment-method')
router.register(r'withdrawals', WithdrawalRequestViewSet, basename='withdrawal')

urlpatterns = [
    path('', include(router.urls)),
]
