import { explainLegalTerm } from './aiService.js';

// Mock WebSocket implementation to avoid dependency on ws package
let wss = null;
let mockClients = [];

// Mock WebSocket class
class MockWebSocketServer {
  constructor() {
    this.clients = mockClients;
    console.log('Mock WebSocket server initialized');
  }
}

// Setup WebSocket server
export const setupWebSocket = (server) => {
  try {
    // Try to dynamically import the ws package
    import('ws').then(WebSocketModule => {
      const WebSocket = WebSocketModule.default;
      wss = new WebSocket.Server({ server });

      wss.on('connection', (ws) => {
        console.log('New client connected');

        ws.on('message', async (message) => {
          try {
            const data = JSON.parse(message.toString());

            if (data.type === 'explain_term') {
              const explanation = await explainLegalTerm(data.term);
              ws.send(JSON.stringify({
                type: 'explanation',
                term: data.term,
                explanation
              }));
            }
          } catch (error) {
            console.error('WebSocket error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Failed to process request'
            }));
          }
        });

        ws.on('close', () => {
          console.log('Client disconnected');
        });
      });

      console.log('WebSocket server initialized successfully');
    }).catch(err => {
      console.log('WebSocket package not available, using mock implementation');
      wss = new MockWebSocketServer();
    });
  } catch (error) {
    console.error('Error setting up WebSocket:', error.message);
    wss = new MockWebSocketServer();
  }
};

// Broadcast message to all connected clients
export const broadcast = (data) => {
  if (!wss) return;

  try {
    if (wss.clients) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN = 1
          client.send(JSON.stringify(data));
        }
      });
    } else {
      console.log('Mock broadcast:', data);
    }
  } catch (error) {
    console.error('Broadcast error:', error.message);
  }
};

// Add a mock client (for testing)
export const addMockClient = (client) => {
  mockClients.push(client);
};

// Default export for compatibility
export default {
  setupWebSocket,
  broadcast,
  addMockClient
};