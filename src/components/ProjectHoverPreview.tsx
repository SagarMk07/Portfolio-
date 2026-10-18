import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'

interface ProjectHoverPreviewProps {
  project: Project | null
  visible: boolean
}

export function ProjectHoverPreview({ project, visible }: ProjectHoverPreviewProps) {
  const reduceMotion = useReducedMotion()
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [tilt, setTilt] = useState<{ rotX: number; rotY: number }>({ rotX: 0, rotY: 0 })
  const [isSupported, setIsSupported] = useState(false)
  const posRef = useRef({ x: 0, y: 0 })

  // Disable on touch devices
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const sync = () => setIsSupported(finePointer.matches)
    sync()
    finePointer.addEventListener('change', sync)
    return () => finePointer.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!isSupported || !visible) return

    let frameId = 0
    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY

      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          frameId = 0
          const x = posRef.current.x
          const y = posRef.current.y

          // Subtle spatial 3D tilt based on screen quadrant
          const rotX = ((y / window.innerHeight) - 0.5) * -10
          const rotY = ((x / window.innerWidth) - 0.5) * 14

          setCoords({ x, y })
          setTilt({ rotX, rotY })
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [isSupported, visible])

  if (!isSupported || reduceMotion) return null

  // Clamp preview within viewport boundaries
  const cardWidth = 340
  const cardHeight = 380
  const pad = 24

  let posX = coords.x + 44
  let posY = coords.y - 170

  if (typeof window !== 'undefined') {
    if (posX + cardWidth > window.innerWidth - pad) {
      posX = coords.x - cardWidth - 44
    }
    if (posY + cardHeight > window.innerHeight - pad) {
      posY = window.innerHeight - cardHeight - pad
    }
    if (posY < pad) {
      posY = pad
    }
  }

  return (
    <div
      className="project-hover-preview-container"
      style={{
        transform: `translate3d(${posX}px, ${posY}px, 0)`,
      }}
      aria-hidden="true"
    >
      <AnimatePresence mode="wait">
        {visible && project && (
          <motion.div
            key={project.id}
            className="project-preview-card"
            style={{
              transform: `perspective(800px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 28,
              mass: 0.6,
            }}
          >
            {/* 4 Precision Corner Markers */}
            <span className="preview-corner-bracket preview-corner-tl" aria-hidden="true" />
            <span className="preview-corner-bracket preview-corner-tr" aria-hidden="true" />
            <span className="preview-corner-bracket preview-corner-bl" aria-hidden="true" />
            <span className="preview-corner-bracket preview-corner-br" aria-hidden="true" />

            {/* Header Telemetry */}
            <div className="preview-header">
              <span className="preview-number">{project.number} / CASE FILE</span>
              <span className="preview-category">{project.category}</span>
            </div>

            {/* Embedded High-Fidelity Conceptual Artwork */}
            <div className="preview-artwork-stage">
              <ProjectArtwork project={project} />
            </div>

            {/* Architecture Flow Sequence */}
            <div className="preview-flow">
              <span className="preview-flow-label">ARCHITECTURE // FLOW</span>
              <div className="preview-flow-steps">
                {project.systemSteps.slice(0, 3).map((step, idx) => (
                  <span key={step} className="flow-step">
                    {step}
                    {idx < 2 && <i className="flow-arrow">&rarr;</i>}
                  </span>
                ))}
              </div>
            </div>

            {/* Technical Footer & Case Study Prompt */}
            <div className="preview-footer">
              <span className="preview-explore-text">
                EXPLORE CASE FILE <ArrowUpRight size={14} />
              </span>
              <span className="preview-status-pill">VERIFIED DATA</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
