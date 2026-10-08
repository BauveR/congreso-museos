import type { DocumentReference, Firestore } from 'firebase-admin/firestore'
import type { RegistrationData } from '../../../shared/registration.js'
import {
  applyRegistrationChange,
  CapacityError,
  DEFAULT_SESSIONS,
  validateSessionPatch,
  type Session,
  type SessionPatch,
} from '../../../shared/sessions.js'
import { getAdminApp } from '../firebase.js'
import { sameSessions, today, type Registration, type SaveResult, type Store } from './types.js'

/*
 * Modelo en Firestore:
 *   sessions/{id}                        → Session (sin id)
 *   registrations/{uid}                  → Registration sin el documento de identidad
 *   registrations/{uid}/private/identity → { idDocument } (solo si pidió certificado)
 *
 * Todas las escrituras van por aquí (firebase-admin, en el servidor): las
 * reglas de seguridad impiden escribir desde el navegador (firestore.rules).
 */

type StoredRegistration = Omit<Registration, 'data'> & { data: Omit<RegistrationData, 'idDocument'> }

export class FirestoreStore implements Store {
  private dbPromise: Promise<Firestore> | null = null

  private db(): Promise<Firestore> {
    this.dbPromise ??= import('firebase-admin/firestore').then(({ getFirestore }) => getFirestore(getAdminApp()))
    return this.dbPromise
  }

  /** Crea las sesiones por defecto si la colección está vacía (primer arranque). */
  private async ensureSessions(db: Firestore) {
    const snap = await db.collection('sessions').limit(1).get()
    if (!snap.empty) return
    const batch = db.batch()
    for (const { id, ...session } of DEFAULT_SESSIONS) batch.create(db.collection('sessions').doc(id), session)
    await batch.commit().catch(() => undefined) // otra instancia pudo crearlas a la vez
  }

