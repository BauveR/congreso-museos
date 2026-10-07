import { PageShell } from '../../components/PageShell'
import { registrationText } from '../../content/inscripcion'
import { AuthProvider } from '../../lib/auth/AuthProvider'
import { useAuth } from '../../lib/auth/context'
import { RegistrationFlow } from './RegistrationFlow'
import { AuthCard } from './AuthCard'
import { SignedInBar } from './SignInPanel'

const t = registrationText

function RegistrationGate() {
  const auth = useAuth()
  if (auth.loading) return <p role="status">…</p>
  if (!auth.user) {
    return (
      <>
        <p className="mb-8 text-lg text-texto-suave">{t.intro}</p>
        <AuthCard />
      </>
    )
  }
  return (
    <>
      <SignedInBar />
      <RegistrationFlow onSaved={() => window.scrollTo({ top: 0 })} />
    </>
  )
}

export default function RegistrationPage() {
  return (
    <AuthProvider>
      <PageShell title={t.pageTitle}>
        <RegistrationGate />
      </PageShell>
    </AuthProvider>
  )
}
