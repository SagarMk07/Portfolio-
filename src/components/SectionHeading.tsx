import { motion, useReducedMotion } from 'framer-motion'

type Props = { index: string; eyebrow: string; title: string; id?: string; children?: React.ReactNode }

export function SectionHeading({ index, eyebrow, title, id, children }: Props) {
  const reduceMotion = useReducedMotion()
  return <motion.div className="section-heading" id={id} initial={reduceMotion ? false : { y: 20 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
    <div className="section-kicker"><span>{index} /</span> {eyebrow}</div>
    <h2>{title}</h2>
    {children}
  </motion.div>
}
