from django.urls import path

from .views import ClassroomCreateView, ClassroomListView, ClassroomViewList

urlpatterns = [
    path("class/", ClassroomViewList.as_view(), name="class-list"),
    path("classroom/", ClassroomListView.as_view(), name="classroom-list"),
    path("classroom/create/", ClassroomCreateView.as_view(), name="classroom-create"),
]
