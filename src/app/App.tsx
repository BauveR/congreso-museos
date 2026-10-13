import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ConnectionNotice } from '../components/ConnectionNotice'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Loader } from '../components/Loader'
import { connectionText } from '../content/inscripcion'
import { site } from '../content/site'
import { Landing } from './Landing'
import { usePageMeta } from '../lib/pageMeta'
import { usePreviewAccess } from './previewAccess'
import { SmoothScroll } from './providers/SmoothScroll'
import { UnderConstruction } from './UnderConstruction'

// Páginas interiores en chunks aparte: Firebase y el formulario no pesan en la landing.
const RegistrationPage = lazy(() => import('../features/registration/RegistrationPage'))
const AdminPage = lazy(() => import('../features/admin/AdminPage'))
const legalPages = () => import('../features/legal/pages')
const PrivacyPage = lazy(() => legalPages().then((m) => ({ default: m.PrivacyPage })))
const LegalNoticePage = lazy(() => legalPages().then((m) => ({ default: m.LegalNoticePage })))
const AccessibilityPage = lazy(() => legalPages().then((m) => ({ default: m.AccessibilityPage })))

function Home() {
  const { enabled } = site.underConstruction
  // En construcción: solo con el enlace de acceso anticipado (previewAccess).
  const access = usePreviewAccess(enabled)
  usePageMeta()
  if (enabled && !access) return access === null ? null : <UnderConstruction />
  return (
    <SmoothScroll>
      <Landing />
    </SmoothScroll>
  )
}

export function App() {
  return (
    <BrowserRouter>
      {/* Página que no carga (p. ej. archivo de una versión anterior): recarga una vez y, si no, aviso. */}
      <ErrorBoundary
        fallback={
          <div className="wrap py-16">
            <ConnectionNotice phase="error" onRetry={() => window.location.reload()} />
          </div>
        }
      >
        {/* Mientras se descarga una página interior (inscripción, administración, legales). */}
        <Suspense fallback={<Loader text={connectionText.loading} className="wrap py-16" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inscripcion" element={<RegistrationPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/privacidad" element={<PrivacyPage />} />
            <Route path="/aviso-legal" element={<LegalNoticePage />} />
            <Route path="/accesibilidad" element={<AccessibilityPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
