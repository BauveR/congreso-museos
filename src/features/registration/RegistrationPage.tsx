import { ConnectionNotice } from '../../components/ConnectionNotice'
import { PageShell } from '../../components/PageShell'
import { DiagnosticsButton } from '../admin/DiagnosticsButton'
import { accessText, registrationText } from '../../content/inscripcion'
import { AuthProvider } from '../../lib/auth/AuthProvider'
import { useAuth } from '../../lib/auth/context'
import { useLoadPhase } from '../../lib/connectivity'
import { RegistrationFlow } from './RegistrationFlow'
import { AuthCard } from './AuthCard'
import { SignedInBar } from './SignInPanel'

const t = registrationText

function RegistrationGate() {
  const auth = useAuth()
  const phase = useLoadPhase(auth.loading, auth.initError)
  // Reintentar el acceso es recargar, pero solo si lo pulsa la persona.
  if (phase) {
    const loadingText = auth.returningFromGoogle ? accessText.signingInWithGoogle : undefined
    return <ConnectionNotice phase={phase} loadingText={loadingText} onRetry={() => window.location.reload()} />
  }
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
      <DiagnosticsButton />
    </AuthProvider>
  )
}
