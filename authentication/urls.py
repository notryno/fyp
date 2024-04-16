# urls.py

from django.urls import path

from utilities.email_otp import resend_otp

from .views import (
    GetStudentsDataView,
    GetTeachersDataView,
    GetUserDataView,
    LoginView,
    RegisterView,
    UpdateUserDataView,
    update_password,
    verify_otp,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("get_user_data/", GetUserDataView.as_view(), name="get_user_data"),
    path("update_user_data/", UpdateUserDataView.as_view(), name="update_user_data"),
    path("update_password/", update_password, name="update_password"),
    path("students/", GetStudentsDataView.as_view(), name="get_students_data"),
    path("teachers/", GetTeachersDataView.as_view(), name="get_teachers_data"),
    path("verify_otp/", verify_otp, name="verify_otp"),
    path("resend_otp/", resend_otp, name="resend_otp"),
]
