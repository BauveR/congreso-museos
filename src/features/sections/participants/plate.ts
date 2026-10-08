import type { Participant } from '../../../content/types'

/** Con más autores se muestran los dos primeros y «y N más». */
const MAX_NAMES = 3

/** Ancho medio de un carácter de Kola (en em; medido en la fuente, con margen). */
const CHAR_WIDTH = 0.58
/** Alto del área del nombre respecto a su ancho (tarjeta 3:4 menos el relleno). */
const AREA_HEIGHT = 135
/** Parte del área que llega a ocupar el texto (los cortes de línea dejan huecos). */
const FILL = 0.5
/** Tope para nombres muy cortos. */
const MAX_SIZE = 26

export function visibleNames(item: Participant): { names: string[]; hidden: number } {
  const all = item.authors.map((a) => a.name)
  if (item.allNames || all.length <= MAX_NAMES) return { names: all, hidden: 0 }
  return { names: all.slice(0, MAX_NAMES - 1), hidden: all.length - (MAX_NAMES - 1) }
}

/**
 * Tamaño del nombre (en cqw del área) para que llene el hueco de la foto sin
 * desbordar: lo limita la palabra más larga (ancho) y la cantidad de texto (área).
 */
export function plateFontSize(names: string[]): string {
  const words = names.flatMap((n) => n.split(/\s+/))
  const longest = Math.max(1, ...words.map((w) => w.length))
  const chars = Math.max(1, names.join(' ').length)
  const byWidth = 100 / (longest * CHAR_WIDTH)
  const byArea = Math.sqrt((100 * AREA_HEIGHT * FILL) / (chars * CHAR_WIDTH))
  return `${Math.min(byWidth, byArea, MAX_SIZE).toFixed(2)}cqw`
}

export function hasDetails(item: Participant): boolean {
  return Boolean(item.abstract?.length || item.sharedBio?.length) || item.authors.some((a) => a.bio?.length)
}
