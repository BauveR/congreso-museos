import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { AuthContext } from './context'
import { EMAIL_LINK_KEY, getFirebaseAuth } from './firebaseAuth'
import { loadMockUser, mockToken, mockUid, saveMockUser, type MockUser } from './mockAuth'
import type { AuthApi, AuthUser } from './types'

const MODE: AuthApi['mode'] = import.meta.env.VITE_DATA_MODE === 'firebase' ? 'firebase' : 'mock'

const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set: (key: string, value: string | null) => {
    try {
      if (value === null) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch {
      // Sin almacenamiento: se pedirá el correo al volver del enlace.
    }
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // En mock la sesión se lee de inmediato; en Firebase llega por onAuthStateChanged.
  const [user, setUser] = useState<AuthUser | null>(() => (MODE === 'mock' ? loadMockUser() : null))
  const [isAdmin, setIsAdmin] = useState(() => MODE === 'mock' && Boolean(loadMockUser()?.admin))
  const [loading, setLoading] = useState(MODE !== 'mock')
  const [pendingEmailLink, setPendingEmailLink] = useState(false)

  useEffect(() => {
    if (MODE === 'mock') return

    let unsubscribe = () => {}
    let cancelled = false
    void (async () => {
      const auth = await getFirebaseAuth()
      const { onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } = await import('firebase/auth')

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
        if (!firebaseUser || !firebaseUser.email) {
          setUser(null)
          setIsAdmin(false)
        } else {
          const token = await firebaseUser.getIdTokenResult()
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName ?? '' })
          setIsAdmin(token.claims.admin === true)
        }
        setLoading(false)
      })
    })()
    return () => {
      cancelled = true
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

  const signInWithGoogle = useCallback(async () => {
    const [{ GoogleAuthProvider, signInWithPopup }, auth] = await Promise.all([import('firebase/auth'), getFirebaseAuth()])
    await signInWithPopup(auth, new GoogleAuthProvider())
  }, [])

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

  const value = useMemo<AuthApi>(
    () => ({
      mode: MODE,
      user,
      isAdmin,
      loading,
      getIdToken,
      signOut,
      signInWithGoogle,
      sendEmailLink,
      pendingEmailLink,
      completeEmailLink,
      mockSignIn,
    }),
    [user, isAdmin, loading, getIdToken, signOut, signInWithGoogle, sendEmailLink, pendingEmailLink, completeEmailLink, mockSignIn],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
