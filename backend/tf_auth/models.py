from django.contrib.auth.models import AbstractUser
from django.db import models

TITLE_CHOICES = [
    ('Mr', 'Mr'),
    ('Mrs', 'Mrs'),
    ('Ms', 'Ms'),
    ('Dr', 'Dr'),
    ('Prof', 'Prof'),
]

class School(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=150, null=False)
    phone = models.CharField(max_length=20, unique=True, null=True)
    email = models.CharField(max_length=150, unique=True, null=True)
    motto = models.CharField(max_length=255, null=True, blank=True)
    crest = models.TextField(null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    suburb = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    title = models.CharField(max_length=10, choices=TITLE_CHOICES, null=True, blank=True)
    phone = models.CharField(max_length=80, null=True, blank=True)
    picture = models.TextField(null=True, blank=True)
    school = models.ForeignKey('School', on_delete=models.CASCADE, null=True, related_name="users")

    def __str__(self):
        return f"{self.username}"