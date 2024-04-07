import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, status
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Schedule, SpecialSchedule
from .serializers import ScheduleSerializer, SpecialScheduleSerializer


class ScheduleListView(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = request.user
        classroom = user.classroom
        queryset = self.get_queryset().filter(classroom=classroom)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# class ScheduleListView(generics.ListCreateAPIView):
#     permission_classes = [IsAuthenticated]

#     def list(self, request, *args, **kwargs):
#         schedules = Schedule.objects.filter(user=request.user)
#         schedule_serializer = ScheduleSerializer(schedules, many=True)

#         special_schedules = SpecialSchedule.objects.filter(schedule__user=request.user)
#         special_schedule_serializer = SpecialScheduleSerializer(
#             special_schedules, many=True
#         )

#         data = {
#             "schedules": schedule_serializer.data,
#             "special_schedules": special_schedule_serializer.data,
#         }

#         return Response(data, status=status.HTTP_200_OK)


class SpecialScheduleListView(generics.ListCreateAPIView):
    serializer_class = SpecialScheduleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SpecialSchedule.objects.select_related("schedule").filter(
            schedule__classroom=self.request.user.classroom
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


@csrf_exempt
def create_schedule(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        serializer = ScheduleSerializer(data=data)
        print("data", data)
        print("serializer", serializer)
        print(serializer.is_valid())
        if serializer.is_valid():
            serializer.save()
            print("Schedule created")
            return JsonResponse(serializer.data, status=201)
        else:
            print("Errors:", serializer.errors)
            return JsonResponse(serializer.errors, status=400)
    return JsonResponse({"error": "Only POST requests are allowed"}, status=400)
