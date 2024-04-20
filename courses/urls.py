from django.urls import path

from .views import (
    CourseDetailView,
    CourseListView,
    CreateCourseView,
    EnrolledCourseListView,
)

urlpatterns = [
    path("courses/", CourseListView.as_view()),
    path("courses/<int:pk>/", CourseDetailView.as_view()),
    path("enrolled/", EnrolledCourseListView.as_view()),
    path("course/", CreateCourseView.as_view()),
]
