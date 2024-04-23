# views.py

import json

import pyotp
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from utilities.email_otp import generate_and_send_otp

from .models import CustomUser
from .serializers import (
    GetUserDataSerializer,
    PartialUserSerializer,
    TeacherSerializer,
    UserSerializer,
)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        serializer.validated_data["first_name"] = self.request.data.get("first_name")
        serializer.validated_data["last_name"] = self.request.data.get("last_name")
        serializer.validated_data["profile_picture"] = self.request.data.get(
            "profile_picture"
        )
        hashed_password = make_password(serializer.validated_data["password"])
        serializer.validated_data["password"] = hashed_password
        print("Request FILES:", self.request.FILES)
        user = serializer.create(serializer.validated_data)

        refresh = RefreshToken.for_user(user)

        print(f"User '{user.email}' successfully registered!")
        serialized_user = UserSerializer(user)
        data = {
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "profile_picture": serialized_user.data["profile_picture"],
        }
        print("User profile picture URL:", data["profile_picture"])

        generate_and_send_otp(user)

        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        if email is None or password is None:
            return Response(
                {"error": "Please provide both email and password"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, email=email, password=password)
        print("Authenticated user:", user)

        if not user:
            return Response(
                {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
            )

        user.last_login = timezone.now()
        print(user.last_login)
        user.save()

        login(request, user)

        serialized_user = UserSerializer(user)

        refresh = RefreshToken.for_user(user)

        print(f"User '{user.email}' successfully logged in!")

        data = {
            "message": "Login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "profile_picture": serialized_user.data["profile_picture"],
        }
        return Response(data, status=status.HTTP_200_OK)


class GetUserDataView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        user = request.user
        serializer = GetUserDataSerializer(user)
        data = {
            "user_data": serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)


class UpdateUserDataView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PartialUserSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = GetUserDataSerializer
    permission_classes = [IsAuthenticated]


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_password(request):
    print("Request data:", request.data)
    user = request.user

    print("User:", user)
    old_password = request.data.get("oldPassword", "")
    new_password = request.data.get("newPassword", "")

    # Check if the old password matches
    if not check_password(old_password, user.password):
        return Response(
            {"error": "Invalid old password"}, status=status.HTTP_400_BAD_REQUEST
        )

    # Update the password
    user.set_password(new_password)
    user.save()

    # Use DRF Response for consistent handling
    return Response(
        {"message": "Password updated successfully"}, status=status.HTTP_200_OK
    )


class GetStudentsDataView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        students = CustomUser.objects.filter(is_staff=False)
        serializer = GetUserDataSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class GetTeachersDataView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        teachers = CustomUser.objects.filter(is_staff=True)
        serializer = TeacherSerializer(teachers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        data = json.loads(request.body)
        otp_entered = data.get("otp")
        print("Type", type(otp_entered))
        print("otp_entered:", otp_entered)
        if otp_entered:
            email = data.get("email")
            print("email:", email)
            try:
                user = CustomUser.objects.get(email=email)
                print("User:", user)
                print("User.otp_secret:", user.otp_secret)
                print("User.otp_secret:", type(user.otp_secret))
                otp = pyotp.TOTP(user.otp_secret, interval=120)
                print("OTP from DB:", otp)
                if otp.verify(otp_entered):
                    # OTP matched, mark email as verified
                    print("OTP matched!")
                    origin = data.get("origin")
                    print("Origin", origin)
                    if origin == "login" or origin == "otp":
                        user.email_verified = True
                        user.save()
                        return JsonResponse(
                            {
                                "success": True,
                                "message": "Email verified successfully!",
                            },
                            status=200,
                        )
                    elif origin == "reset_password":
                        print("In reset password")
                        reset_token = generate_token(user)
                        print("Reset token:", reset_token)
                        return JsonResponse(
                            {
                                "success": True,
                                "message": "Email verified successfully!",
                                "reset_token": reset_token,
                            },
                            status=200,
                        )
                else:
                    print("OTP did not match!")
                    return JsonResponse(
                        {
                            "success": False,
                            "message": "Invalid OTP. Please try again.",
                        },
                        status=400,
                    )
            except CustomUser.DoesNotExist:
                return JsonResponse(
                    {"success": False, "message": "Invalid email"}, status=400
                )
    return JsonResponse(
        {"success": False, "message": "Invalid request method"}, status=405
    )


@csrf_exempt
def reset_password(request):
    data = json.loads(request.body)
    email = data.get("email")
    password = data.get("password")
    reset_token = data.get("resetToken")

    try:
        user = CustomUser.objects.get(email=email)
        print("User:", user)
        print("Reset token:", reset_token)

        if not validate_token(user, reset_token):
            return JsonResponse(
                {"error": "Invalid or expired reset token"},
                status=400,
            )
        print(validate_token(user, reset_token))

        print("Password:", password)
        user.set_password(password)
        user.save()
        send_mail(
            "Password Changed",
            "Your password has been changed successfully. If you did not make this change, please contact the administrator.",
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        print("Password changed!")
        return JsonResponse(
            {"message": "Password changed successfully", "success": True},
            status=200,
        )
    except CustomUser.DoesNotExist:
        return JsonResponse({"error": "Invalid email", "success": False}, status=400)


def generate_token(user):
    token_generator = PasswordResetTokenGenerator()
    return token_generator.make_token(user)


def validate_token(user, token):
    token_generator = PasswordResetTokenGenerator()
    return token_generator.check_token(user, token)


class TeacherDetailsViiew(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = TeacherSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        # Print the data being sent for patch
        print("Data being sent for PATCH request:", serializer)

        self.perform_update(serializer)

        return Response(serializer.data)
