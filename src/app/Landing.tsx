import { site } from '../content/site'
import { Agenda } from '../features/sections/agenda/Agenda'
import { Carousel } from '../features/sections/carousel/Carousel'
import { Description } from '../features/sections/description/Description'
import { Footer } from '../features/sections/footer/Footer'
import { Hero } from '../features/sections/hero/Hero'
import { Intro } from '../features/sections/intro/Intro'
import { KineticHeadline } from '../features/sections/kinetic/KineticHeadline'
import { Nav } from '../features/sections/nav/Nav'
import { Registration } from '../features/sections/registration/Registration'
import { WhyAttend } from '../features/sections/why-attend/WhyAttend'

export function Landing() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-60 rounded-full bg-acento px-4 py-2 font-semibold text-acento-contraste focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {site.a11y.skipLink}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <WhyAttend />
        <Carousel />
        <KineticHeadline />
        <Description />
        <Agenda />
        <Registration />
      </main>
      <Footer />
    </>
  )
}
