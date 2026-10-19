#!/usr/bin/env node
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';
import { Browser, sleep } from '/Users/luigimacmini/.gemini/config/skills/design-taste-frontend/scripts/lib/cdp.mjs';

const ROOT = resolve(process.cwd());
const FRAMES_DIR = join(ROOT, 'scripts', '.frames');
const HTML_FILE = 'file://' + join(ROOT, 'scripts', 'render-demo-frames.html');

const DURATION_SEC = 21.0;
const FPS = 15;
const TOTAL_FRAMES = Math.floor(DURATION_SEC * FPS);

async function main() {
  console.log(`[demo-recorder] Starting capture: ${TOTAL_FRAMES} frames @ ${FPS} fps (~${DURATION_SEC}s)...`);

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
    await page.eval(`window.renderFrameAtTime(${t})`);
    const shot = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    const buf = Buffer.from(shot.data, 'base64');
    const filename = join(FRAMES_DIR, `frame_${String(i).padStart(4, '0')}.jpg`);
    writeFileSync(filename, buf);

    if (i % 30 === 0 || i === TOTAL_FRAMES - 1) {
      const pct = Math.round((i / (TOTAL_FRAMES - 1)) * 100);
      console.log(`[demo-recorder] Rendered frame ${i}/${TOTAL_FRAMES} (${pct}%)`);
    }
  }

  await browser.close();
  const captureTime = ((Date.now() - startMs) / 1000).toFixed(1);
  console.log(`[demo-recorder] All frames captured in ${captureTime}s! Encoding video with ffmpeg...`);

  // Ensure output dirs exist
  mkdirSync(join(ROOT, 'site', 'assets', 'img'), { recursive: true });
  mkdirSync(join(ROOT, 'assets'), { recursive: true });

  const siteImgDir = join(ROOT, 'site', 'assets', 'img');
  const assetsDir = join(ROOT, 'assets');

  // 1. MP4 (H.264)
  console.log('[demo-recorder] Encoding MP4 (H.264)...');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -c:v libx264 -pix_fmt yuv420p -crf 20 -movflags +faststart "${siteImgDir}/demo.mp4"`,
    { stdio: 'inherit' }
  );
  execSync(`cp "${siteImgDir}/demo.mp4" "${assetsDir}/demo.mp4"`);

  // 2. WebM (VP9)
  console.log('[demo-recorder] Encoding WebM (VP9)...');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -c:v libvpx-vp9 -b:v 1200k -crf 28 "${siteImgDir}/demo.webm"`,
    { stdio: 'inherit' }
  );

  // 3. Poster frame (around 15s)
  const posterSource = join(FRAMES_DIR, `frame_${String(Math.floor(14.5 * FPS)).padStart(4, '0')}.jpg`);
  if (existsSync(posterSource)) {
    execSync(`cp "${posterSource}" "${siteImgDir}/demo-poster.jpg"`);
    execSync(`cp "${posterSource}" "${assetsDir}/demo-poster.jpg"`);
  }

  // 4. Optimized animated GIF for GitHub README (scaled to 860px width for fast loading)
  console.log('[demo-recorder] Generating optimized GIF for GitHub README...');
  execSync(
    `ffmpeg -y -framerate ${FPS} -i "${FRAMES_DIR}/frame_%04d.jpg" -vf "scale=860:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128:reserve_transparent=0[p];[s1][p]paletteuse=dither=bayer" "${assetsDir}/demo.gif"`,
    { stdio: 'inherit' }
  );
  execSync(`cp "${assetsDir}/demo.gif" "${siteImgDir}/demo.gif"`);

  // Cleanup temp frames
  rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log('[demo-recorder] Finished successfully! Created:');
  console.log(`  - ${siteImgDir}/demo.mp4`);
  console.log(`  - ${siteImgDir}/demo.webm`);
  console.log(`  - ${siteImgDir}/demo-poster.jpg`);
  console.log(`  - ${assetsDir}/demo.mp4`);
  console.log(`  - ${assetsDir}/demo.gif`);
}

main().catch((err) => {
  console.error('[demo-recorder] Error:', err);
  process.exit(1);
});

