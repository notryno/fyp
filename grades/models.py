from django.db import models


class Grade(models.Model):
    student = models.ManyToManyField("authentication.CustomUser", related_name="grades")
    course = models.ManyToManyField("courses.Course", related_name="grades")
    grade = models.CharField(max_length=2)
    score = models.IntegerField()
