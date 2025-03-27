// Legal Actions Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // AI Assistant functionality
    const aiAssistantIcon = document.getElementById('aiAssistantIcon');
    const aiAssistantWindow = document.getElementById('aiAssistantWindow');
    const minimizeAssistant = document.getElementById('minimizeAssistant');
    const closeAssistant = document.getElementById('closeAssistant');
    const userActionInput = document.getElementById('userActionInput');
    const sendActionMessage = document.getElementById('sendActionMessage');
    const aiMessages = document.getElementById('aiMessages');

    // CTA buttons
    const startActionBtn = document.getElementById('startActionBtn');
    const consultationBtn = document.getElementById('consultationBtn');

    // Initialize tabs
    function initTabs() {
        // Set initial active tab based on URL hash or default to first tab
        let activeTabId = window.location.hash.substring(1) || 'contract-disputes';

        // Activate the correct tab
        activateTab(activeTabId);

        // Add click event listeners to tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', function () {
                const tabId = this.getAttribute('data-tab');
                activateTab(tabId);

                // Update URL hash without scrolling
                history.pushState(null, null, `#${tabId}`);
            });
        });
    }

    // Activate a specific tab
    function activateTab(tabId) {
        // Deactivate all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Activate the selected tab
        const selectedButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);

        if (selectedButton && selectedContent) {
            selectedButton.classList.add('active');
            selectedContent.classList.add('active');
        }
    }

    // RGB color cycling for the AI assistant icon
    function startRgbColorCycle() {
        const rgbRing = document.querySelector('.rgb-ring');
        if (!rgbRing) return;

        // Create a dynamic keyframe animation for smoother color transitions
        const colors = [
            '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00',
            '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
            '#ff00ff', '#ff0080', '#ff0000'
        ];

        let keyframes = '';
        colors.forEach((color, index) => {
            const percent = (index / (colors.length - 1)) * 100;
            keyframes += `${percent}% { box-shadow: 0 0 25px ${color}, 0 0 50px ${color}; }`;
        });

        // Add the keyframes to a style element
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rgbGlow {
                ${keyframes}
            }
            
            .rgb-ring::before {
                animation: rgb-spin 3s linear infinite, rgbGlow 10s linear infinite;
            }
        `;

        document.head.appendChild(style);
    }

    // Toggle AI assistant window
    aiAssistantIcon.addEventListener('click', function () {
        aiAssistantWindow.classList.add('active');
        aiAssistantIcon.style.display = 'none';

        // Focus on input field
        setTimeout(() => {
            userActionInput.focus();
        }, 400);
    });

    // Minimize AI assistant
    minimizeAssistant.addEventListener('click', function () {
        aiAssistantWindow.classList.remove('active');
        setTimeout(() => {
            aiAssistantIcon.style.display = 'flex';
        }, 300);
    });

    // Close AI assistant
    closeAssistant.addEventListener('click', function () {
        aiAssistantWindow.classList.remove('active');
        setTimeout(() => {
            aiAssistantIcon.style.display = 'flex';
        }, 300);
    });

    // Send message to AI assistant
    function sendUserActionMessage() {
        const message = userActionInput.value.trim();
        if (message === '') return;

        // Add user message to chat
        addUserMessage(message);

        // Clear input
        userActionInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Determine which legal category the message might be related to
        const legalCategories = {
            'contract': ['contract', 'agreement', 'breach', 'terms', 'clause', 'party', 'sign', 'negotiate'],
            'compliance': ['compliance', 'regulation', 'law', 'requirement', 'standard', 'rule', 'policy', 'legal'],
            'terms': ['privacy', 'policy', 'terms', 'service', 'cookie', 'gdpr', 'ccpa', 'data protection']
        };

        // Check which category the message most likely belongs to
        let matchedCategory = 'general';
        let highestMatchCount = 0;

        for (const [category, keywords] of Object.entries(legalCategories)) {
            const matchCount = keywords.filter(keyword =>
                message.toLowerCase().includes(keyword.toLowerCase())
            ).length;

            if (matchCount > highestMatchCount) {
                highestMatchCount = matchCount;
                matchedCategory = category;
            }
        }

        // Generate appropriate response based on category
        setTimeout(() => {
            removeTypingIndicator();

            let response = '';

            switch (matchedCategory) {
                case 'contract':
                    response = generateContractResponse(message);
                    break;
                case 'compliance':
                    response = generateComplianceResponse(message);
                    break;
                case 'terms':
                    response = generateTermsResponse(message);
                    break;
                default:
                    response = "I'd be happy to help with your legal question. Could you provide more details about whether this relates to a contract dispute, compliance issue, or terms & policy matter?";
            }

            addBotMessage(response);

            // If this is the first user message, suggest switching to the relevant tab
            if (aiMessages.querySelectorAll('.user-message').length === 1 && matchedCategory !== 'general') {
                const tabMapping = {
                    'contract': 'contract-disputes',
                    'compliance': 'compliance-issues',
                    'terms': 'terms-policy'
                };

                const suggestedTab = tabMapping[matchedCategory];

                setTimeout(() => {
                    addBotMessage(`I notice you're asking about a ${matchedCategory} issue. Would you like to see our step-by-step guide for handling ${matchedCategory} matters? <a href="#" class="switch-tab-link" data-tab="${suggestedTab}">View ${matchedCategory} guide</a>`);

                    // Add event listeners to the newly created link
                    document.querySelectorAll('.switch-tab-link').forEach(link => {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();
                            const tabId = this.getAttribute('data-tab');
                            activateTab(tabId);
                            history.pushState(null, null, `#${tabId}`);

                            // Scroll to the tab content
                            document.getElementById(tabId).scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        });
                    });
                }, 1000);
            }
        }, 1500 + Math.random() * 1000); // Random delay to simulate thinking
    }

    // Generate response for contract-related queries
    function generateContractResponse(message) {
        const contractResponses = [
            "Based on your contract issue, I recommend starting with a thorough review of the agreement. Our Contract Dispute Resolution guide outlines the key steps to identify potential breaches and remedies available to you.",

            "Contract disputes often require careful analysis of the specific language in your agreement. I'd be happy to help you understand the legal implications and potential next steps.",

            "For your contract concern, it's important to document all communications related to the potential breach. This will strengthen your position during negotiations or potential litigation.",

            "When dealing with contract disputes, timing is critical. There may be notice requirements or limitation periods that affect your legal rights. Let me help you understand the timeline for addressing this issue."
        ];

        return contractResponses[Math.floor(Math.random() * contractResponses.length)];
    }

    // Generate response for compliance-related queries
    function generateComplianceResponse(message) {
        const complianceResponses = [
            "Compliance requirements can vary significantly by industry and jurisdiction. Based on your question, I recommend starting with a comprehensive compliance assessment as outlined in our Compliance Issue Resolution guide.",

            "Staying compliant with regulations is crucial for small businesses. I can help you understand the specific requirements that apply to your situation and develop a plan to address any gaps.",

            "For your compliance concern, it's important to document your efforts to meet regulatory requirements. This can help mitigate potential penalties if issues arise.",

            "Compliance is an ongoing process rather than a one-time effort. I recommend establishing regular review procedures to ensure you stay current with changing regulations in your industry."
        ];

        return complianceResponses[Math.floor(Math.random() * complianceResponses.length)];
    }

    // Generate response for terms & policy-related queries
    function generateTermsResponse(message) {
        const termsResponses = [
            "Creating proper legal documents like Terms of Service and Privacy Policies is essential for protecting your business. Our Terms & Policy Development guide can walk you through the process step by step.",

            "For your terms and policy question, it's important to ensure your documents accurately reflect your actual business practices, especially regarding data collection and processing.",

            "Legal documents like privacy policies need to comply with various regulations such as GDPR or CCPA depending on your user base. I can help you understand which requirements apply to your business.",

            "Well-crafted terms and policies can help limit your liability and set clear expectations with your customers. I recommend reviewing our implementation guidance to ensure proper integration with your business operations."
        ];

        return termsResponses[Math.floor(Math.random() * termsResponses.length)];
    }

    // Add user message to chat
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = text;

        messageDiv.appendChild(messageContent);
        aiMessages.appendChild(messageDiv);

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
        aiMessages.appendChild(messageDiv);

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
        aiMessages.appendChild(typingDiv);

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
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Send message on button click
    sendActionMessage.addEventListener('click', sendUserActionMessage);

    // Send message on Enter key
    userActionInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendUserActionMessage();
        }
    });

    // CTA button functionality
    if (startActionBtn) {
        startActionBtn.addEventListener('click', function (e) {
            e.preventDefault();
            aiAssistantWindow.classList.add('active');
            aiAssistantIcon.style.display = 'none';

            setTimeout(() => {
                userActionInput.focus();

                // Add a prompt message if this is the first time opening
                if (aiMessages.querySelectorAll('.bot-message').length <= 1) {
                    addBotMessage("I see you're ready to take action on your legal matter. Could you briefly describe the legal challenge you're facing so I can guide you through the appropriate steps?");
                }
            }, 400);
        });
    }

    if (consultationBtn) {
        consultationBtn.addEventListener('click', function (e) {
            e.preventDefault();
            aiAssistantWindow.classList.add('active');
            aiAssistantIcon.style.display = 'none';

            setTimeout(() => {
                userActionInput.focus();

                // Add a consultation prompt
                addBotMessage("I'd be happy to help you schedule a consultation with one of our legal experts. Could you tell me what specific legal matter you need assistance with?");
            }, 400);
        });
    }

    // Animate the scales of justice
    function animateScales() {
        const scaleLeft = document.querySelector('.scale-left');
        const scaleRight = document.querySelector('.scale-right');

        if (!scaleLeft || !scaleRight) return;

        // Create a more natural balancing animation
        let leftPosition = 0;
        let rightPosition = 0;
        let direction = 1;
        let speed = 0.5;

        function animate() {
            // Update positions
            leftPosition += speed * direction;
            rightPosition -= speed * direction;

            // Reverse direction at extremes
            if (Math.abs(leftPosition) > 15) {
                direction *= -1;
            }

            // Apply transformations
            scaleLeft.style.transform = `translateY(${leftPosition}px)`;
            scaleRight.style.transform = `translateY(${rightPosition}px)`;

            // Continue animation
            requestAnimationFrame(animate);
        }

        animate();
    }

    // Initialize everything
    initTabs();
    startRgbColorCycle();
    animateScales();

    // Handle hash changes
    window.addEventListener('hashchange', function () {
        const hash = window.location.hash.substring(1);
        if (hash) {
            activateTab(hash);
        }
    });

    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only apply to hash links that aren't tab switches
            if (href !== '#' && !this.classList.contains('switch-tab-link')) {
                e.preventDefault();

                const targetId = href;
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    // Update URL without scrolling
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
});