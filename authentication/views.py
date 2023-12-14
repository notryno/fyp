# views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import CustomUser
from django.utils import timezone
from .serializers import UserSerializer
from django.contrib.auth import authenticate, login

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def perform_create(self, serializer):
        print("Request data:", self.request.data)
        serializer.validated_data['first_name'] = self.request.data.get('first_name')
        serializer.validated_data['last_name'] = self.request.data.get('last_name')
        serializer.validated_data['profile_picture'] = self.request.data.get('profile_picture')        
        hashed_password = make_password(serializer.validated_data['password'])
        serializer.validated_data['password'] = hashed_password
        print("Request FILES:", self.request.FILES)
        user = serializer.create(serializer.validated_data)

        refresh = RefreshToken.for_user(user)

        print(f"User '{user.email}' successfully registered!")
        serialized_user = UserSerializer(user)
        data = {
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'profile_picture': serialized_user.data['profile_picture'],
        }
        print("User profile picture URL:", data['profile_picture'])

        return Response(data, status=status.HTTP_201_CREATED)

class LoginView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')

        if email is None or password is None:
            return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        print("Authenticated user:", user)

        if not user:
            return Response({'error': 'Invalid credentials'},status=status.HTTP_401_UNAUTHORIZED)
        
        user.last_login = timezone.now()
        print(user.last_login)
        user.save()

        login(request, user)

        serialized_user = UserSerializer(user)

        refresh = RefreshToken.for_user(user)

        print(f"User '{user.email}' successfully logged in!")
        
        data = {
            'message': 'Registration successful',
            'access_token': str(refresh.access_token),
            'refresh_token': str(refresh),
            'profile_picture': serialized_user.data['profile_picture']
        }
        return Response(data, status=status.HTTP_200_OK)
