import { Component, type ReactNode } from 'react'
import { isStaleChunkError, reloadForStaleChunk } from '../lib/connectivity'

/**
 * Límite de error con alternativa. Si lo que falla es un archivo de una
 * versión anterior (tras un despliegue), recarga una sola vez; si vuelve a
 * fallar, muestra `fallback` en lugar de dejar la pantalla en blanco.
 */
interface ErrorBoundaryProps {
  fallback: ReactNode
  /** Aviso al contenedor (p. ej. para ocultar un indicador de carga). */
  onError?: () => void
  children: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    if (isStaleChunkError(error) && reloadForStaleChunk()) return
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
