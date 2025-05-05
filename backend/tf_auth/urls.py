from django.contrib import admin
from django.urls import path, include
from tf_auth.views import RegisterSchoolView, CurrentUserView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    path('register_school/', RegisterSchoolView.as_view(), name='register_school'),
    path('user_info/', CurrentUserView.as_view(), name='user_info'),
    path('', include(router.urls)),
]
