"""
AI Service for integrating with Gemini API
"""

import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

class GeminiAIService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
        
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    def generate_legal_response(self, user_message, system_prompt=None, image_text=None):
        """
        Generate AI response using Gemini API with system and user prompts
        
        Args:
            user_message (str): The user's question/message
            system_prompt (str): System instructions for the AI
            image_text (str): Extracted text from uploaded image (optional)
        
        Returns:
            str: AI generated response
        """
        
        # Default system prompt for legal assistant
        if not system_prompt:
            system_prompt = """You are a knowledgeable legal assistant specializing in Indian law. 
            Provide helpful, accurate legal information while always reminding users to consult 
            with qualified lawyers for specific legal advice. Be professional, clear, and cite 
            relevant laws or sections when applicable. If you're unsure about something, 
            acknowledge the limitation and suggest consulting a lawyer."""
        
        # Construct the full prompt
        full_prompt = f"{system_prompt}\n\nUser Question: {user_message}"
        
        # Add image text if provided
        if image_text:
            full_prompt += f"\n\nExtracted Text from Image: {image_text}"
        
        try:
            # Prepare request payload
            payload = {
                "contents": [{
                    "parts": [{
                        "text": full_prompt
                    }]
                }],
                "generationConfig": {
                    "temperature": 0.7,
                    "topK": 40,
                    "topP": 0.95,
                    "maxOutputTokens": 1024,
                }
            }
            
            # Make API request
            url = f"{self.base_url}?key={self.api_key}"
            headers = {
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Extract the generated text
                if 'candidates' in result and len(result['candidates']) > 0:
                    candidate = result['candidates'][0]
                    if 'content' in candidate and 'parts' in candidate['content']:
                        return candidate['content']['parts'][0]['text']
                
                return "I apologize, but I couldn't generate a proper response. Please try again."
            
            else:
                print(f"Gemini API Error: {response.status_code} - {response.text}")
                return "I'm experiencing technical difficulties. Please try again later."
                
        except requests.exceptions.Timeout:
            return "The request timed out. Please try again."
        except requests.exceptions.RequestException as e:
            print(f"Request error: {e}")
            return "I'm having trouble connecting to the AI service. Please try again."
        except Exception as e:
            print(f"Unexpected error: {e}")
            return "An unexpected error occurred. Please try again."

    def test_connection(self):
        """Test the Gemini API connection"""
        try:
            test_response = self.generate_legal_response(
                "What is contract law?",
                "You are a legal assistant. Provide a brief explanation."
            )
            return True, test_response
        except Exception as e:
            return False, str(e)


# Fallback AI service for when Gemini is not available
class FallbackAIService:
    def generate_legal_response(self, user_message, system_prompt=None, image_text=None):
        """Fallback response when Gemini is not available"""
        
        # Simple keyword-based responses for common legal topics
        keywords_responses = {
            'contract': 'A contract is a legally binding agreement between parties. Key elements include offer, acceptance, consideration, and legal capacity.',
            'divorce': 'Divorce laws in India are governed by personal laws and the Indian Divorce Act. Grounds include cruelty, desertion, and mutual consent.',
            'property': 'Property law in India covers ownership, transfer, and rights. The Transfer of Property Act, 1882 is a key legislation.',
            'criminal': 'Criminal law deals with offenses against society. The Indian Penal Code, 1860 defines various crimes and punishments.',
            'employment': 'Employment law covers worker rights, contracts, and workplace regulations under various labor laws.',
        }
        
        user_lower = user_message.lower()
        
        for keyword, response in keywords_responses.items():
            if keyword in user_lower:
                return f"Legal Assistant: {response}\n\nNote: This is a basic response. For detailed legal advice, please consult with a qualified lawyer."
        
        # Default response
        base_response = f"Legal Assistant: Thank you for your question about '{user_message}'. "
        
        if image_text:
            base_response += f"I can see you've shared some text: '{image_text[:100]}...' "
        
        base_response += "For accurate legal guidance on this matter, I recommend consulting with a qualified lawyer who can provide advice specific to your situation."
        
        return base_response

    def test_connection(self):
        return True, "Fallback service is always available"


def get_ai_service():
    """Get the appropriate AI service (Gemini or Fallback)"""
    try:
        gemini_service = GeminiAIService()
        success, _ = gemini_service.test_connection()
        if success:
            return gemini_service
    except:
        pass
    
    # Return fallback service if Gemini is not available
    return FallbackAIService()