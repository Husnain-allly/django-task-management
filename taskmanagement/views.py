from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView

from .models import Task
from .forms import TaskForm


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
