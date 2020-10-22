import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from network.forms import NewPostForm
from .models import User, Post, Following, Likes
from django.contrib.auth.decorators import login_required
from django.db.models import F, Q
from django.views.decorators.csrf import csrf_exempt, csrf_protect


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
        return HttpResponseRedirect(reverse("index"))
    Post.objects.create(
        author=thisUser, 
        subject=data["subject"], 
        body=data["body"]) 
    
    return displayAllPosts(request) 
    
@login_required
def profile_post(request, puser):
    try:
        vuser = User.objects.get(username=puser)
    except:
        return HttpResponseRedirect(reverse("index"))
    
    vusers_posts = Post.objects.filter(author=vuser)
    
    following_allowed = True
    already_following = True
    if puser == request.session.get("uname"):
        following_allowed = False
    
    try:
        vthis_user = User.objects.get(username=request.session.get("uname"))
        exists = Following.objects.get(followedby=vthis_user, following=vuser)
    except:
        already_following = False
    
    return render(request, "network/profile.html", {    
        "dAllposts" : vusers_posts,
        "dFollowerCount" : Following.objects.filter(following=vuser).count(),
        "dFollowingCount" : Following.objects.filter(followedby=vuser).count(),
        "duser_name" : puser,
        "show_follow_button" : following_allowed,
        "show_unfollow_button" : already_following
    })
    
@csrf_exempt
def add_follower(request):
    data = json.loads(request.body)
    vusername = request.session.get("uname")
    vthis_user = User.objects.get(username=vusername)
    vuser_tobe_followed = data.get("username")
    vother_user = User.objects.get(username=vuser_tobe_followed)
    try:
        exists = Following.objects.get(followedby=vthis_user, following=vother_user)
        exists.delete()
    except:
        Following.objects.create(followedby=vthis_user, following=vother_user)
    return displayAllPosts(request)
  
def following(request):
    vusername = request.session.get("uname")
    vthis_user = User.objects.get(username=vusername)
    #Select Posts where Post.author = Following.following and Following.followedby = this_user
    #all_followed_posts = Post.objects.filter(following__followedby=vthis_user, following__following=F('author'))
    
    tlist = Post.objects.all()
    list_of_followedbys = Following.objects.filter(followedby=vthis_user)
    lister = Post.objects.filter(author__following__followedby=vthis_user)
    # post_list = list_of_authors.entry_set.filter(
    
    # all_followed_posts = Post.objects.filter(au)
    
    # followed_users = Following.objects.filter(followedby=vthis_user)
    
    return render(request, "network/index.html", {    
        "dAllposts" : lister,
        "testData" : lister,
        "td2" : list_of_followedbys,
        "td3" : tlist,
        #"post_form" : form
    })