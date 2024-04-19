from rest_framework import serializers

from classroom.serializers import ClassroomSerializer
from courses.serializers import CourseSerializer

from .models import Schedule, SpecialSchedule


class ScheduleSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer
    course = CourseSerializer
    title = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = (
            "id",
            "classroom",
            "title",
            "start_date",
            "start_time",
            "end_time",
            "type",
            "location",
            "description",
            "number_of_instances",
            "frequency_per_week",
            "day_of_week",
            "color",
            "course",
        )

    def get_title(self, obj):
        return obj.course.name


class SpecialScheduleSerializer(serializers.ModelSerializer):
    schedule = ScheduleSerializer()

    class Meta:
        model = SpecialSchedule
        fields = "__all__"  # You can include specific fields if needed
