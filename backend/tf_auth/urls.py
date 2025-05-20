from django.contrib import admin
from django.urls import path, include
from tf_auth.views import UserViewSet, SchoolViewSet, GroupViewSet, TitlesViewSet, DaysViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

router.register(r'user', UserViewSet, basename='user')
router.register(r'school', SchoolViewSet, basename='school')
router.register(r'groups', GroupViewSet, basename='groups')
router.register(r'titles', TitlesViewSet, basename='titles')
router.register(r'days', DaysViewSet, basename='days')

urlpatterns = [
    path('', include(router.urls)),
]
