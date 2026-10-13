import { afterEach, describe, expect, it, vi } from 'vitest'
import { lockViewportHeight } from './stableViewport'

/* Alto de pantalla estable: la barra de una app no debe mover la página. */

function fakeScreen({ width, height, touch }: { width: number; height: number; touch: boolean }) {
  const values: Record<string, string> = {}
  const listeners: (() => void)[] = []
  const win = {
    innerWidth: width,
    innerHeight: height,
    matchMedia: () => ({ matches: touch }),
    addEventListener: (_type: string, fn: () => void) => listeners.push(fn),
  }
  vi.stubGlobal('window', win)
  vi.stubGlobal('document', { documentElement: { style: { setProperty: (k: string, v: string) => void (values[k] = v) } } })
  return {
    svh: () => values['--svh'],
    resize: (next: { width?: number; height?: number }) => {
      Object.assign(win, { innerWidth: next.width ?? win.innerWidth, innerHeight: next.height ?? win.innerHeight })
      listeners.forEach((fn) => fn())
    },
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('alto de pantalla estable (--svh)', () => {
  it('en el móvil, la barra de la app (solo cambia el alto) no lo mueve', () => {
    const screen = fakeScreen({ width: 390, height: 700, touch: true })
    lockViewportHeight()
    expect(screen.svh()).toBe('7px')
    screen.resize({ height: 760 })
    screen.resize({ height: 700 })
    expect(screen.svh()).toBe('7px')
  })

  it('al girar el móvil (cambia el ancho) sí se recalcula', () => {
    const screen = fakeScreen({ width: 390, height: 700, touch: true })
    lockViewportHeight()
    screen.resize({ width: 700, height: 390 })
    expect(screen.svh()).toBe('3.9px')
  })

  it('en escritorio sigue al tamaño de la ventana', () => {
    const screen = fakeScreen({ width: 1400, height: 900, touch: false })
    lockViewportHeight()
    screen.resize({ height: 800 })
    expect(screen.svh()).toBe('8px')
  })
})
