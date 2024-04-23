from rest_framework import serializers

from authentication.serializers import GetUserDataSerializer
from courses.serializers import CourseSerializer
from grades.models import Grade


class GradeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Grade
        fields = "__all__"
