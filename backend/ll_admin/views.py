from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from ll_admin.models import Subject, Class
from ll_auth.models import CustomUser
from .serializers import TeacherSerializer, SubjectSerializer, ClassSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        teacher_group = Group.objects.get(name="Teacher")
        return CustomUser.objects.filter(groups=teacher_group, school_id=user.school_id)

class ClassViewSet(viewsets.ModelViewSet):
    """ViewSet for managing classes within the authenticated user's school."""
    serializer_class = ClassSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return classes belonging to the authenticated user's school."""
        return Class.objects.filter(school_id=self.request.user.school_id)

    def perform_create(self, serializer):
        """Ensure the created class is linked to the authenticated user's school."""
        serializer.save(school_id=self.request.user.school_id)

class SubjectViewSet(viewsets.ModelViewSet):
    """ViewSet for managing subjects within the authenticated user's school."""
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Return subjects belonging to the authenticated user's school."""
        return Subject.objects.filter(school_id=self.request.user.school_id)

    def perform_create(self, serializer):
        """Ensure the created subject is linked to the authenticated user's school."""
        serializer.save(school_id=self.request.user.school_id)