/*
 * Datos del congreso compartidos por la web y los correos (una sola fuente).
 */

export const EVENT = {
  name: 'V Congreso de Museos de Canarias',
  headline: 'Museos en un tiempo de cambios. Diagnosis y perspectiva',
  dateLabel: '19-21 de noviembre de 2026',
  dateTime: '2026-11-19',
  place: 'San Sebastián de La Gomera',
  /** Web pública (enlaces absolutos de los correos). */
  url: 'https://www.congresodemuseosdecanarias2026.com',
  venue: {
    name: 'Bancal Hotel & Spa',
    address: ['C. Lomo de Clavo, 188', '38801 San Sebastián de la Gomera'],
    mapsQuery: 'Bancal Hotel & Spa, C. Lomo de Clavo 188, 38801 San Sebastián de la Gomera',
  },
} as const

/** URL universal de Google Maps (abre la app en el móvil o la web en el ordenador). */
export const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

/**
 * Colores de los días (de claro a oscuro, validados para distinguirse
 * también con daltonismo; texto ≥ 5,6:1 en cada uno). Píldoras del
 * formulario y del correo de confirmación. A partir del cuarto se repite.
 */
export const DAY_COLORS = [
  { bg: '#d1e132', text: '#111311' },
  { bg: '#6fb86a', text: '#111311' },
  { bg: '#2f6b45', text: '#f2f3ee' },
] as const

export const dayColor = (index: number) => DAY_COLORS[index % DAY_COLORS.length]!
