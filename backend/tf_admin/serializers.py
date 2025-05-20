from rest_framework import serializers
from tf_auth.models import CustomUser
from tf_admin.models import Subject
from django.contrib.auth.models import Group

class TeacherSerializer(serializers.ModelSerializer):
    subjects = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all(), many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'title', 'first_name', 'last_name', 'email', 'phone', 'picture', 'subjects']
    
class StudentSerializer(serializers.ModelSerializer):
    teacher = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.none())

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'title', 'first_name', 'last_name', 'picture', 'teacher']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        request = self.context.get('request', None)

        if request and hasattr(request, 'user'):
            self.fields['teacher'].queryset = CustomUser.objects.filter(
                groups__name='Teacher',
                school_id=request.user.school_id
            )


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'teachers']