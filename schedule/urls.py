from django.urls import path

from . import views
from .views import (
    AllScheduleListView,
    ScheduleDetailView,
    ScheduleListView,
    SingleScheduleView,
    SpecialScheduleListView,
)

urlpatterns = [
    # path(
    #     "schedule/<int:pk>/", views.ScheduleDetailView.as_view(), name="schedule-detail"
    # ),
    path("schedules/", ScheduleListView.as_view(), name="schedule-list"),
    path(
        "special-schedules/",
        views.SpecialScheduleListView.as_view(),
        name="special-schedule-list",
    ),
    path("schedules/all/", AllScheduleListView.as_view(), name="all-schedule-list"),
    path("schedule/<int:pk>/", ScheduleDetailView.as_view(), name="schedule-detail"),
    path("create-schedule/", views.create_schedule, name="create-schedule"),
    path(
        "single-schedule/<int:course_id>/",
        views.SingleScheduleView.as_view(),
        name="single-schedule",
    ),
]
