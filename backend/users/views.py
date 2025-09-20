"""
Authentication views with JWT support and Supabase integration.
Provides secure user registration, login, logout, and profile management.
"""

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.db import transaction
import logging

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer
)
from .supabase_service import supabase_user_service

User = get_user_model()
logger = logging.getLogger(__name__)


class SignupView(APIView):
    """
    User registration endpoint.
    Creates user in Django and syncs to Supabase.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Register a new user.
        
        Expected payload:
        {
            "name": "John Doe",
            "email": "john@example.com",
            "password": "securepassword123",
            "password_confirm": "securepassword123",
            "residence": "New York",
            "is_lawyer": false
        }
        """
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Create user in Django
                    user = serializer.save()
                    
                    # Sync user to Supabase
                    supabase_result = supabase_user_service.sync_user_to_supabase(user)
                    
                    if not supabase_result:
                        logger.warning(f"Failed to sync user {user.email} to Supabase")
                    
                    # Generate JWT tokens
                    refresh = RefreshToken.for_user(user)
                    access_token = refresh.access_token
                    
                    return Response({
                        'message': 'User registered successfully',
                        'user': {
                            'id': str(user.id),
                            'name': user.name,
                            'email': user.email,
                            'is_lawyer': user.is_lawyer,
                            'residence': user.residence
                        },
                        'tokens': {
                            'access': str(access_token),
                            'refresh': str(refresh)
                        }
                    }, status=status.HTTP_201_CREATED)
                    
            except Exception as e:
                logger.error(f"Error during user registration: {str(e)}")
                return Response({
                    'error': 'Registration failed. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    User login endpoint with JWT token generation.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """
        Authenticate user and return JWT tokens.
        
        Expected payload:
        {
            "email": "john@example.com",
            "password": "securepassword123"
        }
        """
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Log the user in (for session-based auth compatibility)
            login(request, user)
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': str(user.id),
                    'name': user.name,
                    'email': user.email,
                    'is_lawyer': user.is_lawyer,
                    'residence': user.residence
                },
                'tokens': {
                    'access': str(access_token),
                    'refresh': str(refresh)
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    User logout endpoint.
    Blacklists the refresh token and clears session.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Logout user by blacklisting refresh token.
        
        Expected payload:
        {
            "refresh": "refresh_token_here"
        }
        """
        try:
            refresh_token = request.data.get('refresh')
            
            if refresh_token:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            # Clear session
            logout(request)
            
            return Response({
                'message': 'Logout successful'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Error during logout: {str(e)}")
            return Response({
                'message': 'Logout successful'  # Still return success even if token blacklisting fails
            }, status=status.HTTP_200_OK)


class ProfileView(APIView):
    """
    User profile management endpoint.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user profile."""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        """Update user profile."""
        serializer = UserProfileSerializer(
            request.user, 
            data=request.data, 
            partial=True
        )
    
    def patch(self, request):
        """Partially update user profile."""
        return self.put(request)  # Use same logic as PUT
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Try to sync updated user to Supabase (don't fail if this fails)
                try:
                    supabase_result = supabase_user_service.sync_user_to_supabase(user)
                    if not supabase_result:
                        logger.warning(f"Failed to sync updated user {user.email} to Supabase")
                except Exception as e:
                    logger.warning(f"Supabase sync error for user {user.email}: {str(e)}")
                
                return Response(serializer.data, status=status.HTTP_200_OK)
                    
            except Exception as e:
                logger.error(f"Error updating user profile: {str(e)}")
                return Response({
                    'error': 'Profile update failed. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Change user password endpoint.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Change user password.
        
        Expected payload:
        {
            "old_password": "currentpassword",
            "new_password": "newpassword123",
            "new_password_confirm": "newpassword123"
        }
        """
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            try:
                serializer.save()
                return Response({
                    'message': 'Password changed successfully'
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.error(f"Error changing password: {str(e)}")
                return Response({
                    'error': 'Password change failed. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Legacy API views for backward compatibility
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Legacy signup endpoint - redirects to new class-based view."""
    view = SignupView()
    return view.post(request)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Legacy login endpoint - redirects to new class-based view."""
    view = LoginView()
    return view.post(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Legacy logout endpoint - redirects to new class-based view."""
    view = LogoutView()
    return view.post(request)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Legacy profile endpoint - redirects to new class-based view."""
    view = ProfileView()
    return view.get(request)