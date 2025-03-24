from django.shortcuts import render, get_object_or_404
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from ll_auth.models import CustomUser, School
from .serializers import RegisterSchoolSerializer, UserSerializer, TeacherSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import Group

auth_type = [AllowAny] #[IsAuthenticated], [AllowAny]

class RegisterSchoolView(generics.CreateAPIView):
    queryset = School.objects.all()
    serializer_class = RegisterSchoolSerializer
    permission_classes = auth_type

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
    permission_classes = auth_type

    def get(self, request, *args, **kwargs):
        user = request.user  # Get user from the access token
        serializer = self.get_serializer(user)  # Serialize user data

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class TeacherViewSet(viewsets.ModelViewSet):
    serializer_class = TeacherSerializer
    permission_classes = auth_type

    def get_queryset(self):
        teacher_group = Group.objects.get(name="Teacher")
        return CustomUser.objects.filter(groups=teacher_group)  # Filter only Teachers