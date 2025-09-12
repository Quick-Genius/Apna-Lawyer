import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage
from langchain.text_splitter import RecursiveCharacterTextSplitter
import json
import logging
from dotenv import load_dotenv

load_dotenv()

class LegalDocumentAnalyzer:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            temperature=0,
            google_api_key=os.getenv("GEMINI_API_KEY"),
            convert_system_message_to_human=True
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=200
        )
        
        self.system_prompt = """
        You are an expert legal document analyzer. Your task is to:
        1. Identify the type of legal document
        2. Extract key terms and conditions
        3. Highlight potential risks or concerns
        4. Explain complex legal terminology in simple terms
        5. Provide a summary that a non-lawyer can understand

        Format your response as a JSON object with the following structure:
        {
            "document_type": "string",
            "summary": "string",
            "key_terms": ["string"],
            "risks": ["string"],
            "explanations": {"term": "explanation"},
            "recommendations": ["string"]
        }
        """

    def analyze_document(self, text):
        try:
            # Split text into manageable chunks
            chunks = self.text_splitter.split_text(text)
            
            # For now, return a simple mock analysis to avoid API issues
            # TODO: Implement proper AI analysis when API keys are configured
            if not os.getenv("GEMINI_API_KEY"):
                return {
                    "document_type": "Legal Document",
                    "summary": "Document uploaded and processed successfully. AI analysis requires API key configuration.",
                    "key_terms": ["Terms and conditions", "Legal obligations", "Rights and responsibilities"],
                    "risks": ["Please review all terms carefully", "Consider legal consultation for complex matters"],
                    "explanations": {"Legal Document": "A formal document with legal implications"},
                    "recommendations": ["Read the document thoroughly", "Seek legal advice if needed"]
                }
            
            # Analyze each chunk with AI
            analyses = []
            for chunk in chunks:
                messages = [
                    SystemMessage(content=self.system_prompt),
                    HumanMessage(content=f"Analyze this legal text:\n\n{chunk}")
                ]
                
                response = self.llm.invoke(messages)
                try:
                    # Try to parse as JSON
                    analysis = json.loads(response.content)
                    analyses.append(analysis)
                except json.JSONDecodeError:
                    # If not valid JSON, create a structured response
                    analyses.append({
                        "document_type": "Legal Document",
                        "summary": response.content[:500] + "..." if len(response.content) > 500 else response.content,
                        "key_terms": ["AI analysis completed"],
                        "risks": ["Please review the analysis"],
                        "explanations": {"AI Response": "Analysis provided by AI"},
                        "recommendations": ["Review the document carefully"]
                    })
            
            # Combine analyses (in a real implementation, you'd want to merge these more intelligently)
            # For now, we'll just return the analysis of the first chunk
            return analyses[0] if analyses else None
            
        except Exception as e:
            logging.error(f"Error in document analysis: {str(e)}")
            # Return a fallback analysis
            return {
                "document_type": "Legal Document",
                "summary": f"Document processed successfully. Analysis error: {str(e)}",
                "key_terms": ["Document uploaded"],
                "risks": ["Analysis temporarily unavailable"],
                "explanations": {"Error": "AI analysis service temporarily unavailable"},
                "recommendations": ["Document uploaded successfully", "Manual review recommended"]
            }
