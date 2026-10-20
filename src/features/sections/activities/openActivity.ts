/*
 * Enlace del programa a una actividad paralela: el programa pide abrirla y
 * la sección Actividades lleva el scroll a su tarjeta y la despliega.
 */

const EVENT = 'open-activity'

/** Ancla de cada actividad (también sirve como enlace normal). */
export const activityAnchor = (id: string) => `actividad-${id}`

export function openActivity(id: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: id }))
}

export function onOpenActivity(handler: (id: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
