import { useMotionEffect } from '../app/motion'
import type { SectionId } from '../content/types'
import { notifyScroll, scrollState } from '../features/hero3d/scrollState'

/**
 * Genera un ScrollTrigger por cada elemento `[data-section]`. Es el único
 * sitio donde se definen los rangos de sección: cada sección está activa
 * mientras cruza el centro del viewport. Escribe en scrollState.
 */
export function useSectionTriggers() {
  useMotionEffect(({ gsap, ScrollTrigger }) => {
    const elements = gsap.utils.toArray<HTMLElement>('[data-section]')
    const count = elements.length
    scrollState.sections = elements.map((el) => el.dataset.section as SectionId)

    elements.forEach((el, index) => {
      const activate = (self: ScrollTrigger) => {
        scrollState.section = el.dataset.section as SectionId
        scrollState.sectionIndex = index
        scrollState.sectionProgress = self.progress
        scrollState.progress = (index + self.progress) / count
        notifyScroll()
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
