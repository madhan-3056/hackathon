const express = require('express');
const {
  createDocument,
  analyzeDocument,
} = require('../controllers/documentController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.route('/').post(protect, createDocument);
router.route('/:id/analyze').post(protect, analyzeDocument);

module.exports = router;