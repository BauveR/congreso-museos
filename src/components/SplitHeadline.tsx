import type { TwoLineHeadline } from '../content/types'
import { RevealText } from './RevealText'

interface SplitHeadlineProps {
  lines: TwoLineHeadline
  align?: 'left' | 'right'
  as?: 'h2' | 'p'
}

/** Titular grande de dos líneas; la segunda en color de acento. */
export function SplitHeadline({ lines: [first, second], align = 'left', as: Tag = 'h2' }: SplitHeadlineProps) {
  return (
    <Tag
      className={`text-[clamp(2.25rem,9vw,7rem)] leading-[0.9] font-black tracking-tight uppercase ${align === 'right' ? 'text-right' : ''}`}
    >
      <RevealText as="span" className="block">
        {first}
      </RevealText>
      <RevealText as="span" className="block text-acento-texto">
        {second}
      </RevealText>
    </Tag>
  )
}
