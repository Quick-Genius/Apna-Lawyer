from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.lawyer_registration, name='lawyer_registration'),
    path('list/', views.lawyer_list, name='lawyer_list'),
    path('profile/<int:lawyer_id>/', views.lawyer_profile, name='lawyer_profile'),
]