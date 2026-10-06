import { dataMode } from '../env.js'
import type { Store } from './types.js'

declare global {
  // En desarrollo, el store mock sobrevive a la recarga de módulos de Vite.
  var __congresoMockStore: Store | undefined
}

let firestoreStore: Store | undefined

/** Store según DATA_MODE: Firestore en real, memoria (con datos de ejemplo) en mock. */
export async function getStore(): Promise<Store> {
  if (dataMode() === 'firebase') {
    if (!firestoreStore) {
      const { FirestoreStore } = await import('./firestore.js')
      firestoreStore = new FirestoreStore()
    }
    return firestoreStore
  }
  if (!globalThis.__congresoMockStore) {
    const [{ MemoryStore }, { seedMockData }] = await Promise.all([import('./memory.js'), import('./seed.js')])
    const store = new MemoryStore()
    await seedMockData(store)
    globalThis.__congresoMockStore = store
  }
  return globalThis.__congresoMockStore
}
