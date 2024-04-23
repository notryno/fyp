from django.urls import path

from . import views

urlpatterns = [
    path(
        "grades/<int:student_id>/",
        views.GradeListCreateAPIView.as_view(),
        name="grade-list",
    ),
    path(
        "grades/<int:pk>/",
        views.GradeRetrieveUpdateDestroyAPIView.as_view(),
        name="grade-detail",
    ),
    path("grade/", views.CurrentUserGradeListView.as_view(), name="grade"),
    path(
        "grades/student/<int:student_id>/",
        views.StudentGradeListView.as_view(),
        name="student-grade-list",
    ),
]
