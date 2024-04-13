from rest_framework import serializers


class CourseSerializer(serializers.ModelSerializer):
    classrooms = serializers.PrimaryKeyRelatedField(many=True)

    class Meta:
        model = Course
        fields = "__all__"
