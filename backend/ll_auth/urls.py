from django.contrib import admin
from django.urls import path, include
from ll_auth.views import RegisterSchoolView, GetUserInfoView, TeacherViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'teachers', TeacherViewSet, basename='teacher')

urlpatterns = [
    path('register_school/', RegisterSchoolView.as_view(), name='register_school'),
    path('get_user_info/', GetUserInfoView.as_view(), name='get_user_info'),
    path('', include(router.urls)),
]
