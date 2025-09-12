from rest_framework import serializers
from .models import Document
import os

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'file', 'document_type', 'description', 
                 'uploaded_by', 'uploaded_at', 'analysis', 'is_processed']
        read_only_fields = ['uploaded_by', 'uploaded_at', 'analysis', 'is_processed']

    def validate(self, attrs):
        # If title is not provided, use the filename without extension
        if 'file' in attrs and not attrs.get('title'):
            filename = attrs['file'].name
            attrs['title'] = os.path.splitext(filename)[0]
        
        # If document_type is not provided, set it to 'other'
        if not attrs.get('document_type'):
            attrs['document_type'] = 'other'
        
        return attrs

    def to_internal_value(self, data):
        # Ensure title and document_type are set before validation
        if 'file' in data and not data.get('title'):
            filename = data['file'].name
            data = data.copy()  # Make a mutable copy
            data['title'] = os.path.splitext(filename)[0]
        
        if not data.get('document_type'):
            data = data.copy() if not hasattr(data, 'copy') else data.copy()
            data['document_type'] = 'other'
        
        return super().to_internal_value(data)
