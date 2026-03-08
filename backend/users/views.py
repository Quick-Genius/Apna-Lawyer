from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class SignupView(views.APIView):
    """User signup endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            username = data.get('email')
            email = data.get('email')
            password = data.get('password')
            name = data.get('name', email)

            if not all([email, password]):
                return Response({
                    'error': 'Missing required fields',
                    'fields_required': ['email', 'password']
                }, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(email=email).exists():
                return Response({
                    'error': 'User with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
            )
            if hasattr(user, 'name'):
                user.name = name
                user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'User registered successfully',
                'user': {
                    'id': user.id,
                    'name': getattr(user, 'name', user.username),
                    'email': user.email,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(views.APIView):
    """User login endpoint"""
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response({
                    'error': 'Email and password required'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.filter(email=email).first()
            if not user or not user.check_password(password):
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_400_BAD_REQUEST)

            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'name': getattr(user, 'name', user.username),
                    'email': user.email,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(views.APIView):
    """User logout endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        return Response({'message': 'Logout successful'})


class ProfileView(views.APIView):
    """User profile endpoint"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'name': getattr(user, 'name', user.username),
            'email': user.email,
        })

    def put(self, request):
        user = request.user
        name = request.data.get('name')
        if name and hasattr(user, 'name'):
            user.name = name
            user.save()
        return Response({
            'message': 'Profile updated',
            'user': {
                'id': user.id,
                'name': getattr(user, 'name', user.username),
                'email': user.email,
            }
        })


class ChangePasswordView(views.APIView):
    """Change password endpoint"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        if not user.check_password(old_password):
            return Response({'error': 'Invalid password'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'})


# Legacy function-based views for backward compatibility
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Legacy signup endpoint"""
    return SignupView().post(request)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Legacy login endpoint"""
    return LoginView().post(request)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Legacy logout endpoint"""
    return Response({'message': 'Logout successful'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    """Legacy profile endpoint"""
    user = request.user
    return Response({
        'id': user.id,
        'name': getattr(user, 'name', user.username),
        'email': user.email,
    })
