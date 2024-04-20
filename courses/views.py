from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import Course
from .serializers import CourseSerializer


class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Print the data being sent for patch
        print("Data being sent for PATCH request:", serializer)

        self.perform_update(serializer)

        return Response(serializer.data)


class EnrolledCourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.classroom:
            return Course.objects.filter(classrooms=user.classroom)
        else:
            return Course.objects.none()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CreateCourseView(generics.CreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
