import { site } from '../content/site'
import { Landing } from './Landing'
import { UnderConstruction } from './UnderConstruction'

export function App() {
  return site.underConstruction.enabled ? <UnderConstruction /> : <Landing />
}
