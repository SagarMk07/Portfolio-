import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'
import { cinematicEase, projectDepthVariants, revealItemVariants, staggerVariants } from '../lib/motion'

const MotionLink = motion(Link)

interface ProjectRowProps {
  project: Project
  index: number
  reverse?: boolean
  onInView?: (index: number) => void
  onHoverProject?: (project: Project) => void
  onLeaveProject?: () => void
}

export function ProjectRow({
  project,
  index,
  reverse = false,
  onInView,
  onHoverProject,
  onLeaveProject,
}: ProjectRowProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      className={`project-row project-stage ${reverse ? 'project-reverse' : ''}`}
      variants={projectDepthVariants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.28, ease: cinematicEase } }}
      viewport={{ once: false, amount: 0.2 }}
      onViewportEnter={() => onInView?.(index)}
      onMouseEnter={() => {
        onInView?.(index)
        onHoverProject?.(project)
      }}
      onMouseLeave={() => {
        onLeaveProject?.()
      }}
    >
      {/* Futuristic Case File Horizontal Row Strip */}
      <MotionLink
        to={`/projects/${project.slug}`}
        className="case-file-strip"
        aria-label={`View case file for ${project.title}`}
        variants={revealItemVariants}
      >
        <div className="case-strip-col case-strip-index">
          <span className="case-strip-indicator" aria-hidden="true" />
          <span>{`${project.number} // ARCHIVE`}</span>
        </div>
        <div className="case-strip-col case-strip-name">
          <span className="case-strip-micro-label">DESIGNATION</span>
          <strong>{project.title}</strong>
        </div>
        <div className="case-strip-col case-strip-category">
          <span className="case-strip-micro-label">DOMAIN</span>
          <span>{project.category}</span>
        </div>
        <div className="case-strip-col case-strip-stack">
          <span className="case-strip-micro-label">STACK</span>
          <div className="case-strip-pills">
            {project.technologies.slice(0, 3).map(tech => (
              <span key={tech} className="case-strip-pill">{tech}</span>
            ))}
          </div>
        </div>
        <div className="case-strip-col case-strip-year">
          <span className="case-strip-micro-label">CYCLE</span>
          <span>{project.year || '2025'}</span>
        </div>
        <div className="case-strip-col case-strip-action">
          <span className="case-strip-arrow-btn">
            <ArrowUpRight size={14} />
          </span>
        </div>
      </MotionLink>

      {/* Main Case Content: Narrative Dossier & Spatial Artwork */}
      <div className="project-body-grid">
        <motion.div className="project-copy" variants={staggerVariants}>
          <motion.div className="project-meta" variants={revealItemVariants}>
            <span className="project-number-badge">{`SYSTEM // DOSSIER_${project.number}`}</span>
            <span className="project-category-tag">[VERIFIED ARCHITECTURE]</span>
          </motion.div>

          <MotionLink
            className="project-title-link"
            to={`/projects/${project.slug}`}
            variants={revealItemVariants}
          >
            <motion.h3>{project.title}</motion.h3>
            <ArrowUpRight className="project-arrow" size={24} />
          </MotionLink>

          <motion.p variants={revealItemVariants}>{project.shortDescription}</motion.p>

          <motion.div className="project-tags" variants={revealItemVariants}>
            {project.technologies.map(tech => (
              <span key={tech}>{tech}</span>
            ))}
          </motion.div>

          <motion.div className="project-ctas" variants={revealItemVariants}>
            <Link className="text-link" to={`/projects/${project.slug}`}>
              EXPLORE CASE STUDY <span>↗</span>
            </Link>
            {project.github && (
              <a
                className="project-secondary-link"
                href={project.github}
                target="_blank"
                rel="noreferrer"
              >
                GITHUB <ArrowUpRight size={13} />
              </a>
            )}
            {project.liveDemo && (
              <a
                className="project-secondary-link"
                href={project.liveDemo}
                target="_blank"
                rel="noreferrer"
              >
                LIVE DEMO <ArrowUpRight size={13} />
              </a>
            )}
          </motion.div>
        </motion.div>

        <MotionLink
          className="project-art-link"
          to={`/projects/${project.slug}`}
          aria-label={`Explore ${project.title} case study`}
          variants={revealItemVariants}
        >
          <div className="art-stage-wrapper">
            <span className="stage-corner stage-corner-tl" aria-hidden="true" />
            <span className="stage-corner stage-corner-tr" aria-hidden="true" />
            <span className="stage-corner stage-corner-bl" aria-hidden="true" />
            <span className="stage-corner stage-corner-br" aria-hidden="true" />
            <ProjectArtwork project={project} />
            <span className="art-link-icon">
              <ArrowUpRight size={18} />
            </span>
            <div className="art-stage-telemetry">
              <span>{`FILE // ${project.slug.toUpperCase()}`}</span>
              <span>STATUS: VERIFIED</span>
            </div>
          </div>
        </MotionLink>
      </div>
    </motion.article>
  )
}
