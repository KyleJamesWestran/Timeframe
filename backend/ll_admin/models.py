from django.db import models
from ll_auth.models import School, CustomUser

class Class(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, related_name="classes")
    teacher = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, limit_choices_to={'groups__name': 'Teacher'})

    def __str__(self):
        return f"{self.name} - {self.school.name}"

class Subject(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, related_name="subjects")

    def __str__(self):
        return f"{self.name} - {self.school.name}"
