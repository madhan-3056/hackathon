const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8080;

// Check if frontend build exists
const buildPath = path.join(__dirname, 'frontend', 'build');
if (!fs.existsSync(buildPath)) {
    console.error('Frontend build not found. Please build the frontend first:');
    console.error('cd frontend && npm run build');
    process.exit(1);
}

// Serve static files
app.use(express.static(buildPath));

// Serve index.html for any route
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Static server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    console.log('Note: This is serving only the frontend. API calls will not work.');
    console.log('Press Ctrl+C to stop the server');
});