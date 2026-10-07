import type { RichBlock } from '../content/types'

/** Párrafos y listas a partir de bloques de contenido (texto legible, medida de lectura). */
export function RichText({ blocks, className = '' }: { blocks: RichBlock[]; className?: string }) {
  return (
    <div className={`flex flex-col gap-4 leading-relaxed text-pretty ${className}`}>
      {blocks.map((block, i) =>
        'p' in block ? (
          <p key={i}>{block.p}</p>
        ) : (
          <ul key={i} className="flex flex-col gap-1 border-l-2 border-salvia pl-4 font-semibold">
            {block.list.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ),
      )}
    </div>
  )
}
