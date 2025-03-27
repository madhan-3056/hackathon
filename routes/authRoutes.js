import express from 'express';
import { register, login } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;

// For CommonJS compatibility
if (typeof module !== 'undefined') {
    module.exports = router;
}