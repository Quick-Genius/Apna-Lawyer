from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import UserChat
from .ai_service import get_ai_service
from .ocr_service import ocr_service
import requests
import json

def chatbot(request):
    return render(request, 'chatbot.html')

class ChatbotAPI(APIView):
    permission_classes = [AllowAny]  # Allow both authenticated and anonymous users
    
    def post(self, request):
        try:
            user_message = request.data.get('message', '')
            image_data = request.data.get('image')  # Base64 encoded image
            system_prompt = request.data.get('system_prompt')  # Optional custom system prompt
            
            # Validate input
            if not user_message and not image_data:
                return Response({'error': 'Message or image is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            extracted_text = None
            
            # Process image if provided
            if image_data:
                try:
                    extracted_text = ocr_service.extract_text_from_base64(image_data)
                    
                    # If no user message, use extracted text as the message
                    if not user_message:
                        user_message = f"Please analyze this document: {extracted_text}"
                    
                except Exception as e:
                    return Response({'error': f'Image processing failed: {str(e)}'}, 
                                  status=status.HTTP_400_BAD_REQUEST)
            
            # Get AI service and generate response
            ai_service = get_ai_service()
            bot_response = ai_service.generate_legal_response(
                user_message=user_message,
                system_prompt=system_prompt,
                image_text=extracted_text
            )
            
            # Only save chat to database if user is authenticated
            chat_id = None
            if request.user.is_authenticated:
                chat = UserChat.objects.create(
                    user=request.user,
                    user_text_input=user_message,
                    ai_text_output=bot_response
                )
                chat_id = str(chat.id)
            
            response_data = {
                'response': bot_response,
                'chat_id': chat_id,  # Will be None for anonymous users
                'timestamp': None if not request.user.is_authenticated else chat.created_at,
                'is_anonymous': not request.user.is_authenticated
            }
            
            # Include extracted text in response if image was processed
            if extracted_text:
                response_data['extracted_text'] = extracted_text
            
            return Response(response_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chat_history(request):
    try:
        chats = UserChat.objects.filter(user=request.user).order_by('-created_at')
        chat_data = []
        
        for chat in chats:
            chat_data.append({
                'id': str(chat.id),
                'user_message': chat.user_text_input,
                'ai_response': chat.ai_text_output,
                'timestamp': chat.created_at
            })
        
        return Response({
            'chats': chat_data,
            'total_count': len(chat_data)
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anonymous access
def extract_text_from_image(request):
    """
    Endpoint to extract text from uploaded image
    """
    try:
        image_data = request.data.get('image')
        
        if not image_data:
            return Response({'error': 'Image data is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Extract text from image
        extracted_text = ocr_service.extract_text_from_base64(image_data)
        
        return Response({
            'extracted_text': extracted_text,
            'success': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def test_ai_service(request):
    """
    Test endpoint to check AI service status
    """
    try:
        ai_service = get_ai_service()
        success, response = ai_service.test_connection()
        
        return Response({
            'ai_service_available': success,
            'test_response': response,
            'service_type': type(ai_service).__name__
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def test_ocr_service(request):
    """
    Test endpoint to check OCR service status
    """
    try:
        success, response = ocr_service.test_ocr()
        
        return Response({
            'ocr_service_available': success,
            'test_response': response
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anonymous access
def ocr_image_api(request):
    """
    API endpoint to extract text from uploaded image files
    """
    try:
        if 'image' not in request.FILES:
            return Response({'error': 'Image file is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        image_file = request.FILES['image']
        
        # Validate file type
        if not image_file.content_type.startswith('image/'):
            return Response({'error': 'File must be an image'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Convert to base64 for OCR processing
        import base64
        image_data = base64.b64encode(image_file.read()).decode('utf-8')
        
        # Extract text from image
        extracted_text = ocr_service.extract_text_from_base64(image_data)
        
        return Response({
            'extracted_text': extracted_text,
            'success': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anonymous access
def extract_document_api(request):
    """
    API endpoint to extract text from uploaded PDF/DOC files
    """
    try:
        if 'file' not in request.FILES:
            return Response({'error': 'File is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_file = request.FILES['file']
        
        # Validate file type
        allowed_types = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        
        if uploaded_file.content_type not in allowed_types:
            return Response({'error': 'File must be PDF, DOC, or DOCX'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Extract text based on file type
        extracted_text = ""
        
        if uploaded_file.content_type == 'application/pdf':
            # Handle PDF files
            try:
                import PyPDF2
                import io
                
                pdf_file = io.BytesIO(uploaded_file.read())
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                
                for page in pdf_reader.pages:
                    extracted_text += page.extract_text() + "\n"
                    
            except ImportError:
                return Response({'error': 'PDF processing not available. PyPDF2 not installed.'}, 
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        elif uploaded_file.content_type in ['application/msword', 
                                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
            # Handle DOC/DOCX files
            try:
                import docx
                import io
                
                doc_file = io.BytesIO(uploaded_file.read())
                doc = docx.Document(doc_file)
                
                for paragraph in doc.paragraphs:
                    extracted_text += paragraph.text + "\n"
                    
            except ImportError:
                return Response({'error': 'Document processing not available. python-docx not installed.'}, 
                              status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        if not extracted_text.strip():
            return Response({'error': 'No text could be extracted from the document'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'extracted_text': extracted_text.strip(),
            'success': True
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)