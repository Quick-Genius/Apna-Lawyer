from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LawyerViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'list', LawyerViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
