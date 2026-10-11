/*
 * Reglas de contraseña al crear la cuenta, según la guía NIST SP 800-63B
 * (rev. 2024): longitud mínima, sin contraseñas muy comunes y sin datos
 * personales; sin obligar a mezclar mayúsculas, números y símbolos. Solo se
 * aplican al crear la cuenta: quien ya tiene una contraseña más corta sigue
 * entrando con ella.
 */

export const PASSWORD_MIN = 8

/** Contraseñas muy comunes (y las obvias de este congreso), en minúsculas. */
const COMMON = new Set([
  '12345678', '123456789', '1234567890', '87654321', '11111111', '00000000', '12341234', '11223344',
  'password', 'password1', 'passw0rd', 'contraseña', 'contrasena', 'contrasena1', 'qwerty123', 'qwertyui',
  'asdfghjk', 'abcd1234', 'abc12345', '1q2w3e4r', 'iloveyou', 'sunshine', 'princesa', 'tequiero',
  'bienvenido', 'bienvenida', 'administrador', 'superman', 'futbol123', 'barcelona', 'realmadrid',
  'congreso', 'congreso2026', 'museo2026', 'museos2026', 'canarias', 'canarias2026', 'tenerife',
  'grancanaria', 'lalaguna', 'patrimonio',
])

export interface PasswordContext {
  email?: string
  firstName?: string
  lastName?: string
}

export interface PasswordChecks {
  /** Al menos PASSWORD_MIN caracteres. */
  length: boolean
  /** No está entre las más comunes ni es un carácter repetido. */
  notCommon: boolean
  /** No contiene el nombre, los apellidos ni la parte local del correo. */
  notPersonal: boolean
}

/** Minúsculas y sin tildes: «García» y «garcia» cuentan igual. */
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

/** Partes personales de 4 o más letras que no deben aparecer en la contraseña. */
function personalParts({ email = '', firstName = '', lastName = '' }: PasswordContext): string[] {
  const local = email.split('@')[0] ?? ''
  return [local, ...local.split(/[._-]+/), ...firstName.split(/\s+/), ...lastName.split(/\s+/)]
    .map((p) => fold(p.trim()))
    .filter((p) => p.length >= 4)
}

export function checkPassword(password: string, context: PasswordContext = {}): PasswordChecks {
  const folded = fold(password)
  return {
    length: [...password].length >= PASSWORD_MIN,
    notCommon: password.length > 0 && !COMMON.has(password.toLowerCase()) && !COMMON.has(folded) && !/^(.)\1*$/.test(password),
    notPersonal: password.length > 0 && !personalParts(context).some((part) => folded.includes(part)),
  }
}

export const passwordOk = (checks: PasswordChecks) => checks.length && checks.notCommon && checks.notPersonal
