import { accessibilityStatement, legalNotice } from '../../content/legales'
import { privacyPage } from '../../content/inscripcion'
import { LegalPage } from './LegalPage'

/* Las tres páginas legales, en un mismo chunk (se cargan bajo demanda desde App.tsx). */

export const PrivacyPage = () => <LegalPage content={privacyPage} />
export const LegalNoticePage = () => <LegalPage content={legalNotice} />
export const AccessibilityPage = () => <LegalPage content={accessibilityStatement} />
