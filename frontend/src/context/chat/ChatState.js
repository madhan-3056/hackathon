import React, { useReducer } from 'react';
import axios from 'axios';
import ChatContext from './chatContext';
import chatReducer from './chatReducer';
import {
    GET_MESSAGES,
    SEND_MESSAGE,
    MESSAGE_ERROR,
    CLEAR_CHAT,
    SET_LOADING
} from '../types';

const ChatState = (props) => {
    const initialState = {
        messages: [],
        error: null,
        loading: false
    };

    const [state, dispatch] = useReducer(chatReducer, initialState);

    // Get messages
    const getMessages = async () => {
        try {
            setLoading();

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.get('/api/v1/chat/messages', config);

            dispatch({
                type: GET_MESSAGES,
                payload: res.data.data
            });
        } catch (err) {
            dispatch({
                type: MESSAGE_ERROR,
                payload: err.response?.data?.error || 'Error fetching messages'
            });

            // Add welcome message if no messages exist
            dispatch({
                type: GET_MESSAGES,
                payload: [{
                    id: 'welcome',
                    content: 'Welcome to the Virtual Lawyer chat assistant. How can I help you today?',
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                }]
            });
        }
    };

    // Send message
    const sendMessage = async (content, type = 'general') => {
        try {
            setLoading();

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.post(
                '/api/v1/chat/messages',
                { content, type },
                config
            );

            dispatch({
                type: SEND_MESSAGE,
                payload: {
                    message: res.data.data.message,
                    aiResponse: res.data.data.aiResponse
                }
            });

            return true;
        } catch (err) {
            dispatch({
                type: MESSAGE_ERROR,
                payload: err.response?.data?.error || 'Error sending message'
            });

            // Add fallback AI response
            const fallbackResponse = {
                id: 'fallback_' + Date.now(),
                content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            dispatch({
                type: SEND_MESSAGE,
                payload: {
                    aiResponse: fallbackResponse
                }
            });

            return false;
        }
    };

    // Clear chat
    const clearChat = async () => {
        try {
            setLoading();

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token');
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('/api/v1/chat/clear', {}, config);

            dispatch({ type: CLEAR_CHAT });

            // Add welcome message after clearing
            dispatch({
                type: GET_MESSAGES,
                payload: [{
                    id: 'welcome',
                    content: 'Chat history cleared. How can I help you today?',
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                }]
            });

            return true;
        } catch (err) {
            dispatch({
                type: MESSAGE_ERROR,
                payload: err.response?.data?.error || 'Error clearing chat'
            });
            return false;
        }
    };

    // Set loading
    const setLoading = () => dispatch({ type: SET_LOADING });

    return (
        <ChatContext.Provider
            value={{
                messages: state.messages,
                error: state.error,
                loading: state.loading,
                getMessages,
                sendMessage,
                clearChat
            }}
        >
            {props.children}
        </ChatContext.Provider>
    );
};

export default ChatState;