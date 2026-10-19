import { WebSocket } from 'ws';
import fs from 'fs';
import path from 'path';

const pageId = process.argv[2] || '06FB3DDA4116A463ED0D7463B741C0DB';
const wsUrl = `ws://127.0.0.1:9111/devtools/page/${pageId}`;

const logoPrompt = `Crea e genera un'immagine del logo ufficiale per "opencode-cron".
Stile: design vettoriale minimalista, icona geometrica ad altissima precisione su sfondo bianco puro (#ffffff).
Concetto visivo: una fusione geometrica raffinata tra un cronometro di precisione o astrolabio astronomico (due anelli concentrici sottili, tacche cicliche temporali ordinate a ore 12, 3, 6, 9) e un nucleo centrale intelligente che simboleggia un agente autonomo (un esagono o diamante centrale pulito con un punto focale verde petrolio / deep teal #0c7866 e carbone scuro #191919).
Requisiti:
- Marchio/simbolo centrale pulitissimo, perfettamente isolato su sfondo bianco
- Linee geometriche vettoriali nitide, nessun testo attorno al logo, nessuna ombra sfocata
- Funziona perfettamente come icona per app macOS, favicon e marchio open source`;

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
    console.log('Connecting to Gemini session...');
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

    // 2. Type the prompt using Input.insertText
    console.log('Inserting logo prompt...');
    await send('Input.insertText', { text: logoPrompt });
    await new Promise(r => setTimeout(r, 800));

    // 3. Click the send button
    console.log('Clicking send button...');
    const sendRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector('button[aria-label="Invia messaggio"], button[aria-label*="Invia"]');
        if (btn) {
          btn.click();
          return { clicked: true };
        }
        return { clicked: false };
      })()`,
      returnByValue: true
    });
    console.log('Send button clicked:', sendRes.result?.value);

    // 4. Poll until response is finished and image is generated
    console.log('Waiting for Gemini to generate image (polling every 3s)...');
    let generatedImageSrc = null;

    for (let i = 0; i < 40; i++) {
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
            images: imgs.filter(img => img.src && (img.src.includes('googleusercontent.com') || img.src.includes('blob:') || img.src.includes('data:image')) && img.width > 200)
          };
        })()`,
        returnByValue: true
      });

      const data = checkRes.result?.value;
      console.log(`Poll ${i+1}/40: isStreaming=${data?.isStreaming}, found ${data?.images?.length || 0} large images`);

      if (data?.images?.length > 0) {
        // We found candidate images!
        const lastImg = data.images[data.images.length - 1];
        console.log('Found generated image:', lastImg);
        generatedImageSrc = lastImg.src;
        if (!data.isStreaming) {
          console.log('Streaming finished, image ready!');
          break;
        }
      }

      // Also capture intermediate screenshot
      if (i % 3 === 0) {
        const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 70 });
        fs.writeFileSync('.taste-skill/inspect/gemini-progress.jpg', Buffer.from(shot.data, 'base64'));
      }
    }

    // Capture final state
    const finalShot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
    fs.writeFileSync('.taste-skill/inspect/gemini-final.jpg', Buffer.from(finalShot.data, 'base64'));
    console.log('Saved final screenshot to .taste-skill/inspect/gemini-final.jpg');

    if (generatedImageSrc) {
      console.log('Downloading generated logo image...');
      // Fetch image bytes via Runtime.evaluate inside the browser session so cookies/auth are preserved
      const imgBytesRes = await send('Runtime.evaluate', {
        expression: `(async () => {
          const res = await fetch(${JSON.stringify(generatedImageSrc)});
          const blob = await res.blob();
          return new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        })()`,
        awaitPromise: true,
        returnByValue: true
      });

      const dataUrl = imgBytesRes.result?.value;
      if (dataUrl && dataUrl.startsWith('data:image')) {
        const base64Data = dataUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const outPaths = [
          path.resolve('assets/logo.png'),
          path.resolve('site/assets/img/logo.png')
        ];
        for (const p of outPaths) {
          fs.writeFileSync(p, buffer);
          console.log(`Saved logo to ${p} (${buffer.length} bytes)`);
        }
      }
    }

    ws.close();
  } catch (err) {
    console.error('Error during generation:', err);
    ws.close();
  }
});

