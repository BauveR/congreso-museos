import { site } from '../content/site'
import { Background } from '../features/hero3d/Background'
import { Access } from '../features/sections/access/Access'
import { Committees } from '../features/sections/committees/Committees'
import { Description } from '../features/sections/description/Description'
import { Footer } from '../features/sections/footer/Footer'
import { Hero } from '../features/sections/hero/Hero'
import { KineticHeadline } from '../features/sections/kinetic/KineticHeadline'
import { Nav } from '../features/sections/nav/Nav'
import { Organization } from '../features/sections/organization/Organization'
import { Participants } from '../features/sections/participants/Participants'
import { Program } from '../features/sections/program/Program'
import { Registration } from '../features/sections/registration/Registration'
import { Threshold } from '../features/sections/threshold/Threshold'
import { useExitFade } from '../hooks/useExitFade'
import { useSectionTriggers } from '../hooks/useSectionTriggers'

export function Landing() {
  useExitFade()
  useSectionTriggers()

  return (
    <>
      <a
        href="#main"
        className="sr-only z-60 rounded-full bg-acento px-4 py-2 font-semibold text-acento-contraste focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {site.a11y.skipLink}
      </a>
      <Background />
      <Nav />
      <main id="main">
        <Hero />
        <Committees />
        <Organization />
        <Program />
        <Participants />
        <Threshold />
        <Access />
        <Description />
        <KineticHeadline />
        <Registration />
      </main>
      <Footer />
    </>
  )
}
