/*
 * Altura de pantalla estable (--svh = 1 % del alto de la ventana).
 *
 * Los navegadores dentro de apps (Instagram, Facebook…) cambian el tamaño
 * real de la ventana al ocultar o mostrar su barra mientras se hace scroll.
 * Con las unidades svh, las secciones altas (el umbral mide 360svh) crecían
 * y encogían en mitad del gesto y lo que había debajo (el formulario) se
 * movía solo. En pantallas táctiles, el valor solo se recalcula si cambia el
 * ancho (girar el móvil); en escritorio, con cualquier cambio de tamaño.
 * En los navegadores normales el resultado es el mismo que svh.
 */
export function lockViewportHeight() {
  const root = document.documentElement
  const touch = window.matchMedia('(pointer: coarse)').matches
  let width = window.innerWidth
  const set = () => root.style.setProperty('--svh', `${window.innerHeight / 100}px`)
  set()
  window.addEventListener('resize', () => {
    if (touch && window.innerWidth === width) return
    width = window.innerWidth
    set()
  })
}
