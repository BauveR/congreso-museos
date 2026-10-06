import { PageShell } from '../../components/PageShell'
import { privacyPage } from '../../content/inscripcion'

export default function PrivacyPage() {
  return (
    <PageShell title={privacyPage.title}>
      <p className="mb-8 rounded-xl border border-borde p-4 text-sm text-texto-suave">{privacyPage.updated}</p>
      <div className="flex flex-col gap-8">
        {privacyPage.sections.map(([title, body]) => (
          <section key={title}>
            <h2 className="mb-2 text-xl font-bold">{title}</h2>
            <p className="text-texto-suave">{body}</p>
          </section>
        ))}
      </div>
    </PageShell>
  )
}
