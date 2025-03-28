const aiService = require('./aiService.cjs');

// WebSocket server instance
let wss = null;
// For mock implementation
let mockClients = [];

// Mock WebSocket class for environments without WebSocket support
class MockWebSocketServer {
    constructor() {
        this.clients = mockClients;
        console.log('Mock WebSocket server initialized');
    }
}

// Setup WebSocket server
const setupWebSocket = (server) => {
    try {
        // Try to dynamically import the ws package
        const WebSocket = require('ws');
        wss = new WebSocket.Server({ server });

        wss.on('connection', (ws) => {
            console.log('New client connected');

            // Set a userId property when the client authenticates
            ws.userId = null;

            ws.on('message', async (message) => {
                try {
                    const data = JSON.parse(message.toString());

                    // Handle authentication
                    if (data.type === 'auth') {
                        ws.userId = data.userId;
                        ws.send(JSON.stringify({
                            type: 'auth_success',
                            message: 'Authentication successful'
                        }));
                        return;
                    }

                    // Require authentication for other message types
                    if (!ws.userId) {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Authentication required'
                        }));
                        return;
                    }

                    // Handle legal term explanation
                    if (data.type === 'explain_term') {
                        console.log(`Processing explain_term request for term: ${data.term}`);
                        try {
                            const explanation = await aiService.explainLegalTerm(data.term);
                            ws.send(JSON.stringify({
                                type: 'explanation',
                                term: data.term,
                                explanation
                            }));
                        } catch (error) {
                            console.error('Error explaining term:', error);
                            ws.send(JSON.stringify({
                                type: 'error',
                                message: 'Failed to explain term'
                            }));
                        }
                    }

                    // Handle chat message
                    else if (data.type === 'chat_message') {
                        // Store message in memory or database
                        const messageObj = {
                            id: 'msg_' + Date.now(),
                            content: data.content,
                            userId: ws.userId,
                            sender: 'user',
                            timestamp: new Date().toISOString()
                        };

                        // Echo message back to confirm receipt
                        ws.send(JSON.stringify({
                            type: 'message_received',
                            message: messageObj
                        }));

                        // Process message with AI if needed
                        if (data.needsResponse) {
                            try {
                                // Generate AI response
                                const aiResponse = await processMessageWithAI(data.content);

                                // Send AI response
                                ws.send(JSON.stringify({
                                    type: 'ai_response',
                                    message: {
                                        id: 'msg_' + (Date.now() + 1),
                                        content: aiResponse,
                                        userId: ws.userId,
                                        sender: 'ai',
                                        timestamp: new Date().toISOString()
                                    }
                                }));
                            } catch (error) {
                                console.error('Error generating AI response:', error);
                                ws.send(JSON.stringify({
                                    type: 'error',
                                    message: 'Failed to generate AI response'
                                }));
                            }
                        }
                    }

                    // Unknown message type
                    else {
                        ws.send(JSON.stringify({
                            type: 'error',
                            message: 'Unknown message type'
                        }));
                    }
                } catch (error) {
                    console.error('WebSocket message processing error:', error);
                    ws.send(JSON.stringify({
                        type: 'error',
                        message: 'Failed to process request'
                    }));
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
            });

            // Send welcome message
            ws.send(JSON.stringify({
                type: 'welcome',
                message: 'Connected to Virtual Lawyer WebSocket server'
            }));
        });

        console.log('WebSocket server initialized successfully');
    } catch (error) {
        console.error('Error setting up WebSocket:', error.message);
        wss = new MockWebSocketServer();
    }
};

// Process message with AI
const processMessageWithAI = async (content) => {
    // Determine if this is a legal term to explain
    const legalTermMatch = content.match(/what is|explain|define|meaning of\s+([a-z\s]+)/i);

    if (legalTermMatch && legalTermMatch[1]) {
        const term = legalTermMatch[1].trim();
        return await aiService.explainLegalTerm(term);
    }

    // For other types of messages, use the general question answering
    return await aiService.answerLegalQuestion(content);
};

// Broadcast message to all connected clients
const broadcast = (data) => {
    if (!wss) return;

    try {
        if (wss.clients) {
            wss.clients.forEach((client) => {
                if (client.readyState === 1) { // WebSocket.OPEN = 1
                    client.send(JSON.stringify(data));
                }
            });
        } else {
            console.log('Mock broadcast:', data);
        }
    } catch (error) {
        console.error('Broadcast error:', error.message);
    }
};

// Broadcast message to specific user
const broadcastToUser = (userId, data) => {
    if (!wss) return;

    try {
        if (wss.clients) {
            wss.clients.forEach((client) => {
                if (client.readyState === 1 && client.userId === userId) {
                    client.send(JSON.stringify(data));
                }
            });
        } else {
            console.log(`Mock broadcast to user ${userId}:`, data);
        }
    } catch (error) {
        console.error('Broadcast to user error:', error.message);
    }
};

// Add a mock client (for testing)
const addMockClient = (client) => {
    mockClients.push(client);
};

module.exports = {
    setupWebSocket,
    broadcast,
    broadcastToUser,
    addMockClient
};