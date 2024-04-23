from django.http import Http404
from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from grades.models import Grade
from grades.serializers import GradeSerializer


class GradeListCreateAPIView(generics.GenericAPIView):
    def get_queryset(self):
        return Grade.objects.all()

    def post(self, request, *args, **kwargs):
        score = request.data.get("score")
        grade = self.calculate_grade(score)
        print(request.data)
        student_id = self.kwargs.get("student_id")
        if grade is None:
            return Response(
                {"error": "Invalid score format"}, status=HTTP_400_BAD_REQUEST
            )

        serializer = GradeSerializer(data={**request.data, "grade": grade})

        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

    def calculate_grade(self, score):
        try:
            score = int(score)
            if score >= 70:
                return "A"
            elif 60 <= score <= 69:
                return "B"
            elif 50 <= score <= 59:
                return "C"
            elif 40 <= score <= 49:
                return "D"
            else:
                return "F"
        except ValueError:
            return None


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


class StudentGradeListView(generics.ListAPIView):
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("hello")
        student_id = self.kwargs.get("student_id")
        try:
            student_grades = Grade.objects.filter(student=student_id)
            return student_grades
        except Grade.DoesNotExist:
            return Response(status=HTTP_400_BAD_REQUEST)
