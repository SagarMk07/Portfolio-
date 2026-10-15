import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, Activity } from 'lucide-react'
import { revealItemVariants, staggerVariants } from '../lib/motion'

export function CurrentlyBuilding() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="currently-building-wrapper">
      <motion.div
        className="currently-building-card"
        variants={staggerVariants}
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, amount: 0.25 }}
      >
        <div className="building-header">
          <div className="building-eyebrow">
            <Activity size={13} className="building-pulse-icon" />
            <span>CURRENTLY BUILDING // ACTIVE DISPATCH</span>
          </div>
          <div className="building-status-pill">
            <span className="building-dot" />
            <span>IN DEVELOPMENT</span>
          </div>
        </div>

        <motion.div className="building-body" variants={revealItemVariants}>
          <div className="building-title-row">
            <h3 className="building-title">DISTILLGUARD</h3>
            <span className="building-class">INDUSTRIAL AI & ANOMALY DETECTION</span>
          </div>
          <p className="building-description">
            Machine-learning anomaly detection and predictive monitoring for batch distillation processes.
            Analyzing multi-sensor temperature, pressure, and flow telemetry to catch drift vectors before threshold failure.
          </p>
        </motion.div>

        <motion.div className="building-footer" variants={revealItemVariants}>
          <div className="building-stack-tags">
            <span>PYTHON</span>
            <span>MACHINE LEARNING</span>
            <span>TIME-SERIES</span>
            <span>ANOMALY DETECTION</span>
          </div>
          <div className="building-note">
            <Sparkles size={11} />
            <span>EXPERIMENTAL R&amp;D PROTOTYPE</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
