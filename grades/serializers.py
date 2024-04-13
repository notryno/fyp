from rest_framework import serializers

from authentication.serializers import UserSerializer
from courses.serializers import CourseSerializer
from grades.models import Grade


class GradeSerializer(serializers.ModelSerializer):
    student = UserSerializer(many=True, read_only=True)
    course = CourseSerializer(many=True, read_only=True)

    class Meta:
        model = Grade
        fields = ["student", "course", "grade", "score"]
