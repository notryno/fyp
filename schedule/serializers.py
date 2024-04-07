from rest_framework import serializers

from classroom.serializers import ClassroomSerializer

from .models import Schedule, SpecialSchedule


class ScheduleSerializer(serializers.ModelSerializer):
    classroom = ClassroomSerializer

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
        )


class SpecialScheduleSerializer(serializers.ModelSerializer):
    schedule = ScheduleSerializer()

    class Meta:
        model = SpecialSchedule
        fields = "__all__"  # You can include specific fields if needed
