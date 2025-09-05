const API_BASE_URL = 'http://127.0.0.1:8000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

interface AuthResponse {
  user: any;
  token: string;
  message: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.error || `HTTP ${response.status}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Authentication
  async login(username: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/users/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }

    return response;
  }

  async register(userData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    password_confirm: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/users/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data?.token) {
      this.token = response.data.token;
      localStorage.setItem('authToken', this.token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<any>> {
    const response = await this.request('/users/logout/', {
      method: 'POST',
    });

    this.token = null;
    localStorage.removeItem('authToken');
    return response;
  }

  // Chat functionality
  async createChatSession(documentId?: number): Promise<ApiResponse<any>> {
    return this.request('/chat/sessions/', {
      method: 'POST',
      body: JSON.stringify({ 
        document: documentId,
        title: 'New Chat Session'
      }),
    });
  }

  async sendMessage(sessionId: number, message: string): Promise<ApiResponse<any>> {
    return this.request(`/chat/sessions/${sessionId}/send_message/`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  async getChatSessions(): Promise<ApiResponse<any>> {
    return this.request('/chat/sessions/');
  }

  async getChatSession(sessionId: number): Promise<ApiResponse<any>> {
    return this.request(`/chat/sessions/${sessionId}/`);
  }

  async uploadDocumentToChat(sessionId: number, formData: FormData): Promise<ApiResponse<any>> {
    const url = `${API_BASE_URL}/chat/sessions/${sessionId}/upload_document/`;
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error during upload' };
    }
  }

  async uploadDocumentToChat(sessionId: number, formData: FormData): Promise<ApiResponse<any>> {
    const url = `${API_BASE_URL}/chat/sessions/${sessionId}/upload_document/`;
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error during upload' };
    }
  }

  // Document functionality
  async uploadDocument(formData: FormData): Promise<ApiResponse<any>> {
    const url = `${API_BASE_URL}/documents/upload_and_analyze/`;
    
    const headers: HeadersInit = {};
    if (this.token) {
      headers['Authorization'] = `Token ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { error: data.error || 'Upload failed' };
      }

      return { data };
    } catch (error) {
      return { error: 'Network error during upload' };
    }
  }

  async getDocuments(): Promise<ApiResponse<any>> {
    return this.request('/documents/');
  }

  async analyzeDocument(documentId: number): Promise<ApiResponse<any>> {
    return this.request(`/documents/${documentId}/analyze/`, {
      method: 'POST',
    });
  }

  // Lawyer functionality
  async getLawyers(filters?: {
    specialization?: string;
    location?: string;
    pricing_type?: string;
    search?: string;
  }): Promise<ApiResponse<any>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    
    const queryString = params.toString();
    const endpoint = `/lawyers/list/${queryString ? `?${queryString}` : ''}`;
    
    return this.request(endpoint);
  }

  async getLawyerReviews(lawyerId: number): Promise<ApiResponse<any>> {
    return this.request(`/lawyers/list/${lawyerId}/reviews/`);
  }

  // User profile
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.request('/users/profile/');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export default new ApiService();
