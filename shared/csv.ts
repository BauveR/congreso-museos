/*
 * CSV para Excel: separador ";" (Excel en español usa la coma como decimal),
 * BOM UTF-8 para que los acentos se lean bien y saltos de línea CRLF.
 */

const SEPARATOR = ';'

/**
 * Escapa una celda. Neutraliza fórmulas: un valor que empiece por = + - @
 * (o tabulador/retorno) se ejecutaría al abrir el archivo en Excel
 * (inyección de CSV), así que se le antepone un apóstrofo.
 */
export function csvCell(value: unknown): string {
  let text = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  if (/["\n\r;]/.test(text)) text = `"${text.replace(/"/g, '""')}"`
  return text
}

export function toCsv(headers: readonly string[], rows: readonly (readonly unknown[])[]): string {
  const lines = [headers, ...rows].map((row) => row.map(csvCell).join(SEPARATOR))
  return '﻿' + lines.join('\r\n') + '\r\n'
}
