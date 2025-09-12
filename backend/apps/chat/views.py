from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import ChatSession, ChatMessage
from .services import LegalChatService
from .serializers import ChatSessionSerializer, ChatMessageSerializer, SendMessageSerializer
from apps.documents.models import Document
from apps.documents.serializers import DocumentSerializer
from apps.documents.services.document_analyzer import LegalDocumentAnalyzer
from django.shortcuts import get_object_or_404
import PyPDF2
import logging

logger = logging.getLogger(__name__)

class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    permission_classes = []  # Allow unauthenticated access

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return ChatSession.objects.filter(user=self.request.user)
        else:
            # For anonymous users, return all sessions (or implement session-based filtering)
            return ChatSession.objects.all()

    def perform_create(self, serializer):
        # Use authenticated user or create/get anonymous user
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            from django.contrib.auth.models import User
            user, created = User.objects.get_or_create(
                username='anonymous',
                defaults={'email': 'anonymous@example.com'}
            )
        serializer.save(user=user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message and get AI response with prompt engineering"""
        session = self.get_object()
        serializer = SendMessageSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        user_message = serializer.validated_data['message']
        
        try:
            # Save user message
            user_msg = ChatMessage.objects.create(
                session=session,
                content=user_message,
                role='user'
            )
            
            # Get document context if session has a document
            document_context = None
            if session.document and session.document.analysis:
                document_context = session.document.analysis.get('extracted_text', '')
            
            # Get recent chat history for context
            recent_messages = list(session.messages.order_by('timestamp')[:6])
            
            # Initialize chat service and process message
            chat_service = LegalChatService()
            ai_response = chat_service.process_chat_message(
                user_message=user_message,
                document_context=document_context,
                chat_history=recent_messages
            )
            
            if ai_response['success']:
                # Save AI response
                ai_msg = ChatMessage.objects.create(
                    session=session,
                    content=ai_response['content'],
                    role='assistant',
                    confidence=ai_response['confidence']
                )
                
                return Response({
                    'user_message': ChatMessageSerializer(user_msg).data,
                    'ai_response': ChatMessageSerializer(ai_msg).data,
                    'session_id': session.id
                })
            else:
                error_message = ai_response.get('error', 'Failed to generate AI response')
                logger.error(f"AI service failed: {error_message}")
                return Response(
                    {"error": f"AI service error: {error_message}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Error in send_message: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """Upload a PDF document to a chat session"""
        session = self.get_object()
        
        if 'file' not in request.FILES:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['file']
        
        # Validate file type
        if not file.name.lower().endswith('.pdf'):
            return Response(
                {"error": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create document
            document_data = {
                'title': request.data.get('title', file.name),
                'file': file,
                'document_type': 'contract'  # Default type
            }
            
            document_serializer = DocumentSerializer(data=document_data)
            if not document_serializer.is_valid():
                return Response(
                    {"error": "Invalid document data", "details": document_serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Handle anonymous users
            user = request.user if request.user.is_authenticated else None
            if not user:
                from django.contrib.auth.models import User
                user, created = User.objects.get_or_create(
                    username='anonymous',
                    defaults={'email': 'anonymous@example.com'}
                )
            
            document = document_serializer.save(uploaded_by=user)
            
            # Extract text from PDF
            try:
                file.seek(0)  # Reset file pointer
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
                text = text.strip()
                
                # If no text extracted, still allow upload but with a placeholder
                if not text:
                    text = f"PDF document '{file.name}' uploaded successfully. Text extraction was not possible - this may be a scanned document or contain images. You can still ask questions about this document type."
                    logger.warning(f"No text extracted from PDF: {file.name}")
                
            except Exception as e:
                logger.error(f"Error extracting text from PDF: {str(e)}")
                # Don't fail the upload, just use a placeholder text
                text = f"PDF document '{file.name}' uploaded successfully. Text extraction encountered an error: {str(e)}. You can still ask general questions about this document type."
            
            # Analyze document
            try:
                analyzer = LegalDocumentAnalyzer()
                analysis_result = analyzer.analyze_document(text)
                
                # Store analysis
                document.analysis = {
                    "extracted_text": text,
                    "legal_analysis": analysis_result
                }
                document.is_processed = True
                document.save()
                
            except Exception as e:
                logger.error(f"Error analyzing document: {str(e)}")
                # Continue even if analysis fails
                document.analysis = {
                    "extracted_text": text,
                    "legal_analysis": {"error": "Analysis failed", "details": str(e)}
                }
                document.save()
            
            # Associate document with chat session
            session.document = document
            session.save()
            
            # Create a system message about the document upload
            ChatMessage.objects.create(
                session=session,
                content=f"Document '{document.title}' has been uploaded and analyzed. You can now ask questions about this document.",
                role='system'
            )
            
            # Get analysis summary safely
            analysis_summary = 'Document uploaded successfully'
            if document.analysis and 'legal_analysis' in document.analysis:
                legal_analysis = document.analysis['legal_analysis']
                if isinstance(legal_analysis, dict):
                    analysis_summary = legal_analysis.get('summary', 'Document processed successfully')
                else:
                    analysis_summary = 'Document processed successfully'
            
            return Response({
                "message": "Document uploaded and analyzed successfully",
                "document": DocumentSerializer(document).data,
                "analysis_summary": analysis_summary
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Error uploading document to chat session {pk}: {str(e)}")
            return Response(
                {"error": "Failed to upload document", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatMessageViewSet(viewsets.ModelViewSet):
    queryset = ChatMessage.objects.all()
    serializer_class = ChatMessageSerializer
    permission_classes = []  # Allow unauthenticated access

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return ChatMessage.objects.filter(session__user=self.request.user)
        else:
            # For anonymous users, return all messages (or implement session-based filtering)
            return ChatMessage.objects.all()

    def perform_create(self, serializer):
        session_id = self.request.data.get('session')
        if self.request.user.is_authenticated:
            session = get_object_or_404(ChatSession, id=session_id, user=self.request.user)
        else:
            session = get_object_or_404(ChatSession, id=session_id)
        serializer.save(session=session)