  async listSessions() {
    const db = await this.db()
    await this.ensureSessions(db)
    const snap = await db.collection('sessions').orderBy('order').get()
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Session, 'id'>) }))
  }

  async updateSession(id: string, patch: SessionPatch) {
    const db = await this.db()
    const ref = db.collection('sessions').doc(id)
    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref)
      if (!snap.exists) throw new CapacityError('La sesión no existe', id)
      const session = { id, ...(snap.data() as Omit<Session, 'id'>) }
      const clean = validateSessionPatch(session, patch)
      tx.update(ref, { ...clean })
      return { ...session, ...clean }
    })
  }

  async getRegistration(uid: string) {
    const db = await this.db()
    const ref = db.collection('registrations').doc(uid)
    const [snap, identity] = await Promise.all([ref.get(), ref.collection('private').doc('identity').get()])
    if (!snap.exists) return null
    return this.merge(snap.data() as StoredRegistration, identity.data())
  }

  async saveRegistration(uid: string, email: string, data: RegistrationData): Promise<SaveResult> {
    const db = await this.db()
    const regRef = db.collection('registrations').doc(uid)
    const identityRef = regRef.collection('private').doc('identity')

    return db.runTransaction(async (tx) => {
      // Firestore exige todas las lecturas antes de cualquier escritura.
      const prevSnap = await tx.get(regRef)
      const previous = prevSnap.exists ? (prevSnap.data() as StoredRegistration) : null
      const ids = new Set([...(previous?.data.sessionIds ?? []), ...data.sessionIds])
      const sessionRefs = [...ids].map((id) => db.collection('sessions').doc(id))
      const sessionSnaps = sessionRefs.length ? await tx.getAll(...sessionRefs) : []
      const sessions = new Map<string, Session>()
      for (const s of sessionSnaps) if (s.exists) sessions.set(s.id, { id: s.id, ...(s.data() as Omit<Session, 'id'>) })

      const counts = applyRegistrationChange(sessions, previous?.data.sessionIds ?? [], data.sessionIds)
      for (const [id, registered] of counts) tx.update(db.collection('sessions').doc(id), { registered })

      const now = new Date().toISOString()
      const { idDocument, ...publicData } = data
      const stored: StoredRegistration = {
        uid,
        email,
        data: publicData,
        createdAt: previous?.createdAt ?? now,
        updatedAt: now,
      }
      tx.set(regRef, stripUndefined(stored))
      if (idDocument) tx.set(identityRef, { idDocument })
      else tx.delete(identityRef)

      return {
        registration: { ...stored, data },
        created: !previous,
        sessionsChanged: !previous || !sameSessions(previous.data.sessionIds, data.sessionIds),
      }
    })
  }

  async cancelRegistration(uid: string) {
    const db = await this.db()
    const regRef = db.collection('registrations').doc(uid)
    const identityRef = regRef.collection('private').doc('identity')

    return db.runTransaction(async (tx) => {
      const [prevSnap, identitySnap] = await Promise.all([tx.get(regRef), tx.get(identityRef)])
      if (!prevSnap.exists) return null
      const previous = prevSnap.data() as StoredRegistration
      const sessionRefs = previous.data.sessionIds.map((id) => db.collection('sessions').doc(id))
      const sessionSnaps = sessionRefs.length ? await tx.getAll(...sessionRefs) : []
      const sessions = new Map<string, Session>()
      for (const s of sessionSnaps) if (s.exists) sessions.set(s.id, { id: s.id, ...(s.data() as Omit<Session, 'id'>) })

      const counts = applyRegistrationChange(sessions, previous.data.sessionIds, [])
      for (const [id, registered] of counts) tx.update(db.collection('sessions').doc(id), { registered })
      tx.delete(identityRef)
      tx.delete(regRef)
      return this.merge(previous, identitySnap.data())
    })
  }

  /** Cupo en mailQuota/{uid}: { day, count }. Solo el servidor lo lee (reglas: todo cerrado). */
  async consumeMailQuota(uid: string, max: number) {
    const db = await this.db()
    const ref = db.collection('mailQuota').doc(uid)
    return db.runTransaction(async (tx) => {
      const day = today()
      const snap = await tx.get(ref)
      const current = snap.data() as { day?: string; count?: number } | undefined
      const count = current?.day === day ? (current.count ?? 0) : 0
      if (count >= max) return false
      tx.set(ref, { day, count: count + 1 })
      return true
    })
  }

  async listRegistrations() {
    const db = await this.db()
    const [regs, identities] = await Promise.all([
      db.collection('registrations').get(),
      db.collectionGroup('private').get(),
    ])
    const idByUid = new Map<string, unknown>()
    for (const doc of identities.docs) {
      const parent = doc.ref.parent.parent as DocumentReference | null
      if (doc.id === 'identity' && parent) idByUid.set(parent.id, doc.data())
    }
    return regs.docs.map((d) => this.merge(d.data() as StoredRegistration, idByUid.get(d.id) as { idDocument?: unknown }))
  }

  async recount() {
    const db = await this.db()
    const regs = await db.collection('registrations').get()
    const counts = new Map<string, number>()
    for (const doc of regs.docs) {
      for (const id of (doc.data() as StoredRegistration).data.sessionIds) counts.set(id, (counts.get(id) ?? 0) + 1)
    }
    const sessions = await this.listSessions()
    const batch = db.batch()
    for (const s of sessions) batch.update(db.collection('sessions').doc(s.id), { registered: counts.get(s.id) ?? 0 })
    await batch.commit()
    return sessions.map((s) => ({ ...s, registered: counts.get(s.id) ?? 0 }))
  }

  private merge(stored: StoredRegistration, identity?: { idDocument?: unknown }): Registration {
    const idDocument = identity?.idDocument as RegistrationData['idDocument']
    return { ...stored, data: { ...stored.data, ...(idDocument ? { idDocument } : {}) } as RegistrationData }
  }
}

/** Firestore no admite `undefined`: se eliminan esas claves antes de guardar. */
function stripUndefined<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
