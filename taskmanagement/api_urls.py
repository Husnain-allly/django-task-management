from rest_framework.routers import DefaultRouter
from .api import TaskViewSet
from django.urls import path
from .me import me

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("me/", me),
]

urlpatterns += router.urls
