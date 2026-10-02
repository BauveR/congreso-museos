import { Construction } from 'lucide-react'

export function UnderConstruction() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-fondo px-4 text-center text-acento">
      <Construction className="size-16" strokeWidth={1.5} aria-hidden />
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Sitio en construcción
      </h1>
      <p className="text-lg opacity-80">Muy pronto estaremos en línea.</p>
    </main>
  )
}

