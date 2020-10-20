import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from network.forms import NewPostForm
from .models import User, Post
from django.contrib.auth.decorators import login_required

from django.views.decorators.csrf import csrf_exempt


def index(request):    
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
       
    return displayAllPosts(request) 
    
def displayAllPosts(request):
    vallposts = Post.objects.order_by("-timestamp")    
    
    form = NewPostForm()
    
    return render(request, "network/index.html", {    
        "dAllposts" : vallposts,        
        "post_form" : form
    })

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            request.session["uname"] = username
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        request.session["uname"] = username
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def newpost(request):

    
    data = json.loads(request.body)
    
    
    try:
        vusername = request.session.get("uname")
        thisUser = User.objects.get(username=vusername)
    except:
        thisUser = User.objects.get(username="jj")
    Post.objects.create(
        author=thisUser, 
        subject=data["subject"], 
        body=data["body"]) 
    
    return displayAllPosts(request) 
    
    
    
