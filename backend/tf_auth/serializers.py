from rest_framework import serializers
from tf_auth.models import CustomUser, School, DAY_CHOICES
from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class SchoolSerializer(serializers.ModelSerializer):
    days = serializers.MultipleChoiceField(choices=DAY_CHOICES, required=False)
    class Meta:
        model = School
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'