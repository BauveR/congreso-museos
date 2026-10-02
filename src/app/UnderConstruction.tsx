import { Construction } from 'lucide-react'
import { site } from '../content/site'

export function UnderConstruction() {
  const { underConstruction } = site
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center text-acento">
      <Construction className="size-16" strokeWidth={1.5} aria-hidden />
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">{underConstruction.title}</h1>
      <p className="text-lg opacity-80">{underConstruction.body}</p>
    </main>
  )
}
