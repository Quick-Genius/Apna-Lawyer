from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # New class-based API endpoints
    path('signup/', views.SignupView.as_view(), name='api_signup'),
    path('login/', views.LoginView.as_view(), name='api_login'),
    path('logout/', views.LogoutView.as_view(), name='api_logout'),
    path('profile/', views.ProfileView.as_view(), name='api_profile'),
    path('change-password/', views.ChangePasswordView.as_view(), name='api_change_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Legacy function-based endpoints (for backward compatibility)
    path('legacy/login/', views.login_view, name='legacy_login'),
    path('legacy/signup/', views.signup_view, name='legacy_signup'),
    path('legacy/logout/', views.logout_view, name='legacy_logout'),
    path('legacy/profile/', views.profile_view, name='legacy_profile'),
]