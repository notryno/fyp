from django.urls import path

from .views import CourseDetailView, CourseListView

urlpatterns = [
    path("courses/", CourseListView.as_view()),
    path("courses/<int:pk>/", CourseDetailView.as_view()),
]
