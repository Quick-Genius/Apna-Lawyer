"""
Custom authentication middleware for protected routes.
Handles JWT token validation and user authentication.
"""

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
import logging

User = get_user_model()
logger = logging.getLogger(__name__)


class JWTAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to authenticate users using JWT tokens for API endpoints.
    Only applies to API routes that require authentication.
    """
    
    # Routes that require authentication
    PROTECTED_ROUTES = [
        '/api/profile/',
        '/api/logout/',
        '/api/change-password/',
        '/chats/',
        '/lawyers/dashboard/',
    ]
    
    # Routes that should be excluded from authentication
    EXCLUDED_ROUTES = [
        '/api/signup/',
        '/api/login/',
        '/api/token/refresh/',
        '/admin/',
        '/users/login/',
        '/users/signup/',
    ]

    def process_request(self, request):
        """
        Process incoming request and authenticate user if needed.
        """
        path = request.path_info
        
        # Skip authentication for excluded routes
        if any(path.startswith(route) for route in self.EXCLUDED_ROUTES):
            return None
        
        # Check if route requires authentication
        if any(path.startswith(route) for route in self.PROTECTED_ROUTES):
            return self._authenticate_request(request)
        
        return None

    def _authenticate_request(self, request):
        """
        Authenticate the request using JWT token.
        """
        # Get authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        
        if not auth_header:
            return JsonResponse({
                'error': 'Authentication required',
                'message': 'Authorization header is missing'
            }, status=401)
        
        # Extract token from header
        try:
            token_type, token = auth_header.split(' ')
            if token_type.lower() != 'bearer':
                raise ValueError("Invalid token type")
        except ValueError:
            return JsonResponse({
                'error': 'Invalid authorization header',
                'message': 'Authorization header must be in format: Bearer <token>'
            }, status=401)
        
        # Validate and decode token
        try:
            # Validate token using SimpleJWT
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            
            # Get user from database
            user = User.objects.get(id=user_id)
            
            # Set user in request
            request.user = user
            
            return None  # Continue processing
            
        except (InvalidToken, TokenError) as e:
            logger.warning(f"Invalid JWT token: {str(e)}")
            return JsonResponse({
                'error': 'Invalid token',
                'message': 'The provided token is invalid or expired'
            }, status=401)
            
        except User.DoesNotExist:
            logger.warning(f"User not found for token: {user_id}")
            return JsonResponse({
                'error': 'User not found',
                'message': 'The user associated with this token does not exist'
            }, status=401)
            
        except Exception as e:
            logger.error(f"Authentication error: {str(e)}")
            return JsonResponse({
                'error': 'Authentication failed',
                'message': 'An error occurred during authentication'
            }, status=500)


class APIKeyAuthenticationMiddleware(MiddlewareMixin):
    """
    Alternative middleware for API key-based authentication.
    Can be used for service-to-service communication.
    """
    
    def process_request(self, request):
        """
        Check for API key in headers for specific endpoints.
        """
        # Only apply to specific API endpoints
        if not request.path_info.startswith('/api/'):
            return None
        
        # Check for API key header
        api_key = request.META.get('HTTP_X_API_KEY')
        
        if api_key:
            # Validate API key (implement your own logic)
            if self._validate_api_key(api_key):
                # Set a service user or skip user authentication
                request.api_authenticated = True
                return None
        
        return None

    def _validate_api_key(self, api_key):
        """
        Validate API key against configured keys.
        """
        # Implement your API key validation logic here
        # For example, check against environment variables or database
        valid_api_keys = [
            settings.SECRET_KEY[:32],  # Example: use part of secret key
        ]
        
        return api_key in valid_api_keys


class CORSAuthenticationMiddleware(MiddlewareMixin):
    """
    Middleware to handle CORS preflight requests for authenticated endpoints.
    """
    
    def process_request(self, request):
        """
        Handle OPTIONS requests for CORS preflight.
        """
        if request.method == 'OPTIONS':
            # Allow preflight requests without authentication
            return None
        
        return None