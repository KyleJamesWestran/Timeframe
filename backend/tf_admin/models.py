from django.db import models
from tf_auth.models import School

class Subject(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, related_name="subjects")
    teachers = models.ManyToManyField('tf_auth.CustomUser', related_name='subjects')

    def __str__(self):
        return f"{self.name}"