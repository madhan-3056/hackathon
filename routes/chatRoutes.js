import express from 'express';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
    res.json({ message: 'Chat routes working' });
});

// Import chat controller dynamically if it exists
let chatController;
try {
    chatController = await import('../controllers/chatController.js');

    // Add chat routes if controller exists
    if (chatController.sendMessage) {
        router.route('/messages').post(protect, chatController.sendMessage);
    }

    if (chatController.getMessages) {
        router.route('/messages').get(protect, chatController.getMessages);
    }
} catch (err) {
    console.log('Chat controller not found:', err.message);

    // Add placeholder routes
    router.route('/messages').post(protect, (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Message sent successfully (placeholder)',
            data: {
                id: 'msg_' + Date.now(),
                content: req.body.content,
                timestamp: new Date().toISOString()
            }
        });
    });

    router.route('/messages').get(protect, (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Messages retrieved successfully (placeholder)',
            data: [
                {
                    id: 'msg_1',
                    content: 'This is a placeholder message',
                    sender: 'system',
                    timestamp: new Date().toISOString()
                }
            ]
        });
    });
}

export default router;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
    module.exports = router;
}