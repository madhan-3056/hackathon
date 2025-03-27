import express from 'express';
import { protect } from '../middlewares/auth.js';
import { sendMessage, getMessages, clearChat } from '../controllers/chatController.js';

const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
    res.json({ message: 'Chat routes working' });
});

// Chat routes
router.route('/messages').post(protect, sendMessage);
router.route('/messages').get(protect, getMessages);
router.route('/clear').post(protect, clearChat);

export default router;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
    module.exports = router;
}