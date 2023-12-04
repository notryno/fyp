# myapp/urls.py

from django.urls import path
from .views import login_user, register_user

urlpatterns = [
    path('register/', register_user, name='register_user'),
    path('login/', login_user, name='login_user'),
    # Add other URLs as needed
]
