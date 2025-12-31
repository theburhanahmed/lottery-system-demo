from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import RegisterView, LoginView, UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('users/register/', RegisterView.as_view({'post': 'register'}), name='register'),
    path('users/login/', LoginView.as_view({'post': 'login'}), name='login'),
]
