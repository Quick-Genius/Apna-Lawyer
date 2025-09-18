from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
import json

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    try:
        data = request.data
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        residence = data.get('residence', '')
        is_lawyer = data.get('is_lawyer', False)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=email,
            email=email,
            name=name,
            password=password,
            residence=residence,
            is_lawyer=is_lawyer
        )
        
        return Response({
            'message': 'User created successfully',
            'user_id': str(user.id),
            'name': user.name,
            'email': user.email
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    try:
        data = request.data
        email = data.get('email')
        password = data.get('password')
        
        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            return Response({
                'message': 'Login successful',
                'user_id': str(user.id),
                'name': user.name,
                'email': user.email,
                'is_lawyer': user.is_lawyer
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    return Response({
        'user_id': str(user.id),
        'name': user.name,
        'email': user.email,
        'residence': user.residence,
        'is_lawyer': user.is_lawyer,
        'created_at': user.created_at
    }, status=status.HTTP_200_OK)