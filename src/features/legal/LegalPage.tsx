import { PageShell } from '../../components/PageShell'
import type { LegalPageContent } from '../../content/legales'

/** Página legal (privacidad, aviso legal, accesibilidad): título, fecha y secciones. */
export function LegalPage({ content }: { content: LegalPageContent }) {
  return (
    <PageShell title={content.title}>
      <p className="mb-8 text-sm text-texto-suave">{content.updated}</p>
      <div className="flex flex-col gap-8">
        {content.sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="mb-2 text-xl font-bold">{title}</h2>
            <p className="text-texto-suave">{body}</p>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
