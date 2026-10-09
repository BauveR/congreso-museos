import { site } from '../content/site'
import { Background } from '../features/hero3d/Background'
import { Access } from '../features/sections/access/Access'
import { Contact } from '../features/sections/contact/Contact'
import { Differences } from '../features/sections/differences/Differences'
import { Footer } from '../features/sections/footer/Footer'
import { Hero } from '../features/sections/hero/Hero'
import { KineticHeadline } from '../features/sections/kinetic/KineticHeadline'
import { MoreInfo } from '../features/sections/more-info/MoreInfo'
import { Nav } from '../features/sections/nav/Nav'
import { Organization } from '../features/sections/organization/Organization'
import { Previous } from '../features/sections/previous/Previous'
import { Participants } from '../features/sections/participants/Participants'
import { Presentation } from '../features/sections/presentation/Presentation'
import { Program } from '../features/sections/program/Program'
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
        <Presentation />
        <Differences />
        <Organization />
        <Program />
        <Participants />
        <Threshold />
        <Access />
        <Previous />
        <MoreInfo />
        <KineticHeadline />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
