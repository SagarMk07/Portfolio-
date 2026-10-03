import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'
import { imageRevealVariants, revealItemVariants, staggerVariants } from '../lib/motion'

const MotionLink = motion(Link)
const imageVariants = {
  ...imageRevealVariants,
  visible: { ...imageRevealVariants.visible, transition: { ...imageRevealVariants.visible.transition, delay: 0.52 } },
}

export function ProjectRow({ project, reverse = false }: { project: Project; reverse?: boolean }) {
  const reduceMotion = useReducedMotion()
  return <motion.article
    className={`project-row ${reverse ? 'project-reverse' : ''}`}
    variants={staggerVariants}
    initial={reduceMotion ? false : 'hidden'}
    whileInView={reduceMotion ? undefined : 'visible'}
    viewport={{ once: true, amount: 0.2 }}
  >
    <motion.div className="project-copy" variants={staggerVariants}>
      <motion.div className="project-meta" variants={staggerVariants}>
        <motion.span variants={revealItemVariants}>{project.number} / PROJECT</motion.span>
        <motion.span variants={revealItemVariants}>{project.category}</motion.span>
      </motion.div>
      <MotionLink className="project-title-link" to={`/projects/${project.slug}`} data-cursor="view" variants={revealItemVariants}>
        <motion.h3 variants={revealItemVariants}>{project.title}</motion.h3><ArrowUpRight className="project-arrow" size={22}/>
      </MotionLink>
      <motion.p variants={revealItemVariants}>{project.shortDescription}</motion.p>
      <motion.div className="project-tags" variants={revealItemVariants}>{project.technologies.map(tech => <span key={tech}>{tech}</span>)}</motion.div>
      <motion.div className="project-ctas" variants={revealItemVariants}>
        <Link className="text-link" to={`/projects/${project.slug}`} data-cursor="explore">EXPLORE CASE STUDY <span>↗</span></Link>
        {project.github && <a className="project-secondary-link" href={project.github} target="_blank" rel="noreferrer" data-cursor="code">GITHUB <ArrowUpRight size={13}/></a>}
        {project.liveDemo && <a className="project-secondary-link" href={project.liveDemo} target="_blank" rel="noreferrer" data-cursor="open">LIVE DEMO <ArrowUpRight size={13}/></a>}
      </motion.div>
    </motion.div>
    <MotionLink
      className="project-art-link"
      to={`/projects/${project.slug}`}
      aria-label={`Explore ${project.title} case study`}
      data-cursor="view"
      variants={imageVariants}
    >
      <ProjectArtwork project={project}/><span className="art-link-icon"><ArrowUpRight size={18}/></span>
    </MotionLink>
  </motion.article>
}
