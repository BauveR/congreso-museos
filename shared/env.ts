/**
 * Valor de una variable de entorno sin los restos de copiar y pegar en el
 * panel de Vercel: espacios o saltos de línea al principio o al final y
 * comillas que envuelven todo el valor. Vacío → undefined.
 */
export function cleanEnv(value: string | undefined): string | undefined {
  let v = value?.trim()
  if (v && v.length >= 2 && (v[0] === '"' || v[0] === "'") && v.at(-1) === v[0]) v = v.slice(1, -1).trim()
  return v || undefined
}
