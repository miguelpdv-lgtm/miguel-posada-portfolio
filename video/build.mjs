// Genera los video anuncios completos: cuadros → audio → MP4 final (con y sin voz) + .srt
// Uso: npm run videos            (requiere `npm run dev` corriendo en otra terminal)
//      node video/build.mjs a    (solo el video vertical)
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';

const VIDEOS = {
  a: 'pixel-vertical-9x16',
  b: 'pixel-horizontal-16x9',
};
const ids = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(VIDEOS);
const OUT = 'google-ads/videos', TMP = `${OUT}/_build`;
mkdirSync(TMP, { recursive: true });
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });

for (const id of ids) {
  const name = VIDEOS[id];
  console.log(`\n=== ${name} ===`);
  run('node', ['video/render.mjs', id, `${TMP}/${id}.mp4`, '30']);
  run('python', ['video/make_audio.py', `${TMP}/${id}.meta.json`]);
  for (const [mix, suffix] of [['voz', 'con-voz'], ['sinvoz', 'sin-voz']]) {
    run('ffmpeg', ['-y', '-loglevel', 'error', '-i', `${TMP}/${id}.mp4`, '-i', `${TMP}/${id}.${mix}.wav`,
      '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
      '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'aac', '-b:a', '192k',
      '-shortest', '-movflags', '+faststart', `${OUT}/${name}-${suffix}.mp4`]);
  }
  copyFileSync(`${TMP}/${id}.srt`, `${OUT}/${name}.srt`);
  console.log(`listo: ${OUT}/${name}-con-voz.mp4, ${name}-sin-voz.mp4, ${name}.srt`);
}
