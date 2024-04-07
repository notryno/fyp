# views.py

from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import check_password, make_password
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser
from .serializers import GetUserDataSerializer, PartialUserSerializer, UserSerializer


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
