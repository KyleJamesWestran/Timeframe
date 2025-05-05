from rest_framework import serializers
from tf_auth.models import CustomUser, School
from django.contrib.auth.models import Group

class UserSerializer(serializers.ModelSerializer):
    school_name = serializers.CharField(source='school.name', read_only=True)
    groups = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'title', 'first_name', 'last_name', 'email', 'phone', 'picture', 'school', 'school_name', 'groups', 'password', 'is_active'
        )
        # extra_kwargs = {'password': {'write_only': True}}

    def get_groups(self, obj):
        return ', '.join(group.name for group in obj.groups.all())

    def create(self, validated_data):
        user_type = self.context['request'].data.get('user_type', 'Admin')
        user = CustomUser.objects.create_user(**validated_data)

        group, _ = Group.objects.get_or_create(name=user_type)
        user.groups.add(group)

        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()
        return instance

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