from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from tf_auth.models import CustomUser, School
from .serializers import UserSerializer, SchoolSerializer, GroupSerializer 
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth.models import Group

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return CustomUser.objects.filter(id=user.id)
    
class SchoolViewSet(viewsets.ModelViewSet):
    serializer_class = SchoolSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return School.objects.filter(id=user.school_id)

    
class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Group.objects.all()

class TitlesViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        choices = CustomUser._meta.get_field('title').choices
        data = [{'key': key, 'label': label} for key, label in choices]
        return Response(data)

class DaysViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        choices = School._meta.get_field('days').choices
        data = [{'key': key, 'label': label} for key, label in choices]
        return Response(data)