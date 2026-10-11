import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'
import { listenForStaleChunks } from './lib/connectivity'

// Tras un despliegue, una pestaña con la versión anterior recarga una vez si le falta un archivo.
listenForStaleChunks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
