# urls.py

from django.urls import path

from utilities.email_otp import resend_otp

from .views import (
    EncryptUserIdByParamView,
    EncryptUserIdView,
    GetStudentsDataView,
    GetTeachersDataView,
    GetUserDataByEncryptedIdView,
    GetUserDataView,
    LoginView,
    RegisterView,
    TeacherDetailsViiew,
    UpdateDetailView,
    UpdateUserDataView,
    reset_password,
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
    path("reset_password/", reset_password, name="reset_password"),
    path(
        "user/<int:pk>/",
        UpdateDetailView.as_view(),
        name="update_user_data_by_id",
    ),
    path("teachers/<int:pk>/", TeacherDetailsViiew.as_view()),
    path("encrypt-id/", EncryptUserIdView.as_view(), name="encrypt_user_id"),
    path(
        "encrypt-id/<int:id>/",
        EncryptUserIdByParamView.as_view(),
        name="encrypt_user_id_by_param",
    ),
    path(
        "user-data/",
        GetUserDataByEncryptedIdView.as_view(),
        name="get_user_data_by_encrypted_id",
    ),
]
