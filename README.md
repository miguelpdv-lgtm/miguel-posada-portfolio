# miguelposada.dev

Portafolio de Miguel Posada — HTML, CSS y JavaScript sin frameworks.

## Comandos

```bash
npm install        # solo la primera vez (instala esbuild)
npm run dev        # edita y prueba el código fuente en http://localhost:5173
npm run build      # genera la versión optimizada en dist/
npm run preview    # prueba dist/ con compresión y caché en http://localhost:4173
```

## Publicación

El sitio está en **Vercel**, conectado a este repositorio: cada `git push` a `main` compila y publica. `dist/` no se sube; `vercel.json` define el build, las redirecciones, la caché y las cabeceras.

## Estructura

| Archivo | Contenido |
|---|---|
| `index.html` | Página (SEO, datos estructurados, contenido) |
| `styles.css` | Estilos (incluye las fuentes alojadas en `fonts/`) |
| `main.js` | Animaciones en canvas, scroll, cursor, efectos |
| `boot.js` | Idioma por ubicación y tema, antes de pintar |
| `mascot.js` | Pixel, la mascota (carga diferida) |
| `content/` | Páginas internas en español e inglés |
| `assets/` | Capturas en WebP (480, 800 y 1200 px), íconos y logo |
| `build.mjs` | Minifica e incrusta CSS, une y minifica JS, copia solo lo necesario |

Al cambiar una captura, genera también sus versiones `-480.webp` y `-800.webp`.
Al hacer cambios importantes, actualiza `<lastmod>` en `sitemap.xml`.
