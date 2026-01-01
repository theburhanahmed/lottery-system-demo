from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ReferralProgramViewSet,
    ReferralLinkViewSet,
    ReferralViewSet,
    ReferralBonusViewSet,
    ReferralWithdrawalViewSet
)

router = DefaultRouter()
router.register(r'programs', ReferralProgramViewSet, basename='referral-program')
router.register(r'links', ReferralLinkViewSet, basename='referral-link')
router.register(r'referrals', ReferralViewSet, basename='referral')
router.register(r'bonuses', ReferralBonusViewSet, basename='referral-bonus')
router.register(r'withdrawals', ReferralWithdrawalViewSet, basename='referral-withdrawal')

urlpatterns = [
    path('', include(router.urls)),
]
