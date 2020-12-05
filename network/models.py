from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime


class User(AbstractUser):
    number_followers=models.IntegerField(default=0)
    
class Post(models.Model):
    author=models.ForeignKey(User, on_delete=models.CASCADE)
    subject=models.CharField(max_length=255)
    body=models.TextField(blank=True)
    timestamp=models.DateTimeField(default=datetime.now)
    likecount = models.IntegerField(default=0)
    
    def serialize(self):
        return {
            "id": self.id,
            "author": self.author.username,
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp,
            "likecount": self.likecount
        }
    
class Following(models.Model):
    following=models.ForeignKey(User, related_name="following", on_delete=models.CASCADE)
    followedby=models.ForeignKey(User, related_name="followedby", on_delete=models.CASCADE)

class Likes(models.Model):
    liker=models.ForeignKey(User, on_delete=models.CASCADE)
    likedpost=models.ForeignKey(Post, on_delete=models.CASCADE)
    liked=models.BooleanField() 
    
