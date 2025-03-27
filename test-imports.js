// Test script to verify ES module imports are working correctly
import { UserModel } from './models/User.js';
import { register, login } from './controllers/authController.js';
import { createDocument, analyzeDocument } from './controllers/documentController.js';
import { protect } from './middlewares/auth.js';
import { analyzeDocument as analyzeDocumentService } from './services/aiService.js';
import ErrorResponse from './utils/errorResponse.js';

console.log('All imports loaded successfully!');
console.log('UserModel:', typeof UserModel);
console.log('register:', typeof register);
console.log('login:', typeof login);
console.log('createDocument:', typeof createDocument);
console.log('analyzeDocument:', typeof analyzeDocument);
console.log('protect:', typeof protect);
console.log('analyzeDocumentService:', typeof analyzeDocumentService);
console.log('ErrorResponse:', typeof ErrorResponse);

console.log('ES module imports test completed successfully!');