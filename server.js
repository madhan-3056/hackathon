const app = require('./app');
const http = require('http');
const { setupWebSocket } = require('./services/chatService');

const server = http.createServer(app);

// Setup WebSocket for real-time chat
setupWebSocket(server);

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