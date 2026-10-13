import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { listenForStaleChunks } from './lib/connectivity'
import { lockViewportHeight } from './lib/stableViewport'

// Tras un despliegue, una pestaña con la versión anterior recarga una vez si le falta un archivo.
listenForStaleChunks()
// Alto de pantalla estable (--svh): sin saltos en los navegadores de apps al ocultar su barra.
lockViewportHeight()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
