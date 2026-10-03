import { motion, useReducedMotion } from 'framer-motion'
import { fadeUpVariants, staggerVariants } from '../lib/motion'

export function CaseStudySection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  return <motion.section className="case-section" variants={staggerVariants} initial={reduceMotion ? false : 'hidden'} whileInView={reduceMotion ? undefined : 'visible'} viewport={{ once: true, amount: 0.2 }}>
    <motion.h2 variants={fadeUpVariants}>{number} / {title}</motion.h2><motion.div className="case-section-content" variants={fadeUpVariants}>{children}</motion.div>
  </motion.section>
}
