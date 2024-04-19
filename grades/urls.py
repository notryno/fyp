from django.urls import path

from . import views

urlpatterns = [
    path("grades/", views.GradeListCreateAPIView.as_view(), name="grade-list"),
    path(
        "grades/<int:pk>/",
        views.GradeRetrieveUpdateDestroyAPIView.as_view(),
        name="grade-detail",
    ),
    path("grade/", views.CurrentUserGradeListView.as_view(), name="grade"),
]
