"""
Genera la banda sonora de un anuncio a partir de su .meta.json:
  - voz de Pixel (Windows SAPI, Sabina es-MX) ajustada a cada subtítulo
  - música original sintetizada (112 BPM)
  - efectos de sonido sintetizados en los tiempos del guion
  - subtítulos .srt
Salidas: <base>.voz.wav (mezcla completa) y <base>.sinvoz.wav (música + efectos), <base>.srt

Uso: python video/make_audio.py google-ads/videos/_build/a.meta.json
"""
import json, os, subprocess, sys, tempfile, wave
import numpy as np
from scipy.signal import butter, sosfilt, resample_poly

SR = 48000
rng = np.random.default_rng(7)

# ---------------------------------------------------------------- utilidades
def secs(n): return np.arange(int(n * SR)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'high', fs=SR, output='sos'), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], 'band', fs=SR, output='sos'), x)
def expdec(n, tau): return np.exp(-secs(n) / tau)
def note(m): return 440.0 * 2 ** ((m - 69) / 12)
def add(buf, x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= buf.shape[1] or i + len(x) <= 0: return
    j = min(buf.shape[1], i + len(x)); x = x[:j - i]
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[0, i:j] += x * gain * l * 1.414; buf[1, i:j] += x * gain * r * 1.414

def write_wav(path, stereo):
    s = np.clip(stereo, -1, 1)
    data = (s.T * 32767).astype('<i2').tobytes()
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data)

