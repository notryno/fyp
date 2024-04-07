from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse

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

def create_schedule(request):
    try:
        # Assuming the data is sent in JSON format
        data = request.POST

        # Extracting necessary data from the request
        title = data.get('title')
        start_date = data.get('start_date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        type = data.get('type')
        location = data.get('location')
        description = data.get('description')
        number_of_instances = data.get('number_of_instances')
        frequency_per_week = data.get('frequency_per_week')
        day_of_week = data.get('day_of_week')
        color = data.get('color')

        # Create a new Schedule object
        schedule = Schedule.objects.create(
            title=title,
            start_date=start_date,
            start_time=start_time,
            end_time=end_time,
            type=type,
            location=location,
            description=description,
            number_of_instances=number_of_instances,
            frequency_per_week=frequency_per_week,
            day_of_week=day_of_week,
            color=color,
        )

        # Return success message in JSON format
        return JsonResponse({'message': 'Schedule created successfully'}, status=201)
    except Exception as e:
        # Return error message in JSON format if creation fails
        return JsonResponse({'error': str(e)}, status=400)