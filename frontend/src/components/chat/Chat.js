import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Fetch messages on component mount
    useEffect(() => {
        fetchMessages();
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const res = await axios.get('/api/v1/chat/messages', config);
            if (res.data.success) {
                setMessages(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            // Add initial welcome message if no messages exist
            if (messages.length === 0) {
                setMessages([
                    {
                        id: 'welcome',
                        content: 'Welcome to the Virtual Lawyer chat assistant. How can I help you today?',
                        sender: 'ai',
                        timestamp: new Date().toISOString()
                    }
                ]);
            }
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === '') return;

        const userMessage = {
            id: 'temp_' + Date.now(),
            content: input,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        // Optimistically add user message to UI
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };

            // Determine if this is a legal term explanation request
            const isLegalTermRequest = input.toLowerCase().includes('what is') ||
                input.toLowerCase().includes('explain') ||
                input.toLowerCase().includes('define') ||
                input.toLowerCase().includes('meaning of');

            const messageType = isLegalTermRequest ? 'explain_term' : 'general';

            const res = await axios.post(
                '/api/v1/chat/messages',
                { content: input, type: messageType },
                config
            );

            if (res.data.success) {
                // Replace the temporary message with the actual one from server
                setMessages(prevMessages =>
                    prevMessages.map(msg =>
                        msg.id === userMessage.id ? res.data.data.message : msg
                    )
                );

                // Add AI response if available
                if (res.data.data.aiResponse) {
                    setMessages(prevMessages => [...prevMessages, res.data.data.aiResponse]);
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);

            // Add a fallback AI response in case of error
            const fallbackResponse = {
                id: 'fallback_' + Date.now(),
                content: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
                sender: 'ai',
                timestamp: new Date().toISOString()
            };

            setMessages(prevMessages => [...prevMessages, fallbackResponse]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post('/api/v1/chat/clear', {}, config);

            // Reset messages with welcome message
            setMessages([
                {
                    id: 'welcome',
                    content: 'Chat history cleared. How can I help you today?',
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                }
            ]);
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h2>Legal Assistant Chat</h2>
                <button
                    onClick={clearChat}
                    className="btn btn-sm btn-outline-danger"
                >
                    Clear Chat
                </button>
            </div>

            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="text-center my-4">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
                        >
                            <div className="message-content">{message.content}</div>
                            <div className="message-timestamp">
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="message ai-message">
                        <div className="message-content typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="chat-input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your legal question here..."
                    className="chat-input"
                    disabled={loading}
                />
                <button
                    type="submit"
                    className="btn btn-primary send-button"
                    disabled={loading || input.trim() === ''}
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </form>
        </div>
    );
};

export default Chat;