import { site } from '../../../content/site'
import type { Participant } from '../../../content/types'

interface ParticipantDetailsProps {
  item: Participant
  /** Escritorio: resumen y semblanzas en dos columnas. */
  columns?: boolean
  /** Bloques normales que se reparten entre las columnas CSS del contenedor. */
  flow?: boolean
}

/** Texto completo de un participante: resumen y semblanzas. */
export function ParticipantDetails({ item, columns = false, flow = false }: ParticipantDetailsProps) {
  const { participants } = site
  const bios = item.authors.filter((a) => a.bio?.length)
  const hasBios = bios.length > 0 || Boolean(item.sharedBio?.length)
  const label = 'mb-3 text-xs font-bold tracking-widest text-texto-suave uppercase'

  return (
    <div className={flow ? 'space-y-8' : `grid gap-10 ${columns ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12' : ''}`}>
      {item.abstract && (
        <section>
          <h4 className={label}>{participants.abstractLabel}</h4>
          <div className={flow ? 'space-y-3 text-[0.9375rem] leading-relaxed' : 'flex max-w-prose flex-col gap-4 text-base leading-relaxed'}>
            {item.abstract.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {hasBios && (
        <section>
          <h4 className={label}>{participants.bioLabel}</h4>
          {item.sharedBio?.map((p) => (
            <p key={p.slice(0, 40)} className="mb-5 max-w-prose text-sm leading-relaxed text-texto-suave">
              {p}
            </p>
          ))}
          <dl className={flow ? 'space-y-4 text-sm leading-relaxed text-texto-suave' : 'flex max-w-prose flex-col gap-5 text-sm leading-relaxed text-texto-suave'}>
            {bios.map((author) => (
              <div key={author.name}>
                <dt className="font-semibold text-texto">{author.name}</dt>
                {author.bio?.map((p) => (
                  <dd key={p.slice(0, 40)} className="mt-1">
                    {p}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  )
}
