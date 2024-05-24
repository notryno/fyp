# serializers.py
from rest_framework import serializers

from authentication.models import CustomUser
from authentication.serializers import PartialUserSerializer

from .models import Notification, UserNotification


class NotificationSerializer(serializers.ModelSerializer):
    author = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "author", "title", "group", "message", "created_at", "user"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        author = CustomUser.objects.get(pk=instance.author.pk)
        representation["author"] = {
            "first_name": author.first_name,
            "last_name": author.last_name,
            "profile_picture": author.profile_picture,
        }
        return representation


class UserNotificationSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer()

    class Meta:
        model = UserNotification
        fields = [
            "id",
            "notification",
            "read",
            "read_at",
        ]


class CombinedNotificationSerializer(serializers.ModelSerializer):
    read = serializers.SerializerMethodField()
    author = PartialUserSerializer()

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "author",
            "title",
            "group",
            "message",
            "created_at",
            "read",
        ]

    def get_read(self, obj):
        user = self.context["request"].user
        try:
            user_notification = UserNotification.objects.get(
                user=user, notification=obj
            )
            return user_notification.read
        except UserNotification.DoesNotExist:
            return False


class CombinedSerializer(serializers.ModelSerializer):
    author = PartialUserSerializer()

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "author",
            "title",
            "group",
            "message",
            "created_at",
        ]

    def to_representation(self, instance):
        instance = Notification.objects.select_related("author").get(id=instance.id)
        return super().to_representation(instance)
