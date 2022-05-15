from django.contrib.auth.models import User
from django.db import models


class Data(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='data')
    content = models.TextField()

    def __str__(self):
        return self.content
