import { useMotionEffect } from '../app/motion'
import { useReducedMotion } from './useReducedMotion'

/** Desvanece los elementos `[data-exit-fade]` al salir por la parte superior. */
export function useExitFade() {
  const reducedMotion = useReducedMotion()

  useMotionEffect(
    ({ gsap }) => {
      gsap.utils.toArray<HTMLElement>('[data-exit-fade]').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: el, start: 'top 20%', end: 'bottom 5%', scrub: true },
          },
        )
      })
    },
    [],
    !reducedMotion,
  )
}
