// Simple test script to verify the application can start without errors
import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting test application...');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Test application is running!');
});

// Import services to test them
const testServices = async () => {
    try {
        console.log('Testing aiService...');
        const aiService = await import('./services/aiService.js');
        const analysisResult = await aiService.analyzeDocument('This is a test document');
        console.log('AI service test result:', analysisResult ? 'Success' : 'Failed');

        console.log('Testing chatService...');
        const chatService = await import('./services/chatService.js');
        chatService.setupWebSocket(server);
        console.log('Chat service test result: Success');
    } catch (error) {
        console.error('Service test error:', error);
    }
};

// Start the server
const PORT = 3333;
server.listen(PORT, async () => {
    console.log(`Test server running on port ${PORT}`);

    // Test services
    await testServices();

    console.log('All tests completed. Press Ctrl+C to exit.');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Unhandled Rejection - but application continues running');
});