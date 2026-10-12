import { beforeAll, describe, expect, it } from 'vitest'
import { requireUser } from '../../api/_lib/auth.js'
import { getStore } from '../../api/_lib/store/index.js'
import { apiRequest, emulatorsRunning, resetEmulators, signUp, useFirebaseMode } from './helpers.js'

/* Comprobación básica: el servidor habla con los dos emuladores (Firestore y Auth). */

describe.skipIf(!emulatorsRunning)('emuladores de Firebase', () => {
  beforeAll(async () => {
    useFirebaseMode()
    await resetEmulators()
  })

  it('Firestore: crea los días por defecto en el primer arranque', async () => {
    const sessions = await (await getStore()).listSessions()
    expect(sessions.map((s) => s.id)).toEqual(['dia-19', 'dia-20', 'dia-21'])
  })

  it('Auth: un token real de una cuenta con contraseña (sin verificar) se acepta', async () => {
    const { uid, idToken } = await signUp('ana.garcia@ull.edu.es')
    const user = await requireUser(apiRequest(idToken))
    expect(user).toMatchObject({ uid, email: 'ana.garcia@ull.edu.es', admin: false })
  })

  it('Auth: un token inventado se rechaza con 401', async () => {
    await expect(requireUser(apiRequest('no-es-un-token'))).rejects.toMatchObject({ status: 401 })
  })
})
