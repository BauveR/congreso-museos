/**
 * Punto de zoom dentro de un trazo de la palabra, para que al ampliar la
 * letra llene la pantalla (y no el hueco entre letras). Se calcula con la
 * fuente real del navegador (la del sistema varía entre plataformas):
 * dibuja la palabra en un canvas, recorre la fila central desde el centro
 * hasta encontrar tinta y devuelve el punto medio de ese trazo.
 */
export function strokeOrigin(el: HTMLElement): string {
  const fallback = '50% 50%'
  const { width, height } = el.getBoundingClientRect()
  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width)
  canvas.height = Math.ceil(height)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx || !canvas.width || !canvas.height) return fallback

  const style = getComputedStyle(el)
  const text = style.textTransform === 'uppercase' ? (el.textContent ?? '').toUpperCase() : (el.textContent ?? '')
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const y = Math.round(canvas.height / 2)
  const row = ctx.getImageData(0, y, canvas.width, 1).data
  const inked = (x: number) => (row[x * 4 + 3] ?? 0) > 128
  const center = Math.round(canvas.width / 2)
  for (let offset = 0; offset < center; offset++) {
    for (const start of [center + offset, center - offset]) {
      if (!inked(start)) continue
      const step = start >= center ? 1 : -1
      let end = start
      while (inked(end + step)) end += step
      return `${(start + end) / 2}px ${y}px`
    }
  }
  return fallback
}
