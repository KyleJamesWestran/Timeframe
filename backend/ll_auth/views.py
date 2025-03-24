from django.shortcuts import render, get_object_or_404, redirect
from rest_framework import generics, permissions, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ll_auth.models import CustomUser, School
from .serializers import RegisterSchoolSerializer, UserSerializer, TeacherSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

class RegisterSchoolView(generics.CreateAPIView):
    queryset = School.objects.all()
    serializer_class = RegisterSchoolSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Ensure serializer returns the created user

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "School and user registered successfully!",
                "access": access_token,
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetUserInfoView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request, *args, **kwargs):
        user = request.user  # Get user from the access token
        serializer = self.get_serializer(user)  # Serialize user data

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users access this

    def get_queryset(self):
        user = self.request.user
        print(f"Logged-in user: {user}")  # Should now print the actual user, not AnonymousUser

        teacher_group = Group.objects.get(name="Teacher")
        return CustomUser.objects.filter(groups=teacher_group, school_id=user.school_id)