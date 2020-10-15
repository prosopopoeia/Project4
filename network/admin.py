from django.contrib import admin

from .models import User, Post, Following, Likes

admin.site.register(Post)
admin.site.register(User)
admin.site.register(Following)
admin.site.register(Likes)