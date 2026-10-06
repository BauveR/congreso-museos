/** id DOM de un campo a partir de su clave de error ("idDocument.number" → "f-idDocument-number"). */
export const fieldDomId = (id: string) => `f-${id.replace(/\./g, '-')}`
