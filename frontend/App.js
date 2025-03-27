// Virtual Lawyer - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Chatbot functionality
    const chatbotIcon = document.getElementById('chatbotIcon');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const minimizeChat = document.getElementById('minimizeChat');
    const closeChat = document.getElementById('closeChat');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;

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

            socket.onopen = function () {
                console.log('WebSocket connection established');
                isConnected = true;

                // Try to authenticate if we have a userId
                if (userId) {
                    authenticateWebSocket();
                }
            };

            socket.onmessage = function (event) {
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
                            addBotMessage(`<strong>${data.term}</strong>: ${data.explanation}`);
                            break;

                        case 'message_received':
                            // Message confirmation, no need to display
                            break;

                        case 'ai_response':
                            addBotMessage(data.message.content);
                            break;

                        case 'error':
                            console.error('WebSocket error message:', data.message);
                            addBotMessage(`Sorry, I encountered an error: ${data.message}`);
                            break;

                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };

            socket.onclose = function () {
                console.log('WebSocket connection closed');
                isConnected = false;

                // Try to reconnect after a delay
                setTimeout(initWebSocket, 3000);
            };

            socket.onerror = function (error) {
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
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
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

    // Toggle chatbot window with animation - only if not using as a link
    if (!chatbotIcon.hasAttribute('href')) {
        chatbotIcon.addEventListener('click', function (e) {
            e.preventDefault();
            chatbotWindow.classList.add('active');
            chatbotIcon.style.display = 'none';

            // Focus on input field
            setTimeout(() => {
                userInput.focus();
            }, 400);
        });
    }

    // Minimize chatbot
    minimizeChat.addEventListener('click', function () {
        chatbotWindow.classList.remove('active');
        setTimeout(() => {
            chatbotIcon.style.display = 'flex';
        }, 300);
    });

    // Close chatbot
    closeChat.addEventListener('click', function () {
        chatbotWindow.classList.remove('active');
        setTimeout(() => {
            chatbotIcon.style.display = 'flex';
        }, 300);
    });

    // Send message
    function sendUserMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addUserMessage(message);

        // Clear input
        userInput.value = '';

        // Show typing indicator
        showTypingIndicator();

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
                    "I'm analyzing your legal question. Could you provide more details about your business situation?",
                    "Based on my analysis, this appears to be a contract issue common for small businesses. Would you like me to explain the legal implications?",
                    "I've found relevant legal precedents that might help with your situation. For startups like yours, it's important to consider...",
                    "This is a common legal concern for small businesses. Here's what you should know about protecting your interests...",
                    "I recommend reviewing the specific terms in your agreement. As a small business owner, you should pay special attention to liability clauses."
                ];

                // Select a random response for demo purposes
                const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

                // Remove typing indicator and add bot message
                removeTypingIndicator();
                addBotMessage(randomResponse);
            }, 1500);
        }
    }

    // Add user message to chat
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of the chat
        scrollToBottom();
    }

    // Add bot message to chat
    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');

        const botAvatar = document.createElement('div');
        botAvatar.classList.add('bot-avatar');

        const avatarIcon = document.createElement('i');
        avatarIcon.classList.add('fas', 'fa-balance-scale');
        botAvatar.appendChild(avatarIcon);

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.innerHTML = text; // Using innerHTML to support HTML in messages

        messageDiv.appendChild(botAvatar);
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);

        // Scroll to the bottom of the chat
        scrollToBottom();
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot-message', 'typing-indicator-container');
        typingDiv.id = 'typingIndicator';

        const botAvatar = document.createElement('div');
        botAvatar.classList.add('bot-avatar');

        const avatarIcon = document.createElement('i');
        avatarIcon.classList.add('fas', 'fa-balance-scale');
        botAvatar.appendChild(avatarIcon);

        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message-content', 'typing-indicator');

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            typingIndicator.appendChild(dot);
        }

        typingDiv.appendChild(botAvatar);
        typingDiv.appendChild(typingIndicator);
        chatMessages.appendChild(typingDiv);

        // Scroll to the bottom of the chat
        scrollToBottom();
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Scroll to bottom of chat
    function scrollToBottom() {
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

        // Add welcome message if it's the first time opening
        if (chatMessages.children.length <= 1) {
            setTimeout(function () {
                addBotMessage("Hello! I'm your Virtual Lawyer Assistant. How can I help your small business or startup today?");
            }, 500);
        }

        // Focus on input field
        setTimeout(() => {
            userInput.focus();
        }, 600);
    }

    // Add event listeners to buttons
    if (tryFreeBtn) tryFreeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openChatbot();
    });

    if (tryFreeBtn2) tryFreeBtn2.addEventListener('click', function (e) {
        e.preventDefault();
        openChatbot();
    });

    if (startTrialBtn) startTrialBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openChatbot();
    });

    // Testimonials slider functionality
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            if (i === index) {
                testimonial.style.opacity = '1';
                testimonial.style.transform = 'translateX(0)';
            } else {
                testimonial.style.opacity = '0';
                testimonial.style.transform = 'translateX(50px)';
            }
        });
    }

    // Initialize testimonials if they exist
    if (testimonials.length > 0) {
        // Set initial state
        testimonials.forEach((testimonial, i) => {
            if (i !== 0) {
                testimonial.style.opacity = '0';
                testimonial.style.position = 'absolute';
                testimonial.style.top = '0';
            }
        });

        // Auto-rotate testimonials
        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonials.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add animation to service cards on scroll
    const serviceCards = document.querySelectorAll('.service-card');

    function checkScroll() {
        serviceCards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (cardTop < windowHeight * 0.8) {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }

    // Initialize service cards if they exist
    if (serviceCards.length > 0) {
        // Set initial state
        serviceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Check on scroll
        window.addEventListener('scroll', checkScroll);

        // Check on initial load
        checkScroll();
    }

    // Add typing animation to the hero title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.innerHTML;
        heroTitle.innerHTML = '';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        // Start typing animation after a short delay
        setTimeout(typeWriter, 500);
    }
});