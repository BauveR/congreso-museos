/*
 * Enlace del programa a una actividad paralela: el programa pide abrirla y
 * la sección Actividades lleva el scroll a su tarjeta y la despliega.
 */

const EVENT = 'open-activity'

/** Ancla de cada tarjeta. */
export const activityAnchor = (id: string) => `actividad-${id}`

/** Dirección para compartir cada actividad (con su propia vista previa en WhatsApp). */
export const activityPath = (id: string) => `/actividades/${id}`

/** Id de la actividad si la dirección es la de una actividad. */
export const activityFromPath = (path: string) => /^\/actividades\/([a-z0-9-]+)\/?$/.exec(path)?.[1] ?? null

export function openActivity(id: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: id }))
}

export function onOpenActivity(handler: (id: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
