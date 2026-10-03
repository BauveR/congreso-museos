export type Theme = 'dark' | 'light'

const listeners = new Set<() => void>()

/** El tema vive en `<html data-theme>`; los tokens de color cambian por CSS. */
export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme) {
  if (getTheme() === theme) return
  document.documentElement.dataset.theme = theme
  listeners.forEach((listener) => listener())
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
