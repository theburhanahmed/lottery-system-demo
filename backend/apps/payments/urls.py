"""
URL configuration for payments app.
"""
from django.urls import path
from apps.payments import views

app_name = 'payments'

urlpatterns = [
    path('payments/config/', views.get_stripe_config, name='get_stripe_config'),
    path('payments/create-intent/', views.create_payment_intent, name='create_payment_intent'),
    path('payments/confirm-intent/', views.confirm_payment_intent, name='confirm_payment_intent'),
    path('payments/intent/<str:payment_intent_id>/', views.get_payment_intent, name='get_payment_intent'),
    path('payments/save-method/', views.save_payment_method, name='save_payment_method'),
    path('payments/methods/', views.list_payment_methods, name='list_payment_methods'),
    path('payments/methods/<str:payment_method_id>/', views.delete_payment_method, name='delete_payment_method'),
    path('payments/customer/', views.get_stripe_customer, name='get_stripe_customer'),
    path('payments/webhook/', views.stripe_webhook, name='stripe_webhook'),
]
