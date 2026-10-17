import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface SystemStatusProps {
  activeSection: string
  isWebGLReady?: boolean
}

const sectionModes: Record<string, string> = {
  hero: 'SYSTEM / OVERVIEW',
  work: 'SYSTEM / PROJECTS',
  about: 'SYSTEM / PROFILE',
  'build-log': 'SYSTEM / EVOLUTION',
  stack: 'SYSTEM / TECHNOLOGY',
  github: 'SYSTEM / OPEN_SOURCE',
  contact: 'SYSTEM / CONNECT',
}

export function SystemStatus({ activeSection, isWebGLReady = true }: SystemStatusProps) {
  const reduceMotion = useReducedMotion()
  const mode = useMemo(() => {
    if (!isWebGLReady && activeSection === 'hero') {
      return 'SYSTEM / INITIALIZING'
    }
    return sectionModes[activeSection] || 'SYSTEM / ONLINE'
  }, [activeSection, isWebGLReady])
  const isLime = activeSection === 'contact'

  return (
    <aside
      className={`system-status-hud ${isLime ? 'is-lime-theme' : ''}`}
      aria-label="System status telemetry"
      data-cursor-theme={isLime ? 'lime' : 'dark'}
    >
      <div className="status-indicator">
        <span className={`status-dot ${!isWebGLReady ? 'is-initializing' : ''}`} aria-hidden="true" />
        <span className="status-title">SYSTEM STATUS</span>
        <span className="status-state">{isWebGLReady ? 'ONLINE' : 'INITIALIZING'}</span>
      </div>

      <div className="status-divider" aria-hidden="true" />

      <motion.div
        key={mode}
        className="status-mode"
        initial={reduceMotion ? false : { opacity: 0, y: -2 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className="status-label">MODE</span>
        <strong className="status-value">{mode}</strong>
      </motion.div>

      <div className="status-meta">
        <div>
          <span className="status-label">FOCUS</span>
          <span className="status-value">AI / ML</span>
        </div>
        <div>
          <span className="status-label">STACK</span>
          <span className="status-value">REACT · PYTHON · TS</span>
        </div>
      </div>
    </aside>
  )
}
