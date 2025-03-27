import { explainLegalTerm } from '../services/aiService.js';
import ErrorResponse from '../utils/errorResponse.js';

// Store messages in memory (in a real app, this would be in a database)
const messages = [];

// Send a message
export const sendMessage = async (req, res, next) => {
    try {
        const { content, type } = req.body;
        const userId = req.user.id;

        if (!content) {
            return next(new ErrorResponse('Please provide message content', 400));
        }

        // Create a new message
        const message = {
            id: 'msg_' + Date.now(),
            content,
            userId,
            sender: 'user',
            timestamp: new Date().toISOString()
        };

        // Add message to memory store
        messages.push(message);

        // If this is a legal term explanation request, get AI response
        let aiResponse = null;
        if (type === 'explain_term') {
            try {
                const explanation = await explainLegalTerm(content);

                // Create AI response message
                aiResponse = {
                    id: 'msg_' + (Date.now() + 1),
                    content: explanation,
                    userId,
                    sender: 'ai',
                    timestamp: new Date().toISOString()
                };

                // Add AI response to memory store
                messages.push(aiResponse);
            } catch (error) {
                console.error('AI service error:', error);
                // Still return the user message even if AI fails
            }
        }

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: {
                message,
                aiResponse
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get messages for a user
export const getMessages = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Filter messages for this user
        const userMessages = messages.filter(msg => msg.userId === userId);

        res.status(200).json({
            success: true,
            count: userMessages.length,
            data: userMessages
        });
    } catch (error) {
        next(error);
    }
};

// Clear chat history for a user
export const clearChat = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Remove all messages for this user
        const initialLength = messages.length;
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].userId === userId) {
                messages.splice(i, 1);
            }
        }

        res.status(200).json({
            success: true,
            message: `Cleared ${initialLength - messages.length} messages`,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// Default export for compatibility
export default {
    sendMessage,
    getMessages,
    clearChat
};