from rest_framework import viewsets

from api.serializers import DataSerializer
from api.models import Data


class DataViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user = None \
            if not self.request.user or self.request.user.is_anonymous \
            else self.request.user
        return Data.objects.filter(user=user)
    serializer_class = DataSerializer
