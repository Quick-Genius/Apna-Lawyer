from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'lawyers', views.LawyerViewSet, basename='lawyer')

urlpatterns = [
    path('', include(router.urls)),
    path('api/lawyers/', views.lawyer_list, name='lawyer-list'),
    path('api/lawyers/create/', views.create_lawyer, name='lawyer-create'),
    path('api/lawyers/sync-to-supabase/', views.sync_lawyer_to_supabase, name='lawyer-sync-supabase'),
]