def read_wav_mono(path):
    with wave.open(path, 'rb') as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = np.frombuffer(w.readframes(n), dtype='<i2').astype(np.float64) / 32768
    if ch > 1: raw = raw.reshape(-1, ch).mean(1)
    if sr != SR:
        g = np.gcd(SR, sr); raw = resample_poly(raw, SR // g, sr // g)
    return raw

# ---------------------------------------------------------------- efectos
def sfx_whoosh(d=.45, lo=300, hi=3500):
    n = secs(d); x = rng.standard_normal(len(n))
    out = np.zeros_like(x); seg = 512
    for k in range(0, len(x), seg):  # barrido de filtro
        p = k / len(x); f = lo + (hi - lo) * np.sin(p * np.pi) ** 1.5
        out[k:k + seg] = bp(x[max(0, k - 2048):k + seg], f * .7, min(f * 1.4, SR / 2 - 100))[-len(x[k:k + seg]):]
    return out * np.sin(np.pi * n / d) ** 2 * .5
def sfx_swoosh(): return sfx_whoosh(.28, 1200, 6000) * .7
def sfx_land(big=True):
    n = secs(.35 if big else .22)
    f = 95 * np.exp(-n * 9) + 38
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * expdec(len(n) / SR, .12)
    click = lp(rng.standard_normal(len(n)), 1800) * expdec(len(n) / SR, .02)
    return (body + click * .4) * (1 if big else .55)
def sfx_pop():
    n = secs(.14); f = 1100 * np.exp(-n * 30) + 380
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * expdec(len(n) / SR, .045) * .8
def sfx_ding(base=1318.5):
    n = secs(1.4); x = np.zeros(len(n))
    for k, (m, a) in enumerate([(1, 1), (2.01, .45), (3.02, .22), (4.2, .12)]):
        x += a * np.sin(2 * np.pi * base * m * n) * expdec(len(n) / SR, .55 / (1 + k * .7))
    return x * .45
def sfx_shine():
    x = np.zeros(int(.7 * SR))
    for k, m in enumerate([88, 91, 95, 100]):
        s = sfx_ding(note(m))[: int(.5 * SR)] * .5
        i = int(k * .06 * SR); x[i:i + len(s)] += s[: len(x) - i]
    return x
def sfx_type(d):
    x = np.zeros(int(d * SR)); t = 0.0
    while t < d - .05:
        c = hp(rng.standard_normal(int(.018 * SR)), 2500) * expdec(int(.018 * SR) / SR, .004)
        i = int(t * SR); x[i:i + len(c)] += c * rng.uniform(.4, .8)
        t += rng.uniform(.055, .11)
    return x * .6
def sfx_boing():
    n = secs(.42); f = 220 + 480 * (1 - np.exp(-n * 12)) + 25 * np.sin(2 * np.pi * 18 * n)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * expdec(len(n) / SR, .16) * .6
def sfx_confetti():
    x = np.zeros(int(1.6 * SR))
    for _ in range(46):
        t = rng.uniform(0, 1.2); f = rng.uniform(2200, 5200)
        s = np.sin(2 * np.pi * f * secs(.06)) * expdec(int(.06 * SR) / SR, .015)
        i = int(t * SR); x[i:i + len(s)] += s * rng.uniform(.15, .35)
    burst = bp(rng.standard_normal(int(.35 * SR)), 2000, 8000) * expdec(int(.35 * SR) / SR, .09) * .5
    x[:len(burst)] += burst
    return x
def sfx_step():
    n = secs(.09); return (np.sin(2 * np.pi * 70 * n) * .7 + lp(rng.standard_normal(len(n)), 900) * .5) * expdec(len(n) / SR, .025) * .55

SFX = {
    'whoosh': lambda a: sfx_whoosh(), 'swoosh': lambda a: sfx_swoosh(), 'land': lambda a: sfx_land(True), 'land_s': lambda a: sfx_land(False),
    'pop': lambda a: sfx_pop(), 'ding': lambda a: sfx_ding(), 'shine': lambda a: sfx_shine(), 'type': lambda a: sfx_type(a[0] if a else 1.5),
    'boing': lambda a: sfx_boing(), 'confetti': lambda a: sfx_confetti(), 'step': lambda a: sfx_step(),
}

# ---------------------------------------------------------------- música
def music(dur):
    bpm = 112; beat = 60 / bpm; bar = beat * 4
    buf = np.zeros((2, int((dur + 2) * SR)))
    prog = [(57, [57, 60, 64]), (53, [53, 57, 60]), (48, [48, 52, 55]), (55, [55, 59, 62])]  # Am F C G
    nbars = int(np.ceil(dur / bar)) + 1
    kick_env = np.zeros(buf.shape[1])
    for b in range(nbars):
        t0 = b * bar; root, chord = prog[b % 4]
        # pad
        n = secs(bar + .4); pad = np.zeros(len(n))
        for m in chord:
            for det in (-.07, .07):
                f = note(m + 12) * 2 ** (det / 12)
                pad += sum(np.sin(2 * np.pi * f * h * n) / h for h in (1, 2, 3, 4))
        envp = np.minimum(1, n / .25) * np.minimum(1, (bar + .4 - n) / .4)
        add(buf, lp(pad * envp, 1600) * .05, t0, pan=0)
        # bajo (corcheas)
        for k in range(8):
            nb = secs(beat / 2 * .9); f = note(root - 12)
            s = (np.sin(2 * np.pi * f * nb) + .25 * np.sign(np.sin(2 * np.pi * f * nb))) * expdec(len(nb) / SR, .12)
            add(buf, lp(s, 700) * .22, t0 + k * beat / 2)
        # arpegio (semicorcheas)
        pat = [0, 1, 2, 1, 0, 2, 1, 2]
        for k in range(16):
            m = chord[pat[k % 8]] + 24 + (12 if k % 8 == 5 else 0)
            na = secs(.22); f = note(m)
            s = (2 / np.pi * np.arcsin(np.sin(2 * np.pi * f * na)) + .3 * np.sin(4 * np.pi * f * na)) * expdec(len(na) / SR, .07)
            add(buf, lp(s, 4200) * .075, t0 + k * beat / 4, pan=-.45 if k % 2 else .45)
        # batería (entra en el compás 2)
        if b >= 1:
            for k in range(4):
                tk = t0 + k * beat
                nk = secs(.25); fk = 120 * np.exp(-nk * 22) + 45
                kick = np.sin(2 * np.pi * np.cumsum(fk) / SR) * expdec(len(nk) / SR, .11)
                add(buf, kick * .55, tk)
                i = int(tk * SR); j = min(len(kick_env), i + int(.22 * SR))
                if j > i: kick_env[i:j] = np.maximum(kick_env[i:j], np.exp(-np.arange(j - i) / SR / .09))
                hat = hp(rng.standard_normal(int(.045 * SR)), 7000) * expdec(int(.045 * SR) / SR, .012)
                add(buf, hat * .16, tk + beat / 2, pan=.25)
                if k in (1, 3):
                    cl = bp(rng.standard_normal(int(.16 * SR)), 900, 4000) * expdec(int(.16 * SR) / SR, .045)
                    add(buf, cl * .22, tk, pan=-.1)
    buf = buf[:, : int(dur * SR)]
    # bombeo con el bombo (sidechain suave)
    duck = 1 - .35 * kick_env[: buf.shape[1]]
    buf *= duck
    # entrada y salida
    n = buf.shape[1]; fade_in = np.minimum(1, np.arange(n) / (SR * .35)); fade_out = np.minimum(1, (n - np.arange(n)) / (SR * 1.1))
    return buf * fade_in * fade_out

# ---------------------------------------------------------------- voz (SAPI)
PS = r'''
Add-Type -AssemblyName System.Speech
$s = New-Object System.Speech.Synthesis.SpeechSynthesizer
$s.SelectVoice('Microsoft Sabina Desktop')
$s.Rate = {rate}
$fmt = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(22050, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
$s.SetOutputToWaveFile('{out}', $fmt)
$s.Speak([IO.File]::ReadAllText('{txt}', [Text.Encoding]::UTF8))
$s.Dispose()
'''
def tts(text, rate, tmp):
    txt = os.path.join(tmp, 'line.txt'); raw = os.path.join(tmp, 'raw.wav'); fx = os.path.join(tmp, 'fx.wav')
    open(txt, 'w', encoding='utf-8').write(text)
    subprocess.run(['powershell', '-NoProfile', '-Command', PS.format(rate=rate, out=raw, txt=txt)], check=True, capture_output=True)
    # personaje: tono más alto, brillo y un poco de "sala"
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af',
                    'rubberband=pitch=1.13,highpass=f=110,equalizer=f=3200:t=q:w=1.2:g=3,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,aecho=0.8:0.4:28:0.10',
                    '-ar', str(SR), fx], check=True)
    x = read_wav_mono(fx)
    idx = np.where(np.abs(x) > .02)[0]  # recorta silencios
    if len(idx): x = x[max(0, idx[0] - 400): idx[-1] + 2400]
    return x

