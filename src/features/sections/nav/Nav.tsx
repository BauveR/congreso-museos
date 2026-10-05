import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ScrollProgress } from '../../../components/ScrollProgress'
import { site } from '../../../content/site'
import type { Link } from '../../../content/types'
import { useActiveSection } from '../../../hooks/useActiveSection'

const MENU_ID = 'nav-menu'

/**
 * Escritorio (lg): logo centrado y enlaces repartidos a izquierda y derecha.
 * Móvil: logo centrado y botón de menú a la derecha con todos los enlaces.
 */
export function Nav() {
  const { nav } = site
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkItems = (links: Link[]) =>
    links.map((link) => (
      <li key={link.href}>
        <a
          href={link.href}
          onClick={close}
          aria-current={link.href === `#${active}` ? 'location' : undefined}
          className="block py-3 text-sm font-bold tracking-wide uppercase transition-colors hover:text-acento-texto aria-[current]:text-acento-texto lg:py-0"
        >
          {link.label}
        </a>
      </li>
    ))

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-borde/60 bg-fondo/90 transition-colors duration-300">
      <nav aria-label={nav.ariaLabel} className="edge grid h-16 grid-cols-[1fr_auto_1fr] items-center">
        <ul className="hidden gap-8 lg:flex">{linkItems(nav.linksLeft)}</ul>

        <a
          href={nav.logo.href}
          aria-label={nav.logo.label}
          className="col-start-2 grid size-10 place-items-center rounded-md bg-acento text-sm font-black tracking-tight text-acento-contraste"
        >
          {nav.logo.mark}
        </a>

        <div className="col-start-3 flex justify-end">
          <ul className="hidden gap-8 lg:flex">{linkItems(nav.linksRight)}</ul>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full lg:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">{open ? nav.closeLabel : nav.menuLabel}</span>
            {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
          </button>
        </div>

        <ul
          id={MENU_ID}
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col border-b border-borde bg-fondo px-4 pb-4 lg:hidden`}
        >
          {linkItems([...nav.linksLeft, ...nav.linksRight])}
        </ul>
      </nav>
      <ScrollProgress />
    </header>
  )
}
