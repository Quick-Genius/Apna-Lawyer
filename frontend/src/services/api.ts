const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  confidence?: number;
}

export interface ChatResponse {
  response: string;
  chat_id: string | null;
  timestamp: string | null;
  extracted_text?: string;
  is_anonymous?: boolean;
}

export interface ChatHistoryResponse {
  chats: Array<{
    id: string;
    user_message: string;
    ai_response: string;
    timestamp: string;
  }>;
  total_count: number;
}

class ApiService {
  private isUserSignedIn(): boolean {
    const userData = localStorage.getItem('apna-lawyer-user');
    return !!userData;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('apna-lawyer-user');
    
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userData && { 'X-User-Data': userData })
    };
  }

  private getFileUploadHeaders() {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('apna-lawyer-user');
    
    return {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...(userData && { 'X-User-Data': userData })
    };
  }

  async sendMessage(message: string, image?: string, systemPrompt?: string): Promise<ChatResponse> {
    // Allow both authenticated and anonymous users
    const headers = this.isUserSignedIn() ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const response = await fetch(`${API_BASE_URL}/chats/api/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        message,
        image,
        system_prompt: systemPrompt
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return response.json();
  }

  async getChatHistory(): Promise<ChatHistoryResponse> {
    if (!this.isUserSignedIn()) {
      throw new Error('Please sign in to view chat history');
    }

    const response = await fetch(`${API_BASE_URL}/chats/chat/history/`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch chat history');
    }

    return response.json();
  }

  async extractTextFromImage(image: string): Promise<{ extracted_text: string; success: boolean }> {
    // Allow both authenticated and anonymous users
    const headers = this.isUserSignedIn() ? this.getAuthHeaders() : { 'Content-Type': 'application/json' };

    const response = await fetch(`${API_BASE_URL}/chats/extract-text/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ image })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to extract text from image');
    }

    return response.json();
  }

  async testAiService(): Promise<{ ai_service_available: boolean; test_response: string; service_type: string }> {
    const response = await fetch(`${API_BASE_URL}/chats/test-ai/`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to test AI service');
    }

    return response.json();
  }

  async extractTextFromDocument(file: File): Promise<{ extracted_text: string; success: boolean }> {
    const formData = new FormData();
    formData.append('file', file);

    // Allow both authenticated and anonymous users
    const headers = this.isUserSignedIn() ? this.getFileUploadHeaders() : {};

    const response = await fetch(`${API_BASE_URL}/api/extract-doc/`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to extract text from document');
    }

    return response.json();
  }

  async ocrImage(file: File): Promise<{ extracted_text: string; success: boolean }> {
    const formData = new FormData();
    formData.append('image', file);

    // Allow both authenticated and anonymous users
    const headers = this.isUserSignedIn() ? this.getFileUploadHeaders() : {};

    const response = await fetch(`${API_BASE_URL}/api/ocr-image/`, {
      method: 'POST',
      headers,
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to extract text from image');
    }

    return response.json();
  }

  // Helper function to convert file to base64
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Public method to check if user is signed in
  checkAuthStatus(): boolean {
    return this.isUserSignedIn();
  }
}

export const apiService = new ApiService();