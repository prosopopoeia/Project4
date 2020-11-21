import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from network.forms import NewPostForm
from .models import User, Post, Following, Likes
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt, csrf_protect


def index(request):    
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    
    form = NewPostForm()
    return render(request, "network/index.html", {
        "post_form" : form,
        "current_user" : request.session.get("uname")        
    })
    
def showall(request): 
    vallposts = Post.objects.order_by("-timestamp").all() 
    return JsonResponse([vallpost.serialize() for vallpost in vallposts], safe=False)
    #return displayAllPosts(request, vallposts) 
    
def displayAllPosts(request, iterable_collection):
      
    paginator = Paginator(iterable_collection, 10)
    page_number = request.GET.get('page')
    vpage_obj = paginator.get_page(page_number)
    form = NewPostForm()
    
    
    render(request, "network/index.html", {    
        "post_form" : form,
        "dpage_obj": vpage_obj,
        "current_user" : request.session.get("uname")
    })

@login_required
def editpost(request, pid=None):    
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    ppost = "no post"
    if request.method == "POST":
        data = json.loads(request.body)
        val = data["feid"]
        vpost = data["fbody"]
        ppost = request.body        
    else:
        vpost = Post.objects.get(id=pid) 
    form = NewPostForm()
    val = request.POST.get("feid")
    # if val is None:
        # val = "failure"
    
    
    return render(request, "network/edit.html", {    
        "edit_form" : form,
        "test" : val,
        "current_post" : vpost,
        "clip" : ppost
    })

def editpostb(request):    
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    ppost = "no post"
    if request.method == "POST":
        data = json.loads(request.body)
        vid = data["feid"]
        vbody = data["fbody"]
        #ppost = request.body
        vpost = Post.objects.get(id=vid) 
        vpost.body = vbody
        vpost.save()
        return JsonResponse({"message": "success"}, status=201)
        
    else:
        return JsonResponse({"error": "POST request required." }, status=400)
        
   

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
def likepost(request):
        data = json.loads(request.body)
        vpostid = data["postid"]
        likedPost = Post.objects.get(id=vpostid)
        vusername = request.session.get("uname")
        vuser = User.objects.get(username=vusername)
        #if this is the first time the post has been liked...
        try:
            like_object = Likes.objects.get(liked=likedPost, liker=vuser)
            like_object.count += 1
            like_object.save()
        except:
            Likes.objects.create(
                liker=vuser,
                liked=likedPost,
                count=1)
        
        return JsonResponse({"message": "liked"}, status=201) 
        
 
        
        
        
    
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
@login_required
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
  
@login_required
def following(request):
    vusername = request.session.get("uname")
    vthis_user = User.objects.get(username=vusername)
    
    list_of_followed_posts = Post.objects.filter(author__following__followedby=vthis_user)
        
    return displayAllPosts(request, list_of_followed_posts)