import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { cleanEnv } from '../../../shared/env'
import { reportConnectivity, TIMEOUT_MS } from '../connectivity'
import { safeStorage } from '../safeStorage'
import { AuthContext } from './context'
import { EMAIL_LINK_KEY, getFirebaseAuth } from './firebaseAuth'
import { clearGoogleRedirect, markGoogleRedirect, needsGoogleRedirect, returningFromGoogle } from './redirectFlow'
import { loadMockUser, mockPasswordAccount, mockToken, mockUid, saveMockUser, type MockUser } from './mockAuth'
import type { AuthApi, AuthUser, SignUpInput } from './types'

const MODE: AuthApi['mode'] = cleanEnv(import.meta.env.VITE_DATA_MODE) === 'firebase' ? 'firebase' : 'mock'

export function AuthProvider({ children }: { children: ReactNode }) {
  // En mock la sesión se lee de inmediato; en Firebase llega por onAuthStateChanged.
  const [user, setUser] = useState<AuthUser | null>(() => (MODE === 'mock' ? loadMockUser() : null))
  const [isAdmin, setIsAdmin] = useState(() => MODE === 'mock' && Boolean(loadMockUser()?.admin))
  const [loading, setLoading] = useState(MODE !== 'mock')
  const [pendingEmailLink, setPendingEmailLink] = useState(false)
  const [initError, setInitError] = useState(false)
  // Vuelta de Google por redirección: se sabe antes de cargar Firebase (sessionStorage).
  const [returning, setReturning] = useState(() => MODE !== 'mock' && returningFromGoogle())
  const [redirectError, setRedirectError] = useState<unknown>(null)

  // Visita con la inscripción cargada: base para comparar los fallos (anónimo).
  useEffect(() => reportConnectivity('visit'), [])

  useEffect(() => {
    if (MODE === 'mock') return

    let unsubscribe = () => {}
    let cancelled = false
    // Sin respuesta de Firebase en TIMEOUT_MS: se avisa (si contesta después, se recupera solo).
    const timer = setTimeout(() => {
      setInitError(true)
      setLoading(false)
    }, TIMEOUT_MS)
    const fail = () => {
      clearTimeout(timer)
      if (cancelled) return
      setInitError(true)
      setLoading(false)
    }
    void (async () => {
      const auth = await getFirebaseAuth()
      const { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink, getRedirectResult } = await import('firebase/auth')

      // Vuelta de Google por redirección: la sesión llega por onAuthStateChanged; aquí solo
      // se recogen los errores (cuenta desactivada, red…). Un solo uso: se borra la marca.
      if (returningFromGoogle()) {
        void getRedirectResult(auth)
          .catch((error: unknown) => {
            if (!cancelled) setRedirectError(error)
          })
          .finally(() => {
            clearGoogleRedirect()
            if (!cancelled) setReturning(false)
          })
      }

      // Vuelta desde el enlace del correo.
      if (isSignInWithEmailLink(auth, window.location.href)) {
        const email = safeStorage.get(EMAIL_LINK_KEY)
        if (email) {
          await signInWithEmailLink(auth, email, window.location.href).catch(() => undefined)
          safeStorage.set(EMAIL_LINK_KEY, null)
          window.history.replaceState(null, '', window.location.pathname)
        } else {
          setPendingEmailLink(true)
        }
      }

      if (cancelled) return
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        clearTimeout(timer)
        try {
          if (!firebaseUser || !firebaseUser.email) {
            setUser(null)
            setIsAdmin(false)
          } else {
            const token = await firebaseUser.getIdTokenResult()
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName ?? '' })
            setIsAdmin(token.claims.admin === true)
          }
          setInitError(false)
          setLoading(false)
        } catch {
          // Sesión guardada pero sin poder renovar el token (red): mismo aviso.
          fail()
        }
      })
    })().catch(fail)
    return () => {
      cancelled = true
      clearTimeout(timer)
      unsubscribe()
    }
  }, [])

  const getIdToken = useCallback(async () => {
    if (MODE === 'mock') {
      const mock = loadMockUser()
      if (!mock) throw new Error('Sin sesión')
      return mockToken(mock)
    }
    const auth = await getFirebaseAuth()
    if (!auth.currentUser) throw new Error('Sin sesión')
    return auth.currentUser.getIdToken()
  }, [])

  const signOut = useCallback(async () => {
    if (MODE === 'mock') {
      saveMockUser(null)
      setUser(null)
      setIsAdmin(false)
      return
    }
    const [{ signOut: firebaseSignOut }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
    await firebaseSignOut(auth)
  }, [])

  const mockSignIn = useCallback((input: { name: string; email: string; admin: boolean }) => {
    const mock: MockUser = {
      uid: mockUid(input.email),
      email: input.email.trim().toLowerCase(),
      displayName: input.name.trim(),
      admin: input.admin,
    }
    saveMockUser(mock)
    setUser(mock)
    setIsAdmin(mock.admin)
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (MODE === 'mock') {
      mockSignIn({ name: 'Cuenta Google de prueba', email: 'prueba.google@gmail.com', admin: false })
      return
    }
    const [{ GoogleAuthProvider, signInWithPopup, signInWithRedirect }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
    // Chrome, Firefox, Edge y Opera de iOS (y la app de Google): misma pestaña. El resto, ventana.
    if (needsGoogleRedirect(navigator.userAgent, navigator.maxTouchPoints)) {
      markGoogleRedirect()
      await signInWithRedirect(auth, new GoogleAuthProvider())
      return
    }
    await signInWithPopup(auth, new GoogleAuthProvider())
  }, [mockSignIn])

  const sendEmailLink = useCallback(async (email: string) => {
    const [{ sendSignInLinkToEmail }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
    await sendSignInLinkToEmail(auth, email, { url: window.location.origin + window.location.pathname, handleCodeInApp: true })
    safeStorage.set(EMAIL_LINK_KEY, email)
  }, [])

  const completeEmailLink = useCallback(async (email: string) => {
    const [{ signInWithEmailLink }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
    await signInWithEmailLink(auth, email, window.location.href)
    setPendingEmailLink(false)
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  const signUpWithPassword = useCallback(
    async ({ firstName, lastName, email, password }: SignUpInput) => {
      const name = `${firstName.trim()} ${lastName.trim()}`.trim()
      if (MODE === 'mock') {
        mockPasswordAccount('signUp', email, password, name)
        mockSignIn({ name, email, admin: false })
        return
      }
      const [{ createUserWithEmailAndPassword, updateProfile }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
      const { user: created } = await createUserWithEmailAndPassword(auth, email.trim(), password)
      await updateProfile(created, { displayName: name })
      // onAuthStateChanged llegó antes del nombre: actualizarlo.
      setUser({ uid: created.uid, email: created.email ?? email.trim(), displayName: name })
    },
    [mockSignIn],
  )

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (MODE === 'mock') {
        const name = mockPasswordAccount('signIn', email, password)
        mockSignIn({ name, email, admin: false })
        return
      }
      const [{ signInWithEmailAndPassword }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
      await signInWithEmailAndPassword(auth, email.trim(), password)
    },
    [mockSignIn],
  )

  const resetPassword = useCallback(async (email: string) => {
    if (MODE === 'mock') return
    const [{ sendPasswordResetEmail }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
    // Con url, la página de Firebase muestra «Continuar» de vuelta a donde se pidió.
    await sendPasswordResetEmail(auth, email.trim(), { url: window.location.origin + window.location.pathname })
  }, [])

  const clearRedirectError = useCallback(() => setRedirectError(null), [])

  const cancelEmailLink = useCallback(() => {
    setPendingEmailLink(false)
    window.history.replaceState(null, '', window.location.pathname)
  }, [])

  const value = useMemo<AuthApi>(
    () => ({
      mode: MODE,
      user,
      isAdmin,
      loading,
      initError,
      returningFromGoogle: returning,
      redirectError,
      clearRedirectError,
      getIdToken,
      signOut,
      signInWithGoogle,
      signUpWithPassword,
      signInWithPassword,
      resetPassword,
      sendEmailLink,
      pendingEmailLink,
      completeEmailLink,
      cancelEmailLink,
      mockSignIn,
    }),
    [user, isAdmin, loading, initError, returning, redirectError, clearRedirectError, getIdToken, signOut, signInWithGoogle, signUpWithPassword, signInWithPassword, resetPassword, sendEmailLink, pendingEmailLink, completeEmailLink, cancelEmailLink, mockSignIn],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
