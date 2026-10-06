// Marca una cuenta como administradora (custom claim admin=true).
// Uso: npm run set-admin -- persona@ejemplo.com   [--remove para quitarla]
// Requiere FIREBASE_SERVICE_ACCOUNT en .env.local. La persona debe haber
// iniciado sesión al menos una vez y volver a entrar para que se aplique.
import { cert, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

const [email, flag] = process.argv.slice(2)
if (!email) {
  console.error('Indica el correo: npm run set-admin -- persona@ejemplo.com')
  process.exit(1)
}
const account = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? '{}')
initializeApp({ credential: cert({ projectId: account.project_id, clientEmail: account.client_email, privateKey: account.private_key }) })

const auth = getAuth()
const user = await auth.getUserByEmail(email)
const admin = flag !== '--remove'
await auth.setCustomUserClaims(user.uid, { ...user.customClaims, admin })
console.log(`${email}: admin=${admin}. Debe cerrar sesión y volver a entrar.`)
