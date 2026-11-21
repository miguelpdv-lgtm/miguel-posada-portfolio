// Exporta los cuadros del anuncio (canvas) a un MP4 sin audio, cuadro por cuadro y sin saltos.
// Uso: node video/render.mjs <a|b> <salida.mp4> [fps]
// Requiere el servidor local en http://localhost:5173 (npm run dev) y Microsoft Edge.
import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [id = 'a', out = `anuncio-${id}.mp4`, fpsArg = '30'] = process.argv.slice(2);
const FPS = Number(fpsArg);
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL_ = `http://localhost:5173/video/anuncio.html?v=${id}`;
const sleep = ms => new Promise(r => setTimeout(r, ms));

const port = 9500 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), 'pixel-render-'));
const browser = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${port}`, '--disable-gpu', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

let ws, seq = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => {
  const i = ++seq; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params }));
});
const evaluate = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};

try {
  let targets;
  for (let k = 0; k < 60 && !targets; k++) { try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(250); } }
  ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => (ws.onopen = r));
  ws.onmessage = e => { const m = JSON.parse(e.data); const p = pending.get(m.id); if (p) { pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); } };

  await send('Page.navigate', { url: URL_ });
  for (let k = 0; k < 80; k++) { try { if (await evaluate('window.READY.then(() => true)')) break; } catch { } await sleep(250); }
  const meta = await evaluate('window.META');
  writeFileSync(out.replace(/\.mp4$/, '.meta.json'), JSON.stringify({ ...meta, FPS }, null, 2));

  const frames = Math.round(meta.DUR * FPS);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = 0; f < frames; f++) {
    const dataUrl = await evaluate(`window.frameJPEG(${(f / FPS).toFixed(5)})`);
    const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 90 === 0) process.stdout.write(`  cuadro ${f}/${frames}\r`);
  }
  ff.stdin.end();
  await new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg salió con ' + c)))));
  console.log(`\n${out}: ${frames} cuadros en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
} finally {
  try { ws && ws.close(); } catch { }
  browser.kill();
}
