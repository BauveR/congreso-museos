import type { AnchorHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

const variants: Record<Variant, string> = {
  primary: 'bg-acento text-acento-contraste hover:bg-acento/85',
  secondary: 'border border-borde text-texto hover:border-acento hover:text-acento',
}

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant
}

export function ButtonLink({ variant = 'primary', className = '', ...rest }: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-base font-semibold transition-colors ${variants[variant]} ${className}`}
      {...rest}
    />
  )
}
