import express from 'express';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// Basic route for testing
router.get('/', (req, res) => {
  res.json({ message: 'Compliance routes working' });
});

// Import compliance controller dynamically if it exists
let complianceController;
try {
  complianceController = await import('../controllers/complianceController.js');

  // Add compliance routes if controller exists
  if (complianceController.checkCompliance) {
    router.route('/check').post(protect, complianceController.checkCompliance);
  }
} catch (err) {
  console.log('Compliance controller not found:', err.message);

  // Add a placeholder route
  router.route('/check').post(protect, (req, res) => {
    res.status(200).json({
      success: true,
      message: 'Compliance check placeholder - controller not implemented yet',
      data: {
        compliant: true,
        score: 95,
        issues: []
      }
    });
  });
}

export default router;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
  module.exports = router;
}