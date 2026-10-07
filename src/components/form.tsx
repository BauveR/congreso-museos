import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { fieldDomId } from './formIds'

/*
 * Controles de formulario accesibles: etiqueta asociada, ayuda y error
 * enlazados con aria-describedby, aria-invalid y foco visible del sitio.
 * `id` también es la clave del campo en los errores ("idDocument.number").
 */

const control =
  'w-full rounded-lg border bg-superficie px-4 py-3 text-texto placeholder:text-texto-suave/70 aria-[invalid=true]:border-error border-borde'

const describedBy = (id: string, help?: string, error?: string) =>
  [help && `${fieldDomId(id)}-help`, error && `${fieldDomId(id)}-error`].filter(Boolean).join(' ') || undefined

interface ShellProps {
  id: string
  label: ReactNode
  help?: string
  error?: string
  optional?: string
  children: ReactNode
}

export function FieldShell({ id, label, help, error, optional, children }: ShellProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fieldDomId(id)} className="text-sm font-semibold">
        {label}
        {optional && <span className="ml-2 font-normal text-texto-suave">({optional})</span>}
      </label>
      {children}
      {help && (
        <p id={`${fieldDomId(id)}-help`} className="text-sm text-texto-suave">
          {help}
        </p>
      )}
      {error && (
        <p id={`${fieldDomId(id)}-error`} className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </div>
  )
}

type FieldProps = Omit<ShellProps, 'children'>

export function TextInput({ id, label, help, error, optional, ...input }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell id={id} label={label} help={help} error={error} optional={optional}>
      <input
        id={fieldDomId(id)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, help, error)}
        className={control}
        {...input}
      />
    </FieldShell>
  )
}

export function TextArea({ id, label, help, error, optional, ...input }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell id={id} label={label} help={help} error={error} optional={optional}>
      <textarea
        id={fieldDomId(id)}
        rows={3}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, help, error)}
        className={control}
        {...input}
      />
    </FieldShell>
  )
}

export function SelectInput({
  id,
  label,
  help,
  error,
  optional,
  children,
  ...select
}: FieldProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <FieldShell id={id} label={label} help={help} error={error} optional={optional}>
      <select
        id={fieldDomId(id)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy(id, help, error)}
        className={control}
        {...select}
      >
        {children}
      </select>
    </FieldShell>
  )
}

/** Casilla o botón de opción con su texto al lado (área táctil completa). */
export function Choice({
  label,
  hint,
  type = 'checkbox',
  ...input
}: { label: ReactNode; hint?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg py-1 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60">
      <input type={type} className="mt-1 size-5 shrink-0 accent-acento" {...input} />
      <span className="flex flex-col">
        <span>{label}</span>
        {hint && <span className="text-sm text-texto-suave">{hint}</span>}
      </span>
    </label>
  )
}

/** Grupo de casillas/opciones con leyenda y error del grupo. */
export function ChoiceGroup({
  id,
  legend,
  help,
  error,
  children,
}: {
  id: string
  legend: ReactNode
  help?: string
  error?: string
  children: ReactNode
}) {
  return (
    <fieldset id={fieldDomId(id)} aria-describedby={describedBy(id, help, error)} className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      {help && (
        <p id={`${fieldDomId(id)}-help`} className="-mt-1 mb-1 text-sm text-texto-suave">
          {help}
        </p>
      )}
      {children}
      {error && (
        <p id={`${fieldDomId(id)}-error`} className="text-sm font-semibold text-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}

/** Bloque de sección del formulario. */
export function FormSection({ title, className = '', children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <section className={`flex flex-col gap-5 border-t border-borde pt-8 ${className}`}>
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  )
}
