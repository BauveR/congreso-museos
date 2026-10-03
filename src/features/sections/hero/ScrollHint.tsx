/**
 * Indicador "desliza para explorar": dos líneas en mayúsculas junto a una
 * línea vertical por la que baja un tramo de acento (en bucle, solo sin
 * reduced motion).
 */
export function ScrollHint({ lines: [first, second] }: { lines: [string, string] }) {
  return (
    <p className="flex items-stretch gap-3 text-xs leading-tight font-bold tracking-wide uppercase sm:text-sm">
      <span aria-hidden className="relative w-0.5 overflow-hidden bg-borde">
        <span className="absolute inset-x-0 top-0 h-1/2 bg-acento motion-safe:animate-scroll-line" />
      </span>
      <span>
        {first}
        <br />
        {second}
      </span>
    </p>
  )
}
