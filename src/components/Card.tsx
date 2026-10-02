interface CardProps {
  title: string
  body: string
}

export function Card({ title, body }: CardProps) {
  return (
    <article className="rounded-2xl border border-borde bg-superficie p-6">
      <h3 className="text-lg font-semibold text-texto">{title}</h3>
      <p className="mt-3 text-texto-suave">{body}</p>
    </article>
  )
}
