import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'
import { projectDepthVariants, revealItemVariants, staggerVariants } from '../lib/motion'

const MotionLink = motion(Link)

interface ProjectRowProps {
  project: Project
  index: number
  reverse?: boolean
  onInView?: (index: number) => void
}

export function ProjectRow({
  project,
  index,
  reverse = false,
  onInView,
}: ProjectRowProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.article
      className={`project-row project-stage ${reverse ? 'project-reverse' : ''}`}
      variants={projectDepthVariants}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: false, amount: 0.25 }}
      onViewportEnter={() => onInView?.(index)}
    >
      <motion.div className="project-copy" variants={staggerVariants}>
        <motion.div className="project-meta" variants={revealItemVariants}>
          <span className="project-number-badge">{project.number} / CASE FILE</span>
          <span className="project-category-tag">{project.category}</span>
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
          <ProjectArtwork project={project} />
          <span className="art-link-icon">
            <ArrowUpRight size={18} />
          </span>
          <div className="art-stage-telemetry">
            <span>FILE // {project.slug.toUpperCase()}</span>
            <span>VERIFIED CONCEPT</span>
          </div>
        </div>
      </MotionLink>
    </motion.article>
  )
}
