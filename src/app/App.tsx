import { site } from '../content/site'
import { Landing } from './Landing'
import { SmoothScroll } from './providers/SmoothScroll'
import { UnderConstruction } from './UnderConstruction'

export function App() {
  return site.underConstruction.enabled ? <UnderConstruction /> : (
    <SmoothScroll>
      <Landing />
    </SmoothScroll>
  )
}
