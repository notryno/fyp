# authentication/serializers.py

from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    profile_picture = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ["email", "password", "first_name", "last_name", "profile_picture"]

    def to_representation(self, instance):
        if isinstance(instance, CustomUser):
            representation = super().to_representation(instance)
            representation["profile_picture"] = (
                instance.profile_picture.url if instance.profile_picture else None
            )
            return representation
        return instance

    def create(self, validated_data):
        profile_picture = validated_data.pop("profile_picture", None)
        user = super().create(validated_data)
        if profile_picture:
            user.profile_picture = profile_picture
            user.save()
        return user


class GetUserDataSerializer(serializers.ModelSerializer):
    profile_picture = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "classroom",
            "username",
            "email_verified",
        ]

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.classroom = validated_data.get("classroom", instance.last_name)

        # Update the profile picture only if provided
        profile_picture = validated_data.get("profile_picture")
        if profile_picture is not None:
            instance.profile_picture = profile_picture

        instance.save()
        return instance


class PartialUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "profile_picture"]
