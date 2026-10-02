import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { site } from '../../../content/site'
import { useActiveSection } from '../../../hooks/useActiveSection'

const MENU_ID = 'nav-menu'

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

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-borde/60 bg-fondo/90">
      <nav aria-label={nav.ariaLabel} className="wrap flex h-16 items-center justify-between">
        <a href={nav.logo.href} className="text-lg font-bold tracking-tight text-acento">
          {nav.logo.label}
        </a>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-full md:hidden"
          aria-expanded={open}
          aria-controls={MENU_ID}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? nav.closeLabel : nav.menuLabel}</span>
          {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
        </button>

        <ul
          id={MENU_ID}
          className={`${open ? 'flex' : 'hidden'} absolute inset-x-0 top-16 flex-col border-b border-borde bg-fondo px-4 pb-4 md:static md:flex md:flex-row md:gap-8 md:border-0 md:bg-transparent md:p-0`}
        >
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={close}
                aria-current={link.href === `#${active}` ? 'location' : undefined}
                className="block py-3 text-texto-suave transition-colors hover:text-texto aria-[current]:text-acento md:py-0 md:text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
