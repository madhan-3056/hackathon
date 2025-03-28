const app = require('./app.cjs');
const http = require('http');
const chatService = require('./services/chatService.cjs');

const server = http.createServer(app);

// Setup WebSocket for real-time chat
chatService.setupWebSocket(server);

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use`);
    // You could automatically try the next port here
  } else {
    console.error(err);
  }
});