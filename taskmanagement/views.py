from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.views import View
from django.shortcuts import redirect, get_object_or_404
from .models import Task
from .choices import TaskStatus
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