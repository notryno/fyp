from django.db import models

from authentication.models import CustomUser
from classroom.models import Classroom


class Notification(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True,
    )
    author = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="authored_notifications"
    )
    title = models.CharField(max_length=255)
    group = models.ForeignKey(
        Classroom,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class UserNotification(models.Model):
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name="user_notifications"
    )
    notification = models.ForeignKey(
        Notification, on_delete=models.CASCADE, related_name="user_notifications"
    )
    read = models.BooleanField(default=False)
    read_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username} - Read: {self.read}"
