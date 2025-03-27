const WebSocket = require('ws');
const { explainLegalTerm } = require('./aiService');

let wss;

exports.setupWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
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
};

exports.broadcast = (data) => {
  if (!wss) return;
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};