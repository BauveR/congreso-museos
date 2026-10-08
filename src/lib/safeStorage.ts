/** localStorage que nunca lanza (modo privado, almacenamiento bloqueado): sin él, null. */
export const safeStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },
  set: (key: string, value: string | null) => {
    try {
      if (value === null) localStorage.removeItem(key)
      else localStorage.setItem(key, value)
    } catch {
      // Sin almacenamiento: no se recuerda entre visitas.
    }
  },
}
