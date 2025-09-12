import api from './http';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface AuthResponse {
    user: User;
    token: string;
    message: string;
}

export const authService = {
    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await api.post('/users/login/', {
            username,
            password
        });
        
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
    },

    async register(userData: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
        password: string;
        password_confirm: string;
    }): Promise<AuthResponse> {
        const response = await api.post('/users/register/', userData);
        
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/users/logout/');
        } catch (error) {
            // Even if logout fails on server, clear local storage
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
        }
    },

    getCurrentUser(): User | null {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken(): string | null {
        return localStorage.getItem('authToken');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
};