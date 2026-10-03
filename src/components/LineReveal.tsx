import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { lineContainerVariants, lineItemVariants } from '../lib/motion'

type Props = {
  as: 'h1' | 'h2' | 'h3'
  className?: string
  lines: ReactNode[]
  amount?: number
}

export function LineReveal({ as, className, lines, amount = 0.22 }: Props) {
  const reduceMotion = useReducedMotion()
  const Heading = as === 'h1' ? motion.h1 : as === 'h2' ? motion.h2 : motion.h3
  return <Heading
    className={`line-reveal${className ? ` ${className}` : ''}`}
    variants={lineContainerVariants}
    initial={reduceMotion ? false : 'hidden'}
    whileInView={reduceMotion ? undefined : 'visible'}
    viewport={{ once: true, amount }}
  >{lines.map((line, index) => <span className="line-reveal__mask" key={index}><motion.span variants={lineItemVariants}>{line}</motion.span></span>)}</Heading>
}
