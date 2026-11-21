# miguelposada.dev

Portafolio de Miguel Posada — HTML, CSS y JavaScript sin frameworks.

## Comandos

```bash
npm install        # solo la primera vez (instala esbuild)
npm run dev        # edita y prueba el código fuente en http://localhost:5173
npm run build      # genera la versión optimizada en dist/
npm run preview    # prueba dist/ con compresión y caché en http://localhost:4173
```

## Qué publicar

Publica **la carpeta `dist/`** (nunca la raíz):

- **Vercel:** conecta el repositorio; `vercel.json` ya indica `npm run build` y la carpeta `dist`.
- **Netlify / Cloudflare Pages:** comando de build `npm run build`, carpeta de publicación `dist`. Las cabeceras de caché van en `dist/_headers`.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Página (SEO, datos estructurados, contenido) |
| `styles.css` | Estilos (incluye las fuentes alojadas en `fonts/`) |
| `main.js` | Animaciones en canvas, scroll, cursor, efectos |
| `mascot.js` | Pixel, la mascota |
| `assets/` | Capturas en WebP (480, 800 y 1200 px), íconos y logo |
| `build.mjs` | Minifica e incrusta CSS, une y minifica JS, copia solo lo necesario |

Al cambiar una captura, genera también sus versiones `-480.webp` y `-800.webp`.
Al hacer cambios importantes, actualiza `<lastmod>` en `sitemap.xml`.
