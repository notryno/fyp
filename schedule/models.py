from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from classroom.models import Classroom
from courses.models import Course

User = get_user_model()


class Schedule(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE)
    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    start_date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    description = models.TextField()
    number_of_instances = models.IntegerField(default=1)
    frequency_per_week = models.IntegerField(default=1)
    day_of_week = models.IntegerField(choices=[(i, i) for i in range(7)], default=0)
    color = models.CharField(max_length=20, default="#ffffff")

    def generate_schedule(self):
        schedule = []
        current_date = self.start_date
        # Find the starting day of the week
        while current_date.weekday() != self.day_of_week - 1:
            current_date += timedelta(days=1)

        for _ in range(self.number_of_instances):
            schedule.append(
                {
                    "date": current_date,
                    "title": self.course.name,
                    "start_time": self.start_time,
                    "end_time": self.end_time,
                    "type": self.type,
                    "location": self.location,
                    "description": self.description,
                    "color": self.color,
                }
            )
            # Move to the next occurrence based on frequency_per_week
            current_date += timedelta(days=7 * self.frequency_per_week)

        return schedule


class SpecialSchedule(models.Model):
    schedule = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name="special_dates"
    )
    special_date = models.DateField()
    start_time = models.TimeField()
    type = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    end_time = models.TimeField()
    color = models.CharField(max_length=20, default="#ffffff")

    def change_schedule_for_special_date(self, new_start_time, new_end_time):
        """
        Change the schedule for the special date to the specified start and end times.
        """
        # Update the start time and end time for the special date
        self.start_time = new_start_time
        self.end_time = new_end_time
        self.save()

        # Get the index of the special date in the generated schedule
        index = (self.special_date - self.schedule.start_date).days // (
            7 * self.schedule.frequency_per_week
        )

        # Update the corresponding instance in the generated schedule
        if index < self.schedule.number_of_instances:
            instance = self.schedule.generate_schedule()[index]
            instance["start_time"] = new_start_time
            instance["end_time"] = new_end_time
            instance.save()
