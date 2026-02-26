from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Lottery System API",
        default_version='v1',
        description="API documentation for Lottery System",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@lottery.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API Routes
    path('api/', include('apps.users.urls')),
    path('api/', include('apps.lotteries.urls')),
    path('api/', include('apps.transactions.urls')),
    path('api/referrals/', include('apps.referrals.urls')),
    path('api/', include('apps.notifications.urls')),
    path('api/', include('apps.analytics.urls')),
    path('api/', include('apps.payments.urls')),
    path('api/slots/', include('apps.slots.urls')),
    path('api/games/', include('apps.games.urls')),
    
    # Health check endpoints
    path('api/health/', include('apps.common.urls')),
    
    # Auth Routes
    path('api-auth/', include('rest_framework.urls')),
]

# Serve media files in development (DEBUG mode only)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
