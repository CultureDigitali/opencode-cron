import { WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

const pageId = process.argv[2] || '06FB3DDA4116A463ED0D7463B741C0DB';
const wsUrl = `ws://127.0.0.1:9111/devtools/page/${pageId}`;

const brandkitPrompt = `Ora genera un'immagine completa di Brand Identity Board e Design Guidelines per "opencode-cron".
Formato: presentazione orizzontale widescreen (16:9) su elegante sfondo scuro carbone (#191919) con una griglia modulare a pannelli puliti (stile brand guidelines studio di altissimo livello).
La tavola deve includere in modo armonico e perfettamente leggibile:
- Pannello Principale: Il logo ufficiale dell'astrolabio cronometro geometrico in verde petrolio profondo (#0c7866) e bianco osso, affiancato dal logotipo "opencode-cron".
- Pannello Geometria: Schema costruttivo vettoriale con cerchi concentrici e linee guida di precisione.
- Pannello Palette Colori: Campioni cromatici raffinati con codici esadecimali: #191919 (Obsidian Carbon), #0c7866 (Deep Teal), #14b8a6 (Electric Cyan), #f4f4f0 (Bone White).
- Pannello Tipografia & Payoff: "Agents run on time." e "Autonomous Session Scheduling for OpenCode".
- Pannello Applicazione: Mockup minimale dell'icona dell'applicazione macOS e finestra del terminale CLI in dark mode.
Stile: minimalista, dark-tech, editoriale, estremamente elegante, nessuna sbavatura, proporzioni auree.`;

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
    console.log('Connecting to Gemini session for Brand Identity Board...');
    await send('Runtime.enable');
    await send('Page.enable');

    // 1. Clear existing text in editor
    await send('Runtime.evaluate', {
      expression: `(() => {
        const ed = document.querySelector('.ql-editor, [contenteditable="true"]');
        if (ed) {
          ed.focus();
          document.execCommand('selectAll', false, null);
          document.execCommand('delete', false, null);
          return true;
        }
        return false;
      })()`
    });

    await new Promise(r => setTimeout(r, 400));

    // 2. Type prompt
    console.log('Inserting brandkit prompt...');
    await send('Input.insertText', { text: brandkitPrompt });
    await new Promise(r => setTimeout(r, 800));

    // 3. Click send button
    console.log('Clicking send...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label="Invia messaggio"], button[aria-label*="Invia"]');
        if (btn) btn.click();
      })()`
    });

    // 4. Poll until response completes and a second large image appears
    console.log('Waiting for Gemini to generate Brand Identity Board...');
    let brandkitImgSrc = null;

    for (let i = 0; i < 45; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const checkRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          }));
          const stopBtn = document.querySelector('button[aria-label*="Interrompi"], button[aria-label*="Stop"]');
          return {
            isStreaming: !!stopBtn,
            images: imgs.filter(img => img.src && (img.src.includes('blob:') || img.src.includes('googleusercontent.com')) && (img.width > 300 || img.naturalWidth > 300))
          };
        })()`,
        returnByValue: true
      });

      const data = checkRes.result?.value;
      const count = data?.images?.length || 0;
      console.log(`Poll ${i+1}/45: isStreaming=${data?.isStreaming}, found ${count} images`);

      if (count >= 2) {
        const latest = data.images[data.images.length - 1];
        console.log('Found latest generated image:', latest);
        brandkitImgSrc = latest.src;
        if (!data.isStreaming) {
          console.log('Generation completed!');
          break;
        }
      }
    }

    if (brandkitImgSrc) {
      console.log('Extracting brandkit image via canvas...');
      const extractRes = await send('Runtime.evaluate', {
        expression: `(() => {
          const imgs = Array.from(document.querySelectorAll('img')).filter(i => (i.naturalWidth > 300 || i.width > 300) && (i.src.includes('blob:') || i.src.includes('googleusercontent')));
          if (imgs.length === 0) return null;
          const img = imgs[imgs.length - 1]; // pick the newest one
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          return {
            width: canvas.width,
            height: canvas.height,
            dataUrl: canvas.toDataURL('image/png')
          };
        })()`,
        returnByValue: true
      });

      const val = extractRes.result?.value;
      if (val?.dataUrl) {
        const base64 = val.dataUrl.split(',')[1];
        const buffer = Buffer.from(base64, 'base64');
        const outPaths = [
          path.resolve('assets/brand-identity.png'),
          path.resolve('site/assets/img/brand-identity.png')
        ];
        for (const p of outPaths) {
          fs.writeFileSync(p, buffer);
          console.log(`Saved Brand Identity board to ${p} (${buffer.length} bytes, ${val.width}x${val.height})`);
        }
      }
    }

    ws.close();
  } catch (err) {
    console.error('Error during brandkit generation:', err);
    ws.close();
  }
});

