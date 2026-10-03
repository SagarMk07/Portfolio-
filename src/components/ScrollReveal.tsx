import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUpVariants, staggerVariants } from '../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  stagger?: boolean
  amount?: number
  as?: 'div' | 'p' | 'section' | 'article' | 'footer'
}

const motionTags = {
  div: motion.div,
  p: motion.p,
  section: motion.section,
  article: motion.article,
  footer: motion.footer,
}

export function ScrollReveal({ children, className, stagger = false, amount = 0.18, as = 'div' }: Props) {
  const reduceMotion = useReducedMotion()
  const Element = motionTags[as]
  return <Element
    className={className}
    variants={stagger ? staggerVariants : fadeUpVariants}
    initial={reduceMotion ? false : 'hidden'}
    whileInView={reduceMotion ? undefined : 'visible'}
    viewport={{ once: true, amount }}
  >{children}</Element>
}
