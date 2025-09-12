import api from './http';

export interface ChatMessage {
    id: number;
    type: 'user' | 'ai';
    message: string;
    timestamp: string;
    confidence?: number;
}

export interface ChatSession {
    id: number;
    title: string;
    created_at: string;
    document?: any;
}

export const chatService = {
    async createSession(title?: string): Promise<ChatSession> {
        const response = await api.post(`/chat/sessions/`, {
            title: title || 'New Chat Session'
        });
        return response.data;
    },

    async uploadDocument(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        // Upload document without analyzing it
        const response = await api.post(`/documents/upload_only/`, formData);
        // Ensure caller receives the document object with id
        return response.data?.document ?? response.data;
    },

    async uploadAndAnalyzeDocument(file: File) {
        const formData = new FormData();
        formData.append('file', file);
        // Calls custom action that uploads and analyzes in one step
        const response = await api.post(`/documents/upload_and_analyze/`, formData);
        // Ensure caller receives the document object with id
        return response.data?.document ?? response.data;
    },

    async sendMessage(sessionId: number, message: string): Promise<ChatMessage> {
        const response = await api.post(`/chat/sessions/${sessionId}/send_message/`, {
            message
        });
        const ai = response.data?.ai_response;
        return {
            id: ai?.id ?? Date.now(),
            type: 'ai',
            message: ai?.content ?? '',
            timestamp: ai?.timestamp ?? new Date().toISOString(),
            confidence: ai?.confidence,
        };
    },

    async uploadDocumentToSession(sessionId: number, file: File) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        
        const response = await api.post(`/chat/sessions/${sessionId}/upload_document/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async getSessions(): Promise<ChatSession[]> {
        const response = await api.get(`/chat/sessions/`);
        return response.data;
    },

    async getSessionMessages(sessionId: number): Promise<ChatMessage[]> {
        const response = await api.get(`/chat/sessions/${sessionId}/messages/`);
        return response.data;
    }
};