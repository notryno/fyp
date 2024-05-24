# models.py

from datetime import timedelta

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from classroom.models import Classroom
from courses.models import Course


class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    profile_picture = models.URLField(blank=True, null=True)
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    classroom = models.ForeignKey(
        Classroom,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    otp_secret = models.CharField(max_length=64, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    email_verified = models.BooleanField(default=False)
    courses = models.ManyToManyField(Course, blank=True)

    def __str__(self) -> str:
        return self.email

    def save(self, *args, **kwargs):
        # Set username equal to email before saving
        self.username = self.email
        super().save(*args, **kwargs)

    groups = models.ManyToManyField(
        Group,
        verbose_name=_("groups"),
        blank=True,
        help_text=_(
            "The groups this user belongs to. A user will get all permissions "
            "granted to each of their groups."
        ),
        related_name="customuser_set",
        related_query_name="user",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_("user permissions"),
        blank=True,
        help_text=_("Specific permissions for this user."),
        related_name="customuser_set",
        related_query_name="user",
    )
