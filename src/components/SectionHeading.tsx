import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUpVariants, lineContainerVariants, lineItemVariants, staggerVariants } from '../lib/motion'

type Props = { index: string; eyebrow: string; title: string; id?: string; children?: ReactNode }

export function SectionHeading({ index, eyebrow, title, id, children }: Props) {
  const reduceMotion = useReducedMotion()
  return <motion.div
    className="section-heading"
    id={id}
    variants={staggerVariants}
    initial={reduceMotion ? false : 'hidden'}
    whileInView={reduceMotion ? undefined : 'visible'}
    viewport={{ once: true, amount: 0.28 }}
  >
    <motion.div className="section-kicker" variants={fadeUpVariants}><span>{index} /</span> {eyebrow}</motion.div>
    <motion.h2 className="line-reveal" variants={lineContainerVariants}>{title.split('|').map((line, lineIndex) => <span className="line-reveal__mask" key={`${line}-${lineIndex}`}><motion.span variants={lineItemVariants}>{line}</motion.span></span>)}</motion.h2>
    {children && <motion.div className="section-heading-support" variants={fadeUpVariants}>{children}</motion.div>}
  </motion.div>
}
