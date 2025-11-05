from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('staff', 'Staff'),
        ('viewer', 'Viewer'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
