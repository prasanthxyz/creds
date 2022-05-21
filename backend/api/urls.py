from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from api import views

router = routers.DefaultRouter()
router.register(r'data', views.DataViewSet, basename='Data')

urlpatterns = [
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('users/', views.CreateUserView.as_view(), name='users'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
