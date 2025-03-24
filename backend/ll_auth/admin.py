from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, School

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'picture', 'school', 'title')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(School)