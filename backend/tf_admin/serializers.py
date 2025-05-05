from rest_framework import serializers
from tf_auth.models import CustomUser
from tf_admin.models import Class, Subject
from django.contrib.auth.models import Group

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'title', 'first_name', 'last_name', 'email', 'phone', 'picture']

    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to create a teacher")

        validated_data["school_id"] = request.user.school_id  
        teacher = CustomUser.objects.create(**validated_data)

        teacher_group, _ = Group.objects.get_or_create(name="Teacher")
        teacher.groups.add(teacher_group)

        return teacher
    
class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ['id', 'name', 'teacher']

    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to create a class")

        validated_data["school_id"] = request.user.school_id  

        return super().create(validated_data)

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

    def create(self, validated_data):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated to create a subject")

        validated_data["school_id"] = request.user.school_id  

        return super().create(validated_data)