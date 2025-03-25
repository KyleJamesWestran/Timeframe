from rest_framework import serializers
from ll_auth.models import CustomUser, School
from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'phone', 'picture', 'school', 'password', )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)

        # Assign user to 'Admin' group
        admin_group, created = Group.objects.get_or_create(name='Admin')
        user.groups.add(admin_group)

        return user

class RegisterSchoolSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = School
        fields = ('id', 'name', 'phone', 'email', 'motto', 'crest', 'street', 'suburb', 'city', 'country', 'postal_code', 'user')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        school = School.objects.create(**validated_data)
        user_data['school'] = school
        user = CustomUser.objects.create_user(**user_data)

        # Assign user to 'Admin' group
        admin_group, created = Group.objects.get_or_create(name='Admin')
        user.groups.add(admin_group)

        return school