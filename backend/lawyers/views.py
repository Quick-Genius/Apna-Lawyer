from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Lawyer
from .serializers import LawyerSerializer
from db.supabase_client import supabase
import requests
import os
from dotenv import load_dotenv

load_dotenv()

class LawyerViewSet(viewsets.ViewSet):
    """
    ViewSet that works directly with Supabase instead of Django ORM
    """
    
    def list(self, request):
        """List all lawyers from Supabase"""
        try:
            response = supabase.table('lawyers').select("*").execute()
            return Response(response.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request):
        """Create a new lawyer in Supabase"""
        try:
            data = request.data
            response = supabase.table('lawyers').insert(data).execute()
            if response.data:
                return Response(response.data[0], status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Failed to create lawyer'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """Get a specific lawyer from Supabase"""
        try:
            response = supabase.table('lawyers').select("*").eq('id', pk).execute()
            if response.data:
                return Response(response.data[0])
            else:
                return Response({'error': 'Lawyer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def update(self, request, pk=None):
        """Update a lawyer in Supabase"""
        try:
            data = request.data
            response = supabase.table('lawyers').update(data).eq('id', pk).execute()
            if response.data:
                return Response(response.data[0])
            else:
                return Response({'error': 'Lawyer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def partial_update(self, request, pk=None):
        """Partially update a lawyer in Supabase"""
        try:
            data = request.data
            response = supabase.table('lawyers').update(data).eq('id', pk).execute()
            if response.data:
                return Response(response.data[0])
            else:
                return Response({'error': 'Lawyer not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, pk=None):
        """Delete a lawyer from Supabase"""
        try:
            response = supabase.table('lawyers').delete().eq('id', pk).execute()
            return Response({'message': 'Lawyer deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def lawyer_list(request):
    """Get lawyers directly from Supabase"""
    try:
        response = supabase.table('lawyers').select("*").execute()
        return Response(response.data)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def create_lawyer(request):
    """Create lawyer directly in Supabase"""
    try:
        data = request.data
        response = supabase.table('lawyers').insert(data).execute()
        if response.data:
            return Response(response.data[0], status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Failed to create lawyer'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
def sync_lawyer_to_supabase(request):
    """Sync lawyer data to Supabase"""
    try:
        # Convert UUID to string for Supabase
        data = request.data.copy()
        if 'id' in data:
            data['id'] = str(data['id'])
        
        response = supabase.table('lawyers').insert(data).execute()
        return Response({
            'message': 'Lawyer synced to Supabase successfully',
            'supabase_data': response.data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=400)