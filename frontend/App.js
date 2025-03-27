// El ClassicoAI - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Chatbot functionality
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const minimizeChat = document.getElementById('minimizeChat');
    const closeChat = document.getElementById('closeChat');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // WebSocket connection
    let socket = null;
    let isConnected = false;
    let userId = null; // Will be set when user logs in or from localStorage

    // Initialize WebSocket connection
    function initWebSocket() {
        // Get the current hostname and determine WebSocket protocol
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        const wsUrl = `${protocol}//${host}/ws`;

        console.log('Connecting to WebSocket at:', wsUrl);

        try {
            socket = new WebSocket(wsUrl);

            socket.onopen = function() {
                console.log('WebSocket connection established');
                isConnected = true;

                // Try to authenticate if we have a userId
                if (userId) {
                    authenticateWebSocket();
                }
            };

            socket.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message received:', data);

                    // Handle different message types
                    switch (data.type) {
                        case 'welcome':
                            console.log('WebSocket welcome message:', data.message);
                            break;

                        case 'auth_success':
                            console.log('WebSocket authentication successful');
                            break;

                        case 'explanation':
                            addMessage(`Term: ${data.term}\n\nExplanation: ${data.explanation}`, 'bot-message');
                            break;

                        case 'message_received':
                            // Message confirmation, no need to display
                            break;

                        case 'ai_response':
                            addMessage(data.message.content, 'bot-message');
                            break;

                        case 'error':
                            console.error('WebSocket error message:', data.message);
                            addMessage(`Sorry, I encountered an error: ${data.message}`, 'bot-message error');
                            break;

                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            socket.onclose = function() {
                console.log('WebSocket connection closed');
                isConnected = false;

                // Try to reconnect after a delay
                setTimeout(initWebSocket, 3000);
            };

            socket.onerror = function(error) {
                console.error('WebSocket error:', error);
                isConnected = false;
            };
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    }

    // Authenticate WebSocket connection
    function authenticateWebSocket() {
        if (isConnected && socket && userId) {
            socket.send(JSON.stringify({
                type: 'auth',
                userId: userId
            }));
        }
    }

    // Try to get userId from localStorage
    try {
        const token = localStorage.getItem('token');
        if (token) {
            // Simple JWT parsing to get user ID (in a real app, use proper JWT library)
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            const payload = JSON.parse(jsonPayload);
            userId = payload.id;
            console.log('User ID from token:', userId);
        }
    } catch (error) {
        console.error('Error parsing token:', error);
    }

    // Initialize WebSocket
    initWebSocket();

    // Toggle chatbot window
    chatbotIcon.addEventListener('click', function () {
        chatbotWindow.classList.add('active');
        chatbotIcon.style.display = 'none';
    });

    // Minimize chatbot
    minimizeChat.addEventListener('click', function () {
        chatbotWindow.classList.remove('active');
        chatbotIcon.style.display = 'flex';
    });

    // Close chatbot
    closeChat.addEventListener('click', function () {
        chatbotWindow.classList.remove('active');
        chatbotIcon.style.display = 'flex';
    });

    // Send message
    function sendUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addMessage(message, 'user-message');

        // Clear input
        userInput.value = '';

        // Check if WebSocket is connected
        if (isConnected && socket) {
            // Determine if this might be a legal term explanation request
            const isLegalTermRequest = message.toLowerCase().includes('what is') ||
                                      message.toLowerCase().includes('explain') ||
                                      message.toLowerCase().includes('define') ||
                                      message.toLowerCase().includes('meaning of');

            if (isLegalTermRequest) {
                // Extract the term to explain
                const termMatch = message.match(/what is|explain|define|meaning of\s+([a-z\s]+)/i);
                if (termMatch && termMatch[1]) {
                    const term = termMatch[1].trim();

                    // Send term explanation request
                    socket.send(JSON.stringify({
                        type: 'explain_term',
                        term: term
                    }));

                    return;
                }
            }

            // Send as regular chat message
            socket.send(JSON.stringify({
                type: 'chat_message',
                content: message,
                needsResponse: true
            }));
        } else {
            // Fallback if WebSocket is not connected
            console.log('WebSocket not connected, using fallback response');

            // Simulate bot response after a short delay
            setTimeout(function () {
                const botResponses = [
                    "I'm analyzing your legal question. Could you provide more details?",
                    "Based on my analysis, this appears to be a contract issue. Would you like me to explain the legal implications?",
                    "I've found relevant legal precedents that might help with your situation. Would you like me to elaborate?",
                    "This is a common legal concern for small businesses. Here's what you should know...",
                    "I recommend reviewing the specific terms in your agreement. Would you like guidance on how to interpret them?"
                ];

                // Select a random response for demo purposes
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
                addMessage(randomResponse, 'bot-message');
            }, 1000);
        }
    }

    // Add message to chat
    function addMessage(text, className) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', className);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message on button click
    sendMessage.addEventListener('click', sendUserMessage);

    // Send message on Enter key
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendUserMessage();
        }
    });

    // Get Started and Try Free buttons functionality
    const tryFreeBtn = document.getElementById('tryFreeBtn');
    const tryFreeBtn2 = document.getElementById('tryFreeBtn2');
    const startTrialBtn = document.getElementById('startTrialBtn');

    function openChatbot() {
        chatbotWindow.classList.add('active');
        chatbotIcon.style.display = 'none';

        // Add welcome message
        setTimeout(function () {
            addMessage("Welcome to El ClassicoAI! How can I assist with your legal needs today?", 'bot-message');
        }, 500);
    }

    // Add event listeners to buttons
    if (tryFreeBtn) tryFreeBtn.addEventListener('click', openChatbot);
    if (tryFreeBtn2) tryFreeBtn2.addEventListener('click', openChatbot);
    if (startTrialBtn) startTrialBtn.addEventListener('click', openChatbot);
});