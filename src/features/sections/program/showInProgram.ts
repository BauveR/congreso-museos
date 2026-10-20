/*
 * Enlace de vuelta al programa desde una actividad paralela: el programa
 * elige su día (en móvil se ve un día a la vez) y lleva el scroll a la hora.
 */

const EVENT = 'show-in-program'

export function showInProgram(activityId: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: activityId }))
}

export function onShowInProgram(handler: (activityId: string) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail)
  window.addEventListener(EVENT, listener)
  return () => window.removeEventListener(EVENT, listener)
}
