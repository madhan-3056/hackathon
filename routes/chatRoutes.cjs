const express = require('express');
const { protect } = require('../middlewares/auth');
const chatController = require('../controllers/chatController.cjs');

const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
    res.json({ message: 'Chat routes working' });
});

// Chat routes
router.route('/messages').post(protect, chatController.sendMessage);
router.route('/messages').get(protect, chatController.getMessages);
router.route('/clear').post(protect, chatController.clearChat);

module.exports = router;