from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import UserChat
from .ai_service import get_ai_service
from .ocr_service import ocr_service
from .image_chat_service import image_chat_service
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
            
            # Validate input - require a message (image is optional)
            if not user_message:
                return Response({'error': 'Message is required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            extracted_text = None
            
            # Only process image if user sends a message WITH an image (like ChatGPT/Claude)
            if image_data and user_message:
                try:
                    extracted_text = ocr_service.extract_text_from_base64(image_data)
                    
                    # Enhance the user message with extracted text context
                    if extracted_text.strip():
                        user_message = f"{user_message}\n\n[Image contains text: {extracted_text}]"
                    
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
                response_data['has_image'] = True
            else:
                response_data['has_image'] = False
            
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
    Test endpoint to check OCR service status and Tesseract installation
    """
    try:
        # Check Tesseract installation
        tesseract_available, tesseract_info = ocr_service.check_tesseract_installation()
        
        # Test OCR functionality
        ocr_success, ocr_response = ocr_service.test_ocr()
        
        return Response({
            'tesseract_installed': tesseract_available,
            'tesseract_info': tesseract_info,
            'ocr_service_available': ocr_success,
            'ocr_test_response': ocr_response,
            'status': 'OK' if tesseract_available and ocr_success else 'ERROR'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e),
            'tesseract_installed': False,
            'ocr_service_available': False,
            'status': 'ERROR'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

@api_view(['POST'])
@permission_classes([AllowAny])
def upload_chat_image(request):
    """
    Upload image for chat without running OCR
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
        
        # Get user session ID
        user_session_id = image_chat_service.get_user_session_id(request)
        
        # Store image without OCR
        result = image_chat_service.store_image(image_file, user_session_id)
        
        if result['success']:
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response({'error': result['error']}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def process_chat_with_images(request):
    """
    Process chat message with potential OCR requests
    """
    try:
        message = request.data.get('message', '')
        
        if not message:
            return Response({'error': 'Message is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Get user session ID
        user_session_id = image_chat_service.get_user_session_id(request)
        
        # Process message for OCR requests
        result = image_chat_service.process_chat_message(message, user_session_id)
        
        # If it's an OCR request, return the extracted text
        if result['type'] == 'ocr_result':
            return Response({
                'response': result['message'],
                'extracted_text': result['extracted_text'],
                'image_name': result['image_name'],
                'type': 'ocr_result'
            }, status=status.HTTP_200_OK)
        
        # If it's an image list request
        elif result['type'] == 'image_list':
            return Response({
                'response': result['message'],
                'images': result['images'],
                'type': 'image_list'
            }, status=status.HTTP_200_OK)
        
        # For regular chat messages, use AI service
        else:
            ai_service = get_ai_service()
            bot_response = ai_service.generate_legal_response(user_message=message)
            
            # Save chat if user is authenticated
            chat_id = None
            if request.user.is_authenticated:
                chat = UserChat.objects.create(
                    user=request.user,
                    user_text_input=message,
                    ai_text_output=bot_response
                )
                chat_id = str(chat.id)
            
            return Response({
                'response': bot_response,
                'chat_id': chat_id,
                'type': 'chat'
            }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)