import { WebSocketServer } from 'ws';
import { v4 as uuid } from 'uuid';
import chalk from 'chalk';
import { runPhantom } from './phantom.js';

const PORT = Number(process.env.PORT) || 8080;
const MAX_MESSAGE_BYTES = 1024 * 1024;
const wss = new WebSocketServer({ port: PORT });

function validatePayload(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ok: false, error: 'Payload must be a non-null object' };
  }

  if (!Object.prototype.hasOwnProperty.call(payload, 'code')) {
    return { ok: false, error: 'Missing code field' };
  }

  if (typeof payload.code !== 'string') {
    return { ok: false, error: 'code must be a string' };
  }

  const size = Buffer.byteLength(JSON.stringify(payload), 'utf8');
  if (size > MAX_MESSAGE_BYTES) {
    return { ok: false, error: 'Payload exceeds maximum size of 1MB' };
  }

  return { ok: true };
}

console.log(chalk.green(`Phantom Debug Runtime running on :${PORT}`));

wss.on('connection', (ws) => {
  const sessionId = uuid();
  console.log(chalk.blue(`Session connected: ${sessionId}`));

  ws.on('message', async (msg) => {
    let payload;
    const raw = typeof msg === 'string' ? msg : msg.toString();

    try {
      if (Buffer.byteLength(raw, 'utf8') > MAX_MESSAGE_BYTES) {
        throw new Error('Payload exceeds maximum size of 1MB');
      }
      payload = JSON.parse(raw);
    } catch (err) {
      ws.send(JSON.stringify({ sessionId, error: 'Invalid JSON payload' }));
      return;
    }

    const validation = validatePayload(payload);
    if (!validation.ok) {
      ws.send(JSON.stringify({ sessionId, error: validation.error }));
      return;
    }

    try {
      const result = await runPhantom(payload);
      ws.send(JSON.stringify({ sessionId, result }));
    } catch (err) {
      console.error(chalk.red(`Processing error [${sessionId}]:`, err.message));
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
