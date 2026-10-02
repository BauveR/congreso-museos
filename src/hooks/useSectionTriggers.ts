import { useMotionEffect } from '../app/motion'
import type { SectionId } from '../content/types'
import { scrollState } from '../features/hero3d/scrollState'

/**
 * Genera un ScrollTrigger por cada elemento `[data-section]` más uno global.
 * Es el único sitio donde se definen los rangos de sección: cada sección
 * está activa mientras cruza el centro del viewport.
 */
export function useSectionTriggers() {
  useMotionEffect(({ gsap, ScrollTrigger }) => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollState.progress = self.progress
      },
    })

    gsap.utils.toArray<HTMLElement>('[data-section]').forEach((el) => {
      const id = el.dataset.section as SectionId
      const activate = (self: ScrollTrigger) => {
        scrollState.section = id
        scrollState.sectionProgress = self.progress
      }
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        end: 'bottom center',
        onToggle: (self) => self.isActive && activate(self),
        onUpdate: (self) => self.isActive && activate(self),
      })
    })
  }, [])
}
