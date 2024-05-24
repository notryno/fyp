import json

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification, UserNotification
from .serializers import (
    CombinedNotificationSerializer,
    NotificationSerializer,
    UserNotificationSerializer,
)

# class CreateNotificationView(APIView):
#     serializer_class = NotificationSerializer
#     permission_classes = [IsAuthenticated]

#     def perform_create(self, serializer):
#         notification = serializer.save(user=self.request.user)
#         channel_layer = get_channel_layer()
#         group_name = f"notifications_{self.request.user.id}"
#         async_to_sync(channel_layer.group_send)(
#             group_name,
#             {
#                 "type": "send_notification",
#                 "notification_id": notification.id,
#             },
#         )

#     def create(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         self.perform_create(serializer)
#         notification = serializer.instance
#         combined_serializer = CombinedNotificationSerializer(
#             notification, context={"request": request}
#         )
#         headers = self.get_success_headers(combined_serializer.data)
#         return Response(
#             combined_serializer.data, status=status.HTTP_201_CREATED, headers=headers
#         )


class CreateNotificationView(APIView):
    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            notification = serializer.save()

            # Fetch the serialized data to include the nested author information
            notification_data = NotificationSerializer(notification).data

            # Send the notification to WebSocket
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"notifications_{self.request.user.id}",  # Send to the specific user's group
                {
                    "type": "send_notification",
                    "notification": notification_data,
                },
            )

            return Response(notification_data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# views.py
class NotificationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CombinedNotificationSerializer

    def get_queryset(self):
        user = self.request.user
        # Fetch notifications directly to the user
        user_notifications = Notification.objects.filter(user=user)
        # Fetch notifications to the user's group (classroom)
        group_notifications = Notification.objects.filter(group=user.classroom)
        # Combine both querysets
        all_notifications = user_notifications | group_notifications

        # Ensure UserNotification entries exist
        for notification in all_notifications:
            UserNotification.objects.get_or_create(user=user, notification=notification)

        return all_notifications.distinct().order_by("-created_at")


# class NotificationListView(generics.ListAPIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         user_notifications = UserNotification.objects.filter(user=user).order_by(
#             "-created_at"
#         )
#         serializer = UserNotificationSerializer(user_notifications, many=True)
#         return Response(serializer.data)


class MarkNotificationAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        user_notification = get_object_or_404(
            UserNotification, user=request.user, notification_id=notification_id
        )
        user_notification.read = True
        user_notification.save()
        return Response({"status": "Notification marked as read."})


class MarkAllAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = request.user

        # Fetch notifications sent directly to the user
        user_notifications = Notification.objects.filter(user=user)

        # Fetch notifications sent to the user's group (classroom)
        group_notifications = Notification.objects.filter(group=user.classroom)

        # Combine both querysets
        all_notifications = user_notifications | group_notifications

        # Ensure there's a UserNotification entry for each notification
        for notification in all_notifications:
            UserNotification.objects.get_or_create(user=user, notification=notification)

        # Mark all UserNotification entries as read
        UserNotification.objects.filter(user=user, read=False).update(read=True)

        return Response(
            {"message": "All notifications marked as read"}, status=status.HTTP_200_OK
        )
