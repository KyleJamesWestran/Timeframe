from rest_framework import generics, permissions, viewsets
from rest_framework.response import Response
from rest_framework import status
from tf_auth.models import CustomUser, School
from .serializers import RegisterSchoolSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterSchoolView(generics.CreateAPIView):
    queryset = School.objects.all()
    serializer_class = RegisterSchoolSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                "message": "School and user registered successfully!",
                "access": access_token,
                "refresh": str(refresh)
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class userInfoView(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated] 

    def get(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(user) 

        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CurrentUserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user