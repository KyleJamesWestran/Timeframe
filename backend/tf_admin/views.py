from rest_framework import permissions, viewsets
from tf_admin.models import Subject
from tf_auth.models import CustomUser
from .serializers import TeacherSerializer,  StudentSerializer, SubjectSerializer
from django.contrib.auth.models import Group
from rest_framework.permissions import BasePermission
from rest_framework.decorators import action

# Views
class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        teacher_group = Group.objects.get(name="Teacher")
        return CustomUser.objects.filter(groups=teacher_group, school_id=user.school_id)
    
    def perform_create(self, serializer):
        """Ensure the created teacher is linked to the user's school and added to the Teacher group."""
        user = serializer.save(school_id=self.request.user.school_id)
        teacher_group = Group.objects.get(name="Teacher")
        user.groups.add(teacher_group)
    
class StudentViewSet(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        student_group = Group.objects.get(name="Student")
        return CustomUser.objects.filter(groups=student_group, school_id=user.school_id)

    def perform_create(self, serializer):
        """Ensure the created subject is linked to the authenticated user's school."""
        user = serializer.save(school_id=self.request.user.school_id)
        teacher_group = Group.objects.get(name="Student")
        user.groups.add(teacher_group)

class SubjectViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Subject.objects.filter(school_id=self.request.user.school_id)

    def perform_create(self, serializer):
        serializer.save(school_id=self.request.user.school_id)