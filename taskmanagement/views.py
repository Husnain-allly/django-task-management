from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.views import View
from django.shortcuts import redirect, get_object_or_404
from .models import Task
from .choices import TaskStatus
from .forms import TaskForm
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
class TaskListView(ListView):
    model = Task
    template_name = "taskmanagement/task_list.html"
    context_object_name = "tasks"
    paginate_by = 10

    def get_queryset(self):
        return Task.objects.order_by("-created_at")


class TaskCreateView(CreateView):
    model = Task
    form_class = TaskForm
    template_name = "taskmanagement/task_form.html"
    success_url = reverse_lazy("tasks:list")


class TaskUpdateView(UpdateView):
    model = Task
    form_class = TaskForm
    template_name = "taskmanagement/task_form.html"
    success_url = reverse_lazy("tasks:list")


class TaskDeleteView(DeleteView):
    model = Task
    template_name = "taskmanagement/task_confirm_delete.html"
    success_url = reverse_lazy("tasks:list")

class TaskArchiveView(View):
    def post(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        task.is_archived = True
        task.save(update_fields=["is_archived"])
        return redirect(reverse_lazy("tasks:list"))

class TaskMarkDoneView(View):
    def post(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        task.status = TaskStatus.DONE
        task.save(update_fields=["status"])
        return redirect("tasks:list")
    

@api_view(["POST"])
@permission_classes([AllowAny])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({"message": "Login successful"})
    else:
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password or not email:
        raise ValidationError("Please provide username, email, and password.")
    
    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)


    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    