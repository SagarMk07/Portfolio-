import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Project } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'

export function ProjectRow({ project, reverse = false }: { project: Project; reverse?: boolean }) {
  const reduceMotion = useReducedMotion()
  return <motion.article className={`project-row ${reverse ? 'project-reverse' : ''}`} initial={reduceMotion ? false : { y: 32 }} whileInView={{ y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>
    <Link className="project-art-link" to={`/projects/${project.id}`} aria-label={`Open ${project.title} case study`} data-cursor="OPEN"><ProjectArtwork project={project}/><span className="art-link-icon"><ArrowUpRight size={18}/></span></Link>
    <div className="project-copy"><div className="project-meta"><span>{project.number} / SELECTED WORK</span><span>{project.category}</span></div><Link className="project-title-link" to={`/projects/${project.id}`}><h3>{project.title}</h3><ArrowUpRight className="project-arrow" size={22}/></Link><p>{project.description}</p><div className="project-tags">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div><Link className="text-link" to={`/projects/${project.id}`} data-cursor="VIEW">VIEW CASE STUDY <span>↗</span></Link></div>
  </motion.article>
}
