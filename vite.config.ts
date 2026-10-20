import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import { join } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import { activities } from './src/content/actividades.ts'

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

/**
 * Ejecuta las funciones de /api dentro de `vite dev` (en producción las
 * sirve Vercel). /api/foo/bar → api/foo/bar.ts, export del método HTTP.
 * Los módulos que empiezan por "_" son internos y no se exponen.
 */
function devApi(): Plugin {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (!url.pathname.startsWith('/api/')) return next()
        const name = url.pathname.slice(5).replace(/\/$/, '')
        if (!/^[a-z0-9/-]+$/i.test(name) || name.split('/').some((part) => part.startsWith('_'))) {
          res.statusCode = 404
          return res.end()
        }
        try {
          const mod = await server.ssrLoadModule(`/api/${name}.ts`).catch(() => null)
          const fn = mod?.[req.method ?? 'GET'] as ((request: Request) => Promise<Response>) | undefined
          if (!mod) res.statusCode = 404
          else if (typeof fn !== 'function') res.statusCode = 405
          if (!fn) return res.end()

          const hasBody = !['GET', 'HEAD'].includes(req.method ?? 'GET')
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const response = await fn(
            new Request(new URL(req.url ?? '/', `http://${req.headers.host}`), {
              method: req.method,
              headers,
              body: hasBody ? new Uint8Array(await readBody(req)) : undefined,
            }),
          )
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          server.config.logger.error(String(error))
          res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

const SITE = 'https://www.congresodemuseosdecanarias2026.com'

const escapeAttr = (text: string) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Recorta en un límite de palabra, con puntos suspensivos. */
const excerpt = (text: string, max = 160) => (text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max))}…`)

/**
 * Vista previa propia para cada actividad paralela (WhatsApp, redes): los
 * rastreadores no ejecutan JS, así que el build escribe
 * dist/actividades/<id>/index.html, una copia de la portada con su título,
 * descripción e imagen (public/media/compartir/<id>.jpg, 1200×630). Vercel
 * sirve el archivo antes que la reescritura a /index.html; la app abre ahí
 * la ficha de la actividad.
 */
function activitySharePages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'activity-share-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const html = readFileSync(join(outDir, 'index.html'), 'utf8')
      for (const item of activities.items) {
        const title = `${item.title} · ${activities.title} · V Congreso de Museos de Canarias`
        const facts = [item.kind, item.place, item.dates].filter(Boolean).join(' · ')
        const description = `${facts}. ${excerpt(item.body[0]?.paragraphs[0] ?? '')}`
        const url = `${SITE}/actividades/${item.id}`
        const image = `${SITE}/media/compartir/${item.id}.jpg`
        const set = (attr: 'property' | 'name', key: string, value: string) => (page: string) =>
          page.replace(new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`), `$1${escapeAttr(value)}$2`)
        const page = [
          set('name', 'description', description),
          set('property', 'og:url', url),
          set('property', 'og:title', item.title),
          set('property', 'og:description', description),
          set('property', 'og:image', image),
          set('property', 'og:image:type', 'image/jpeg'),
          set('property', 'og:image:alt', item.images?.[0]?.alt ?? item.title),
        ].reduce((acc, fn) => fn(acc), html.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(title)}</title>`))
        const dir = join(outDir, 'actividades', item.id)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), page)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Variables de servidor (.env.local) disponibles para /api en desarrollo.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) process.env[key] ??= value

  return {
    plugins: [react(), tailwindcss(), devApi(), activitySharePages()],
    build: {
      rolldownOptions: {
        output: {
          // three.js en su propio chunk: cacheable aparte del código de la escena.
          manualChunks: (id: string) => (id.includes('/node_modules/three/') ? 'three' : undefined),
        },
      },
    },
  }
})
