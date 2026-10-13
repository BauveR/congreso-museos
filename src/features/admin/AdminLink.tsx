import { Link, useLocation } from 'react-router'
import { buttonClass } from '../../components/button'
import { adminText } from '../../content/inscripcion'
import { useAuth } from '../../lib/auth/context'

/**
 * Botón al panel de administración, junto a «Sesión iniciada como…»: solo
 * para cuentas con la marca admin y fuera del propio panel. Así no hay que
 * saberse la dirección /admin.
 */
export function AdminLink({ className = '' }: { className?: string }) {
  const auth = useAuth()
  const { pathname } = useLocation()
  if (!auth.isAdmin || pathname.startsWith('/admin')) return null
  return (
    <Link to="/admin" className={`${buttonClass({ size: 'sm' })} ${className}`}>
      {adminText.openPanel}
    </Link>
  )
}
