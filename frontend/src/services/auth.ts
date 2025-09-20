/**
 * Authentication service for connecting to Django backend
 * Handles user registration, login, logout, and token management
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export interface User {
  id: string;
  name: string;
  email: string;
  residence?: string;
  is_lawyer: boolean;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
  residence?: string;
  is_lawyer: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface AuthError {
  error?: string;
  message?: string;
  [key: string]: any; // For field-specific errors
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  private saveTokensToStorage(tokens: AuthTokens): void {
    this.accessToken = tokens.access;
    this.refreshToken = tokens.refresh;
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  private clearTokensFromStorage(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('apna-lawyer-user');
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if we have an access token
    if (this.accessToken) {
      defaultHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw data as AuthError;
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error
        throw {
          error: 'Network Error',
          message: 'Unable to connect to the server. Please check your internet connection.',
        } as AuthError;
      }
      throw error;
    }
  }

  /**
   * Register a new user
   */
  async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<AuthResponse>('/api/signup/', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Save tokens and user data
      this.saveTokensToStorage(response.tokens);
      localStorage.setItem('apna-lawyer-user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await this.makeRequest<AuthResponse>('/api/login/', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Save tokens and user data
      this.saveTokensToStorage(response.tokens);
      localStorage.setItem('apna-lawyer-user', JSON.stringify(response.user));

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await this.makeRequest('/api/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: this.refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      this.clearTokensFromStorage();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    try {
      return await this.makeRequest<User>('/api/profile/');
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await this.makeRequest<User>('/api/profile/', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });

      // Update stored user data
      localStorage.setItem('apna-lawyer-user', JSON.stringify(response));

      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Change user password
   */
  async changePassword(passwordData: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }): Promise<{ message: string }> {
    try {
      return await this.makeRequest<{ message: string }>('/api/change-password/', {
        method: 'POST',
        body: JSON.stringify(passwordData),
      });
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await this.makeRequest<{ access: string }>('/api/token/refresh/', {
        method: 'POST',
        body: JSON.stringify({ refresh: this.refreshToken }),
      });

      this.accessToken = response.access;
      localStorage.setItem('access_token', response.access);

      return response.access;
    } catch (error) {
      console.error('Token refresh error:', error);
      // If refresh fails, clear all tokens
      this.clearTokensFromStorage();
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken && !!localStorage.getItem('apna-lawyer-user');
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userData = localStorage.getItem('apna-lawyer-user');
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearTokensFromStorage();
        return null;
      }
    }
    return null;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.accessToken;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  /**
   * Handle API errors and format them for display
   */
  formatError(error: AuthError): string {
    if (error.message) {
      return error.message;
    }

    if (error.error) {
      return error.error;
    }

    // Handle field-specific errors
    const fieldErrors: string[] = [];
    Object.keys(error).forEach(key => {
      if (Array.isArray(error[key])) {
        fieldErrors.push(...error[key]);
      } else if (typeof error[key] === 'string') {
        fieldErrors.push(error[key]);
      }
    });

    if (fieldErrors.length > 0) {
      return fieldErrors.join('. ');
    }

    return 'An unexpected error occurred. Please try again.';
  }
}

// Export singleton instance
export const authService = new AuthService();