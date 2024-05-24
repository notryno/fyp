# urls.py
from django.urls import path

from .views import SupportListCreate

urlpatterns = [
    path("support/", SupportListCreate.as_view(), name="support-list-create"),
]
