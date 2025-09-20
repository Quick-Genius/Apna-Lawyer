import json
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin

User = get_user_model()

class CustomUserDataMiddleware(MiddlewareMixin):
    """
    Middleware to handle X-User-Data header for authentication
    """
    
    def process_request(self, request):
        # Check if X-User-Data header is present
        user_data_header = request.META.get('HTTP_X_USER_DATA')
        
        if user_data_header and not request.user.is_authenticated:
            try:
                # Parse the user data from the header
                user_data = json.loads(user_data_header)
                user_id = user_data.get('id')
                
                if user_id:
                    # Try to get the user from the database
                    try:
                        user = User.objects.get(id=user_id)
                        # Set the user on the request
                        request.user = user
                        request._cached_user = user
                    except User.DoesNotExist:
                        # User doesn't exist, keep as anonymous
                        pass
                        
            except (json.JSONDecodeError, ValueError, KeyError):
                # Invalid user data, keep as anonymous
                pass
        
        return None