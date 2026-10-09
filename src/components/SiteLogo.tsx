import { site } from '../content/site'

/** Logo del congreso para las cabeceras. Decorativo: el enlace que lo envuelve lleva el nombre (aria-label). */
export function SiteLogo({ className = 'h-10 w-auto' }: { className?: string }) {
  const { src, width, height } = site.nav.logo
  return <img src={src} alt="" width={width} height={height} className={className} />
}
