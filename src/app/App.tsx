import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { site } from '../content/site'
import { Landing } from './Landing'
import { usePreviewAccess } from './previewAccess'
import { SmoothScroll } from './providers/SmoothScroll'
import { UnderConstruction } from './UnderConstruction'

// Páginas interiores en chunks aparte: Firebase y el formulario no pesan en la landing.
const RegistrationPage = lazy(() => import('../features/registration/RegistrationPage'))
const AdminPage = lazy(() => import('../features/admin/AdminPage'))
const PrivacyPage = lazy(() => import('../features/legal/PrivacyPage'))

function Home() {
  const { enabled } = site.underConstruction
  // En construcción: solo con el enlace de acceso anticipado (previewAccess).
  const access = usePreviewAccess(enabled)
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
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscripcion" element={<RegistrationPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
