import { site } from '../../../content/site'

export interface ActivitySlot {
  /** Fecha ISO del día. */
  date: string
  /** «Jueves 19 de noviembre». */
  day: string
  time: string
}

const weekday = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long' })
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** Días y horas en que una actividad aparece en el programa (sale de programa.ts, no se repite a mano). */
export function scheduleOf(activityId: string): ActivitySlot[] {
  return site.program.days.flatMap((d) =>
    d.parts.flatMap((part) =>
      part.items
        .filter((item) =>
          item.entries.some(
            (entry) => entry.activity === activityId || entry.list?.some((place) => typeof place !== 'string' && place.activity === activityId),
          ),
        )
        .map((item) => ({ date: d.date, day: capitalize(`${weekday(d.date)} ${d.label}`), time: item.time })),
    ),
  )
}
