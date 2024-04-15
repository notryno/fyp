from rest_framework import serializers

from .models import Classroom


class ClassroomSerializer(serializers.ModelSerializer):

    class Meta:
        model = Classroom
        fields = ("id", "name", "start_date", "end_date")
