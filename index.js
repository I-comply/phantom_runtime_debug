import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import chalk from 'chalk';
import { runPhantom } from './phantom.js';

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(chalk.green(`Phantom Debug Runtime running on :${PORT}`));

wss.on('connection', (ws) => {
  const sessionId = uuid();
  console.log(chalk.blue(`Session connected: ${sessionId}`));

  ws.on('message', async (msg) => {
    let payload;

    try {
      payload = JSON.parse(msg);
    } catch {
      ws.send(JSON.stringify({ sessionId, error: 'Invalid JSON payload' }));
      return;
    }

    try {
      const result = await runPhantom(payload);
      ws.send(JSON.stringify({ sessionId, result }));
    } catch (err) {
      ws.send(JSON.stringify({ sessionId, error: err.message }));
    }
  });

  ws.on('error', (err) => {
    console.error(chalk.red(`WebSocket error [${sessionId}]:`, err.message));
  });

  ws.on('close', () => {
    console.log(chalk.yellow(`Session disconnected: ${sessionId}`));
  });
});

wss.on('error', (err) => {
  console.error(chalk.red('Server error:', err.message));
  process.exit(1);
});
