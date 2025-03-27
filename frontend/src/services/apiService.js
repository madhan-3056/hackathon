import axios from 'axios';
import apiConfig from '../config/apiConfig';

// Create axios instance with default config
const api = axios.create({
    baseURL: apiConfig.baseURL,
    headers: apiConfig.headers,
    timeout: apiConfig.timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// API service for chat
export const chatService = {
    // Get chat messages
    getMessages: async () => {
        try {
            const response = await api.get('/chat/messages');
            return response.data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    // Send a message
    sendMessage: async (content, type = 'general') => {
        try {
            const response = await api.post('/chat/messages', { content, type });
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Clear chat history
    clearChat: async () => {
        try {
            const response = await api.post('/chat/clear');
            return response.data;
        } catch (error) {
            console.error('Error clearing chat:', error);
            throw error;
        }
    }
};

// API service for AI
export const aiService = {
    // Explain a legal term
    explainTerm: async (term) => {
        try {
            const response = await api.post('/ai/explain', { term });
            return response.data;
        } catch (error) {
            console.error('Error explaining term:', error);
            throw error;
        }
    },

    // Analyze a document
    analyzeDocument: async (content) => {
        try {
            const response = await api.post('/ai/analyze', { content });
            return response.data;
        } catch (error) {
            console.error('Error analyzing document:', error);
            throw error;
        }
    }
};

// API service for documents
export const documentService = {
    // Get all documents
    getDocuments: async () => {
        try {
            const response = await api.get('/documents');
            return response.data;
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    },

    // Get a single document
    getDocument: async (id) => {
        try {
            const response = await api.get(`/documents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching document:', error);
            throw error;
        }
    },

    // Create a document
    createDocument: async (documentData) => {
        try {
            const response = await api.post('/documents', documentData);
            return response.data;
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    },

    // Update a document
    updateDocument: async (id, documentData) => {
        try {
            const response = await api.put(`/documents/${id}`, documentData);
            return response.data;
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    },

    // Delete a document
    deleteDocument: async (id) => {
        try {
            const response = await api.delete(`/documents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }
};

// Default export
export default {
    chat: chatService,
    ai: aiService,
    documents: documentService
};