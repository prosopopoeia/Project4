from django.contrib.auth.models import AbstractUser
from django.db import models
import datetime


class User(AbstractUser):
    number_followers=models.IntegerField(default=0)
    
class Post(models.Model):
    author=models.ForeignKey("User", on_delete=models.CASCADE)
    subject=models.CharField(max_length=255)
    body=models.TextField(blank=True)
    timestamp=models.DateTimeField(default=datetime.date.today)
    
class Following(models.Model):
    follower=models.ForeignKey("User", on_delete=models.CASCADE, related_name="networkFollowingUser")
    followed=models.ForeignKey("User", on_delete=models.CASCADE, related_name="networkFollowedUser")

class Likes(models.Model):
    liker=models.ForeignKey("User", on_delete=models.CASCADE)
    liked=models.ForeignKey("Post", on_delete=models.CASCADE)
    
