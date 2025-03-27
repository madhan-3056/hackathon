import React, { useState, useEffect, useRef } from 'react';
import { chatService, aiService } from '../../services/apiService';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiConfig, setAiConfig] = useState({ available: false });
    const messagesEndRef = useRef(null);

    // Fetch messages and AI config on component mount
    useEffect(() => {
        fetchMessages();
        fetchAiConfig();
    }, []);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Fetch AI configuration
    const fetchAiConfig = async () => {
        try {
            const response = await aiService.getConfig();
            if (response.success) {
                setAiConfig(response.data);
                console.log('AI config loaded:', response.data);
            }
        } catch (error) {
            console.error('Error fetching AI config:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const response = await chatService.getMessages();
            if (response.success) {
                setMessages(response.data);
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
            // Determine if this is a legal term explanation request
            const isLegalTermRequest = input.toLowerCase().includes('what is') ||
                input.toLowerCase().includes('explain') ||
                input.toLowerCase().includes('define') ||
                input.toLowerCase().includes('meaning of');

            if (isLegalTermRequest && aiConfig.available) {
                // Extract the term to explain
                const termMatch = input.match(/what is|explain|define|meaning of\s+([a-z\s]+)/i);
                if (termMatch && termMatch[1]) {
                    const term = termMatch[1].trim();

                    // First, add the user message to chat history
                    const chatResponse = await chatService.sendMessage(input, 'explain_term');

                    if (chatResponse.success) {
                        // Replace the temporary message with the actual one from server
                        setMessages(prevMessages =>
                            prevMessages.map(msg =>
                                msg.id === userMessage.id ? chatResponse.data.message : msg
                            )
                        );

                        // Get the term explanation from AI service
                        const termResponse = await aiService.explainTerm(term);

                        if (termResponse.success) {
                            // Create AI response message
                            const aiResponseMessage = {
                                id: 'ai_' + Date.now(),
                                content: termResponse.data.explanation,
                                sender: 'ai',
                                timestamp: new Date().toISOString()
                            };

                            // Add AI response
                            setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
                        } else if (chatResponse.data.aiResponse) {
                            // Fallback to chat service response if AI service fails
                            setMessages(prevMessages => [...prevMessages, chatResponse.data.aiResponse]);
                        }
                    }
                }
            } else if (aiConfig.available) {
                // This is a general legal question for small business/startup

                // First, add the user message to chat history
                const chatResponse = await chatService.sendMessage(input, 'general');

                if (chatResponse.success) {
                    // Replace the temporary message with the actual one from server
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === userMessage.id ? chatResponse.data.message : msg
                        )
                    );

                    // Get the answer from AI service
                    const questionResponse = await aiService.answerQuestion(input);

                    if (questionResponse.success) {
                        // Create AI response message
                        const aiResponseMessage = {
                            id: 'ai_' + Date.now(),
                            content: questionResponse.data.answer,
                            sender: 'ai',
                            timestamp: new Date().toISOString()
                        };

                        // Add AI response
                        setMessages(prevMessages => [...prevMessages, aiResponseMessage]);
                    } else if (chatResponse.data.aiResponse) {
                        // Fallback to chat service response if AI service fails
                        setMessages(prevMessages => [...prevMessages, chatResponse.data.aiResponse]);
                    }
                }
            } else {
                // AI is not available, use regular chat service
                const response = await chatService.sendMessage(input, 'general');

                if (response.success) {
                    // Replace the temporary message with the actual one from server
                    setMessages(prevMessages =>
                        prevMessages.map(msg =>
                            msg.id === userMessage.id ? response.data.message : msg
                        )
                    );

                    // Add AI response if available
                    if (response.data.aiResponse) {
                        setMessages(prevMessages => [...prevMessages, response.data.aiResponse]);
                    }
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
            const response = await chatService.clearChat();

            if (response.success) {
                // Reset messages with welcome message
                setMessages([
                    {
                        id: 'welcome',
                        content: 'Chat history cleared. How can I help you today?',
                        sender: 'ai',
                        timestamp: new Date().toISOString()
                    }
                ]);
            }
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