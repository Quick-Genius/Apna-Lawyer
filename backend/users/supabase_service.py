"""
Supabase service for user data synchronization.
Handles creating and updating user data in Supabase database.
"""

import os
from supabase import create_client, Client
from django.conf import settings
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class SupabaseUserService:
    """Service class for managing user data in Supabase."""
    
    def __init__(self):
        """Initialize Supabase client."""
        self.supabase_url = os.getenv('SUPABASE_URL')
        self.supabase_key = os.getenv('SUPABASE_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL and Key must be set in environment variables")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)

    def create_user_in_supabase(self, user_data: Dict) -> Optional[Dict]:
        """
        Create a new user record in Supabase users table.
        
        Args:
            user_data (Dict): User data containing id, name, email, etc.
            
        Returns:
            Optional[Dict]: Created user data or None if failed
        """
        try:
            # Prepare user data for Supabase
            supabase_user_data = {
                'id': str(user_data['id']),
                'name': user_data['name'],
                'email': user_data['email'],
                'residence': user_data.get('residence', ''),
                'is_lawyer': user_data.get('is_lawyer', False),
                'created_at': user_data['created_at'].isoformat() if user_data.get('created_at') else None
            }
            
            # Insert user into Supabase
            result = self.supabase.table('users').insert(supabase_user_data).execute()
            
            if result.data:
                logger.info(f"User {user_data['email']} created successfully in Supabase")
                return result.data[0]
            else:
                logger.error(f"Failed to create user in Supabase: {result}")
                return None
                
        except Exception as e:
            logger.error(f"Error creating user in Supabase: {str(e)}")
            return None

    def update_user_in_supabase(self, user_id: str, user_data: Dict) -> Optional[Dict]:
        """
        Update user record in Supabase users table.
        
        Args:
            user_id (str): User ID to update
            user_data (Dict): Updated user data
            
        Returns:
            Optional[Dict]: Updated user data or None if failed
        """
        try:
            # Prepare update data (exclude fields that shouldn't be updated)
            update_data = {}
            updatable_fields = ['name', 'residence', 'is_lawyer']
            
            for field in updatable_fields:
                if field in user_data:
                    update_data[field] = user_data[field]
            
            if not update_data:
                logger.warning("No updatable fields provided")
                return None
            
            # Update user in Supabase
            result = self.supabase.table('users').update(update_data).eq('id', user_id).execute()
            
            if result.data:
                logger.info(f"User {user_id} updated successfully in Supabase")
                return result.data[0]
            else:
                logger.error(f"Failed to update user in Supabase: {result}")
                return None
                
        except Exception as e:
            logger.error(f"Error updating user in Supabase: {str(e)}")
            return None

    def get_user_from_supabase(self, user_id: str) -> Optional[Dict]:
        """
        Retrieve user data from Supabase.
        
        Args:
            user_id (str): User ID to retrieve
            
        Returns:
            Optional[Dict]: User data or None if not found
        """
        try:
            result = self.supabase.table('users').select('*').eq('id', user_id).execute()
            
            if result.data:
                return result.data[0]
            else:
                logger.warning(f"User {user_id} not found in Supabase")
                return None
                
        except Exception as e:
            logger.error(f"Error retrieving user from Supabase: {str(e)}")
            return None

    def delete_user_from_supabase(self, user_id: str) -> bool:
        """
        Delete user record from Supabase.
        
        Args:
            user_id (str): User ID to delete
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            result = self.supabase.table('users').delete().eq('id', user_id).execute()
            
            if result.data:
                logger.info(f"User {user_id} deleted successfully from Supabase")
                return True
            else:
                logger.error(f"Failed to delete user from Supabase: {result}")
                return False
                
        except Exception as e:
            logger.error(f"Error deleting user from Supabase: {str(e)}")
            return False

    def sync_user_to_supabase(self, django_user) -> Optional[Dict]:
        """
        Synchronize Django user to Supabase.
        Creates if doesn't exist, updates if exists.
        
        Args:
            django_user: Django User model instance
            
        Returns:
            Optional[Dict]: Supabase user data or None if failed
        """
        user_data = {
            'id': django_user.id,
            'name': django_user.name,
            'email': django_user.email,
            'residence': django_user.residence or '',
            'is_lawyer': django_user.is_lawyer,
            'created_at': django_user.created_at
        }
        
        # Check if user exists in Supabase
        existing_user = self.get_user_from_supabase(str(django_user.id))
        
        if existing_user:
            # Update existing user
            return self.update_user_in_supabase(str(django_user.id), user_data)
        else:
            # Create new user
            return self.create_user_in_supabase(user_data)


# Global instance
supabase_user_service = SupabaseUserService()