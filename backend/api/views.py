from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.generics import CreateAPIView
from django.contrib.auth import get_user_model

from api.models import Data
from api.serializers import DataSerializer, UserSerializer


class DataViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = None \
            if not self.request.user or self.request.user.is_anonymous \
            else self.request.user
        return Data.objects.filter(user=user)
    serializer_class = DataSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = Data(user=request.user, content=serializer.data['content'])
        data.save()

        serializer = DataSerializer(data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CreateUserView(CreateAPIView):
    model = get_user_model()
    permission_classes = [
        permissions.AllowAny
    ]
    serializer_class = UserSerializer
