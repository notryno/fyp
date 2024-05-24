# views.py
from rest_framework import generics

from .models import Support
from .serializers import SupportSerializer


class SupportListCreate(generics.ListCreateAPIView):
    queryset = Support.objects.all()
    serializer_class = SupportSerializer
