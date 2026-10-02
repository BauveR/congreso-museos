import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import Lenis from 'lenis'

// Capa de movimiento: se carga en su propio chunk vía loadMotion() (motion.ts).
// Registro único de plugins: importar gsap siempre desde aquí.
gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, Lenis, ScrollTrigger, SplitText }
