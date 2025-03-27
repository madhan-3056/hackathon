import express from 'express';
import { protect } from '../middlewares/auth.js';
import { explainTerm, analyze, answerQuestion, getConfig } from '../controllers/aiController.js';

const router = express.Router();

// AI routes
router.route('/explain').post(protect, explainTerm);
router.route('/analyze').post(protect, analyze);
router.route('/question').post(protect, answerQuestion);
router.route('/config').get(protect, getConfig);

export default router;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
    module.exports = router;
}