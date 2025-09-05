from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from .models import Document
from .serializers import DocumentSerializer
from .services.document_analyzer import LegalDocumentAnalyzer
import pytesseract
from PIL import Image
import PyPDF2
import io
import json
import logging

logger = logging.getLogger(__name__)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        try:
            serializer.save(uploaded_by=self.request.user)
        except ValidationError as e:
            raise ValidationError(detail=str(e))
        except Exception as e:
            logger.error(f"Error creating document: {str(e)}")
            raise ValidationError(detail="Error uploading document. Please try again.")

    def extract_text_from_pdf(self, file):
        try:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise ValidationError("Error processing PDF file. Please ensure it's a valid PDF document.")

    def extract_text_from_image(self, file):
        image = Image.open(file)
        text = pytesseract.image_to_string(image)
        return text

    def get_queryset(self):
        return Document.objects.filter(uploaded_by=self.request.user)

    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        try:
            document = self.get_object()
            
            if not document.file:
                raise ValidationError("No file attached to document")
                
            try:
                # Reset file pointer to beginning
                document.file.seek(0)
            except Exception as e:
                logger.error(f"Error accessing file: {str(e)}")
                raise ValidationError("Could not access the document file")
            
            # Extract text based on file type
            if document.file.name.lower().endswith('.pdf'):
                try:
                    text = self.extract_text_from_pdf(document.file)
                except Exception as e:
                    logger.error(f"PDF extraction error: {str(e)}")
                    raise ValidationError("Could not extract text from PDF")
            elif document.file.name.lower().endswith(('.png', '.jpg', '.jpeg')):
                try:
                    text = self.extract_text_from_image(document.file)
                except Exception as e:
                    logger.error(f"Image extraction error: {str(e)}")
                    raise ValidationError("Could not extract text from image")
            else:
                return Response(
                    {"error": "Unsupported file format"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Use LegalDocumentAnalyzer for comprehensive analysis
            analyzer = LegalDocumentAnalyzer()
            analysis_result = analyzer.analyze_document(text)
            
            # Store both extracted text and analysis
            document.analysis = {
                "extracted_text": text,
                "legal_analysis": analysis_result
            }
            document.is_processed = True
            document.save()

            return Response({
                "message": "Document analyzed successfully",
                "analysis": document.analysis,
                "document_id": document.id
            }, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error analyzing document {pk}: {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['post'])
    def upload_and_analyze(self, request):
        """Upload a document and automatically analyze it"""
        try:
            # Add debug logging
            logger.debug(f"Received upload request with data: {request.data}")
            
            serializer = self.get_serializer(data=request.data)
            
            if not serializer.is_valid():
                logger.error(f"Serializer validation failed: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                document = serializer.save(uploaded_by=request.user)
            except Exception as e:
                logger.error(f"Error saving document: {str(e)}")
                return Response(
                    {"error": "Failed to save document", "detail": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Automatically trigger analysis
            try:
                analyze_response = self.analyze(request, pk=document.id)
                
                if analyze_response.status_code == 200:
                    return Response({
                        "document": DocumentSerializer(document).data,
                        "analysis": document.analysis
                    }, status=status.HTTP_201_CREATED)
                else:
                    logger.error(f"Analysis failed with status {analyze_response.status_code}")
                    return analyze_response
                    
            except Exception as e:
                logger.error(f"Error during document analysis: {str(e)}")
                return Response(
                    {"error": "Failed to analyze document", "detail": str(e)},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
                
        except Exception as e:
            logger.error(f"Unexpected error in upload_and_analyze: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred", "detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
