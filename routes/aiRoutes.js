const express = require('express');
const { protect } = require('../middlewares/auth');
const aiController = require('../controllers/aiController.cjs');
const { explainTerm, analyze, answerQuestion, getConfig } = aiController;

const router = express.Router();

// AI routes
router.route('/explain').post(protect, explainTerm);
router.route('/analyze').post(protect, analyze);
router.route('/question').post(protect, answerQuestion);
router.route('/config').get(protect, getConfig);

module.exports = router;