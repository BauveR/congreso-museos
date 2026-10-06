import type { IncomingMessage } from 'node:http'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

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

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Variables de servidor (.env.local) disponibles para /api en desarrollo.
  for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) process.env[key] ??= value

  return {
    plugins: [react(), tailwindcss(), devApi()],
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
