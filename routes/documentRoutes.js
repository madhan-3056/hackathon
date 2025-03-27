import express from 'express';
import { createDocument, analyzeDocument } from '../controllers/documentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Document routes working' });
});

// Document routes
router.route('/').post(protect, createDocument);
router.route('/:id/analyze').post(protect, analyzeDocument);

export default router;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
  module.exports = router;
}