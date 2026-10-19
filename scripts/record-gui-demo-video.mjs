#!/usr/bin/env node
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';
import { Browser, sleep } from '/Users/luigimacmini/.gemini/config/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const ROOT = resolve(process.cwd());
const FRAMES_DIR = join(ROOT, 'scripts', '.gui-frames');
const HTML_FILE = 'file://' + join(ROOT, 'scripts', 'render-gui-demo-frames.html');

const DURATION_SEC = 20.0;
const FPS = 15;
const TOTAL_FRAMES = Math.floor(DURATION_SEC * FPS);

async function main() {
  console.log(`[gui-demo-recorder] Starting capture: ${TOTAL_FRAMES} frames @ ${FPS} fps (~${DURATION_SEC}s)...`);

  if (existsSync(FRAMES_DIR)) {
    rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  mkdirSync(FRAMES_DIR, { recursive: true });

  const browser = await Browser.launch();
  const page = await browser.newPage({ width: 1280, height: 720, dsf: 1 });
  await page.goto(HTML_FILE);
  await sleep(600);

  const startMs = Date.now();
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const t = i / FPS;
    await page.eval(`window.renderFrame(${t})`);
    const shot = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    const buf = Buffer.from(shot.data, 'base64');
    const filename = join(FRAMES_DIR, `frame_${String(i).padStart(4, '0')}.jpg`);
    writeFileSync(filename, buf);

    if (i % 30 === 0 || i === TOTAL_FRAMES - 1) {
      const pct = Math.round((i / (TOTAL_FRAMES - 1)) * 100);
      console.log(`[gui-demo-recorder] Rendered frame ${i}/${TOTAL_FRAMES} (${pct}%)`);
    }
  }

  await browser.close();
  const captureTime = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`[gui-demo-recorder] All frames captured in ${captureTime}s! Encoding video with ffmpeg...`);

  // Ensure output dirs exist
  mkdirSync(join(ROOT, 'site', 'assets', 'img'), { recursive: true });
  mkdirSync(join(ROOT, 'assets'), { recursive: true });

  const siteImgDir = join(ROOT, 'site', 'assets', 'img');
  const assetsDir = join(ROOT, 'assets');

  // 1. MP4 (H.264)
  console.log('[gui-demo-recorder] Encoding MP4 (H.264)...');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart "${siteImgDir}/gui-demo.mp4"`,
    { stdio: 'inherit' }
  );
  execSync(`cp "${siteImgDir}/gui-demo.mp4" "${assetsDir}/gui-demo.mp4"`);

  // 2. WebM (VP9)
  console.log('[gui-demo-recorder] Encoding WebM (VP9)...');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -c:v libvpx-vp9 -b:v 0 -crf 28 "${siteImgDir}/gui-demo.webm"`,
    { stdio: 'inherit' }
  );

  // 3. Poster Image (Frame 15 at ~1s in)
  console.log('[gui-demo-recorder] Generating poster image...');
  execSync(`cp "${FRAMES_DIR}/frame_0015.jpg" "${siteImgDir}/gui-demo-poster.jpg"`);
  execSync(`cp "${siteImgDir}/gui-demo-poster.jpg" "${assetsDir}/gui-demo-poster.jpg"`);

  // 4. Animated GIF
  console.log('[gui-demo-recorder] Generating animated GIF with palettegen...');
  const palettePath = join(FRAMES_DIR, 'palette.png');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -vf "fps=${FPS},scale=860:-1:flags=lanczos,palettegen=max_colors=128" "${palettePath}"`,
    { stdio: 'inherit' }
  );
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -i "${palettePath}" -lavfi "fps=${FPS},scale=860:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3" "${siteImgDir}/gui-demo.gif"`,
    { stdio: 'inherit' }
  );
  execSync(`cp "${siteImgDir}/gui-demo.gif" "${assetsDir}/gui-demo.gif"`);

  // Cleanup frames
  rmSync(FRAMES_DIR, { recursive: true, force: true });

  console.log('\n[gui-demo-recorder] Successfully generated:');
  console.log('  -> ' + join(siteImgDir, 'gui-demo.mp4'));
  console.log('  -> ' + join(siteImgDir, 'gui-demo.webm'));
  console.log('  -> ' + join(siteImgDir, 'gui-demo.gif'));
  console.log('  -> ' + join(siteImgDir, 'gui-demo-poster.jpg'));
}

main().catch((err) => {
  console.error('[gui-demo-recorder] Fatal error:', err);
  process.exit(1);
});

