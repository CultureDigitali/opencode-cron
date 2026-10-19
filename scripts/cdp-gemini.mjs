import { WebSocket } from 'ws';
import fs from 'fs';

const pageId = process.argv[2] || '06FB3DDA4116A463ED0D7463B741C0DB';
const wsUrl = `ws://127.0.0.1:9111/devtools/page/${pageId}`;

const ws = new WebSocket(wsUrl);

let id = 1;
const pending = new Map();

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = id++;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(msg.error);
    else resolve(msg.result);
  }
});

ws.on('open', async () => {
  try {
    console.log('Connected to CDP');
    await send('Page.enable');
    await send('Runtime.enable');
    
    // Evaluate document state
    const evalRes = await send('Runtime.evaluate', {
      expression: `({
        url: window.location.href,
        title: document.title,
        bodyText: document.body ? document.body.innerText.slice(0, 500) : ''
      })`,
      returnByValue: true
    });
    console.log('Page state:', JSON.stringify(evalRes.result?.value, null, 2));

    // Take screenshot
    const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 80 });
    fs.writeFileSync('.taste-skill/inspect/gemini-check.jpg', Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to .taste-skill/inspect/gemini-check.jpg');

    ws.close();
  } catch (err) {
    console.error('CDP Error:', err);
    ws.close();
  }
});

