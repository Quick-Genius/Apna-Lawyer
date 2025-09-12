import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from django.conf import settings
import json
import logging
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class LegalChatService:
    def __init__(self):
        api_key = os.getenv('GEMINI_API_KEY')
        print(f"API Key loaded: {api_key[:10]}..." if api_key else "No API key found")
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0.3,
            google_api_key=api_key,
            convert_system_message_to_human=True
        )
        
        # Enhanced prompt engineering for legal assistance
        self.system_prompt = """
        You are an expert legal AI assistant specializing in contract analysis and legal document interpretation. 
        Your role is to help users understand complex legal language and provide practical guidance.

        CORE PRINCIPLES:
        1. Always provide clear, actionable advice in plain English
        2. Highlight potential risks and red flags in legal documents
        3. Suggest specific negotiation points when appropriate
        4. Explain legal terminology in simple terms
        5. Maintain professional tone while being approachable
        6. Include confidence levels for your analysis

        RESPONSE FORMAT:
        - Start with a brief, direct answer
        - Provide detailed explanation with bullet points
        - Include specific recommendations when relevant
        - End with follow-up questions to guide the conversation

        IMPORTANT GUIDELINES:
        - Never provide specific legal advice that requires a licensed attorney
        - Always recommend consulting with a qualified lawyer for complex matters
        - Focus on education and document interpretation
        - Be transparent about limitations of AI analysis

        When analyzing documents or clauses:
        1. Identify the clause type and purpose
        2. Explain what it means in simple terms
        3. Highlight any unusual or concerning provisions
        4. Suggest questions to ask or points to negotiate
        5. Provide context about industry standards when relevant
        """

    def get_enhanced_prompt(self, user_message, document_context=None, chat_history=None):
        """Create an enhanced prompt with context and conversation history"""
        
        context_prompt = ""
        
        # Add document context if available
        if document_context:
            context_prompt += f"\n\nDOCUMENT CONTEXT:\n{document_context}\n"
        
        # Add recent chat history for context
        if chat_history:
            context_prompt += "\n\nRECENT CONVERSATION:\n"
            for msg in chat_history[-3:]:  # Last 3 messages for context
                role = "User" if msg.role == "user" else "Assistant"
                context_prompt += f"{role}: {msg.content}\n"
        
        # Combine system prompt with context
        enhanced_prompt = self.system_prompt + context_prompt
        
        return enhanced_prompt

    def process_chat_message(self, user_message, document_context=None, chat_history=None):
        """Process a chat message and return AI response with confidence"""
        
        try:
            # Get enhanced prompt with context
            system_prompt = self.get_enhanced_prompt(user_message, document_context, chat_history)
            
            # Create messages for the LLM
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_message)
            ]
            
            # Get response from LLM
            response = self.llm.invoke(messages)
            
            # Calculate confidence based on response characteristics
            confidence = self._calculate_confidence(response.content, user_message)
            
            return {
                'content': response.content,
                'confidence': confidence,
                'success': True
            }
            
        except Exception as e:
            logger.error(f"Error processing chat message: {str(e)}")
            return {
                'content': "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
                'confidence': 0,
                'success': False,
                'error': str(e)
            }

    def _calculate_confidence(self, response_content, user_message):
        """Calculate confidence score based on response characteristics"""
        
        confidence = 85  # Base confidence
        
        # Increase confidence for longer, detailed responses
        if len(response_content) > 200:
            confidence += 5
        
        # Increase confidence if response contains specific legal terms
        legal_terms = ['clause', 'contract', 'agreement', 'liability', 'terms', 'provision']
        if any(term in response_content.lower() for term in legal_terms):
            confidence += 5
        
        # Increase confidence if response contains structured advice
        if any(marker in response_content for marker in ['1.', '2.', '•', '-']):
            confidence += 3
        
        # Cap at 98% to show AI uncertainty
        return min(confidence, 98)

    def analyze_document_for_chat(self, document_text, specific_question=None):
        """Analyze document content for chat context"""
        
        analysis_prompt = """
        Analyze this legal document and provide a structured summary that can be used as context for chat conversations.
        Focus on:
        1. Document type and purpose
        2. Key parties involved
        3. Important terms and conditions
        4. Potential risks or concerns
        5. Notable clauses that users might ask about
        
        Keep the analysis concise but comprehensive.
        """
        
        try:
            messages = [
                SystemMessage(content=analysis_prompt),
                HumanMessage(content=f"Document text:\n\n{document_text}")
            ]
            
            response = self.llm.invoke(messages)
            return response.content
            
        except Exception as e:
            logger.error(f"Error analyzing document: {str(e)}")
            return None
