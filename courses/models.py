from django.db import models


class Course(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255, unique=True)
    year = models.IntegerField()
    semester = models.CharField(max_length=2)
    classrooms = models.ManyToManyField("classroom.Classroom")

    def __str__(self):
        return f"{self.code} - {self.name} - {self.year}{self.semester}"