def voice_track(subs, dur):
    buf = np.zeros((2, int(dur * SR))); env = np.zeros(buf.shape[1])
    with tempfile.TemporaryDirectory() as tmp:
        for s in subs:
            text = s.get('voice') or s['text']; window = s['b'] - s['a'] - .3
            for rate in (1, 2, 3, 4, 5, 6):
                x = tts(text, rate, tmp)
                if len(x) / SR <= window: break
            start = s['a'] + .1
            print(f'  voz {start:5.2f}s  {len(x)/SR:4.2f}s / {window:4.2f}s  rate={rate}  "{text}"')
            add(buf, x / (np.abs(x).max() + 1e-9) * .9, start)
            i = int(start * SR); env[i:i + len(x)] = 1
    # envolvente suave para bajar la música
    k = int(.15 * SR); env = np.convolve(env, np.ones(k) / k, mode='same')
    return buf, np.clip(env, 0, 1)

# ---------------------------------------------------------------- srt
def srt(subs, path):
    fmt = lambda t: f'{int(t//3600):02}:{int(t%3600//60):02}:{int(t%60):02},{int(round(t%1*1000)):03}'
    with open(path, 'w', encoding='utf-8') as f:
        for i, s in enumerate(subs, 1):
            f.write(f"{i}\n{fmt(s['a'])} --> {fmt(s['b'])}\n{s['text']}\n\n")

# ---------------------------------------------------------------- principal
def main(meta_path):
    meta = json.load(open(meta_path, encoding='utf-8'))
    dur = meta['DUR']; base = meta_path.replace('.meta.json', '')
    print(f'{os.path.basename(base)}: {dur}s')
    mus = music(dur)
    fx = np.zeros((2, int(dur * SR)))
    for e in meta['SFX']:
        kind, t, *args = e
        pan = .3 if kind in ('pop', 'whoosh') and int(t * 10) % 2 else -.3 if kind in ('pop', 'whoosh') else 0
        add(fx, SFX[kind](args), t, gain=.55, pan=pan)
    voz, env = voice_track(meta['SUBS'], dur)
    norm = lambda x, p: x / (np.abs(x).max() + 1e-9) * p
    mus, fx = norm(mus, .5), norm(fx, .55)
    ducked = mus * (1 - .6 * env)
    con_voz = ducked + fx * .9 + voz
    sin_voz = mus * .95 + fx
    write_wav(base + '.voz.wav', norm(con_voz, .95))
    write_wav(base + '.sinvoz.wav', norm(sin_voz, .95))
    srt(meta['SUBS'], base + '.srt')
    print('  listo:', base + '.voz.wav', base + '.sinvoz.wav', base + '.srt')

if __name__ == '__main__':
    for p in sys.argv[1:]: main(p)
