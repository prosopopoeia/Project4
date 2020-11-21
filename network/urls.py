
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    #API
    path("newpost", views.newpost, name="newpost"),
    path("profile_post/<str:puser>", views.profile_post, name="profile_post"),
    path("add_follower", views.add_follower, name="add_follower"),
    #path("profile_post/add_follower", views.add_follower, name="add_follower"),
    path("following", views.following, name="following"),
    path("editpost/<int:pid>", views.editpost, name="editpost"),
    path("editpost/editpostb", views.editpostb, name="editpostb"),
    path("likepost", views.likepost, name="likepost"),    
    path("showall", views.showall, name="showall"),
]
