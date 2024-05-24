# notification/urls.py
from django.urls import path

from .views import (
    CreateNotificationView,
    MarkAllAsReadView,
    MarkNotificationAsReadView,
    NotificationListView,
)

urlpatterns = [
    path(
        "notification/create/",
        CreateNotificationView.as_view(),
        name="create-notification",
    ),
    path("notifications/", NotificationListView.as_view(), name="notification-list"),
    path(
        "notifications/mark-all-read/",
        MarkAllAsReadView.as_view(),
        name="mark-all-as-read",
    ),
    path(
        "notification/<int:notification_id>/",
        MarkNotificationAsReadView.as_view(),
        name="mark-notification-as-read",
    ),
]
