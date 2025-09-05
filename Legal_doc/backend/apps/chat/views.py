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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatSession.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

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
            
            document = document_serializer.save(uploaded_by=request.user)
            
            # Extract text from PDF
            try:
                file.seek(0)  # Reset file pointer
                pdf_reader = PyPDF2.PdfReader(file)
                text = ""
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
                text = text.strip()
                
                if not text:
                    return Response(
                        {"error": "Could not extract text from PDF. The file might be scanned or encrypted."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
            except Exception as e:
                logger.error(f"Error extracting text from PDF: {str(e)}")
                return Response(
                    {"error": "Error processing PDF file"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
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
            
            return Response({
                "message": "Document uploaded and analyzed successfully",
                "document": DocumentSerializer(document).data,
                "analysis_summary": analysis_result.get('summary', 'Document processed successfully') if 'legal_analysis' in document.analysis else 'Document uploaded successfully'
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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatMessage.objects.filter(session__user=self.request.user)

    def perform_create(self, serializer):
        session_id = self.request.data.get('session')
        session = get_object_or_404(ChatSession, id=session_id, user=self.request.user)
        serializer.save(session=session)
