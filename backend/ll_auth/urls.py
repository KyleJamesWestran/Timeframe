from django.contrib import admin
from django.urls import path, include
from ll_auth.views import RegisterSchoolView, GetUserInfoView

urlpatterns = [
    path('register_school/', RegisterSchoolView.as_view(), name='register_school'),
    path('get_user_info/', GetUserInfoView.as_view(), name='get_user_info'),
]
