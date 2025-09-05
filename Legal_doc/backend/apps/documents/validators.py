import os
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import UploadedFile

def validate_file_size(file):
    # 20MB limit
    max_size = 20 * 1024 * 1024  # 20MB in bytes
    if file.size > max_size:
        raise ValidationError(f'File size cannot exceed 20MB. Current file size: {file.size / (1024*1024):.2f}MB')

def validate_pdf_file(file):
    try:
        # Check file extension
        if not file.name:
            raise ValidationError('File name is required.')
            
        ext = os.path.splitext(file.name)[1].lower()
        if ext != '.pdf':
            raise ValidationError('Only PDF files are allowed.')
        
        # Check MIME type
        if hasattr(file, 'content_type'):
            if not file.content_type:
                raise ValidationError('Could not determine file type.')
            if file.content_type != 'application/pdf':
                raise ValidationError(f'Invalid file type: {file.content_type}. Only PDF files are allowed.')
        
        # Additional PDF validation
        try:
            # Read first few bytes to verify PDF signature
            if isinstance(file, UploadedFile):
                current_pos = file.tell()  # Save current position
                try:
                    file_start = file.read(5)
                    if not file_start.startswith(b'%PDF-'):
                        raise ValidationError('Invalid PDF file. File does not have a valid PDF signature.')
                finally:
                    # Always reset file pointer to original position
                    file.seek(current_pos)
            
        except (IOError, OSError) as e:
            raise ValidationError(f'Error reading PDF file: {str(e)}')
            
    except Exception as e:
        if isinstance(e, ValidationError):
            raise
        raise ValidationError(f'Error validating PDF file: {str(e)}')
