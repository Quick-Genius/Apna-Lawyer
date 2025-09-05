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
            google_api_key=os.getenv("GEMINI_API_KEY")
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
        # Split text into manageable chunks
        chunks = self.text_splitter.split_text(text)
        
        # Analyze each chunk
        analyses = []
        for chunk in chunks:
            messages = [
                SystemMessage(content=self.system_prompt),
                HumanMessage(content=f"Analyze this legal text:\n\n{chunk}")
            ]
            
            response = self.llm.invoke(messages)
            analyses.append(response.content)
        
        # Combine analyses (in a real implementation, you'd want to merge these more intelligently)
        # For now, we'll just return the analysis of the first chunk
        return analyses[0] if analyses else None
