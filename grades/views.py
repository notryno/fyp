from django.shortcuts import render
from rest_framework import generics

from grades.models import Grade
from grades.serializers import GradeSerializer


class GradeListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = GradeSerializer

    def get_queryset(self):
        return Grade.objects.all()

    def perform_create(self, serializer):
        serializer.save()


class GradeRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = GradeSerializer
    lookup_field = "pk"

    def get_queryset(self):
        return Grade.objects.all()

    def perform_update(self, serializer):
        serializer.save()


class CurrentUserGradeListView(generics.ListAPIView):
    serializer_class = GradeSerializer

    def get_queryset(self):
        user = self.request.user
        return Grade.objects.filter(student=user)
