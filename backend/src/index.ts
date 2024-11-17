// server.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8000 });

let userCount = 0;

wss.on('connection', (ws) => {
  userCount++;
  ws.send(
    JSON.stringify({
      type: 'userCount',
      payload: userCount,
    }),
  );
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(
        JSON.stringify({
          type: 'userCount',
          payload: userCount,
        }),
      );
    }
  });
  ws.on('close', () => {
    userCount--;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: 'userCount',
            payload: userCount,
          }),
        );
      }
    });
  });
});

console.log('WebSocket server running on ws://localhost:8080');
