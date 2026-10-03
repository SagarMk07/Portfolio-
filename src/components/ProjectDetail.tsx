import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projectById, projects } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'
import { CaseStudySection } from './CaseStudySection'
import { SystemFlow } from './SystemFlow'
import { TechnologyList } from './TechnologyList'
import { LineReveal } from './LineReveal'
import { fadeUpVariants, imageRevealVariants, motionDuration, motionEase } from '../lib/motion'

export function ProjectDetail() {
  const reduceMotion = useReducedMotion()
  const { id } = useParams()
  const project = id ? projectById(id) : undefined
  if (!project) return <Navigate to="/" replace />
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length]
  return <main className="case-study">
    <motion.div className="case-topline" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ duration: motionDuration.normal, ease: motionEase }}><Link to="/#work" className="back-link" data-cursor="view"><ArrowLeft size={15}/> ALL PROJECTS</Link><span>{project.number} / ENGINEERING CASE FILE</span></motion.div>
    <div className="case-title-row"><div><motion.div className="section-kicker" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.08, duration: motionDuration.normal, ease: motionEase }}>{project.category}</motion.div><LineReveal as="h1" lines={[project.title]} amount={0.1}/></div><motion.span className="case-index" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.12, duration: motionDuration.normal, ease: motionEase }}>{project.number}</motion.span></div>
    <motion.p className="case-intro" variants={fadeUpVariants} initial={reduceMotion ? false : 'hidden'} animate="visible" transition={{ delay: 0.2, duration: motionDuration.normal, ease: motionEase }}>{project.shortDescription}</motion.p>
    <motion.div className="case-art" variants={imageRevealVariants} initial={reduceMotion ? false : 'hidden'} animate="visible"><ProjectArtwork project={project}/></motion.div>
    <div className="case-sections">
      <CaseStudySection number="01" title="OVERVIEW"><p>{project.overview}</p></CaseStudySection>
      <CaseStudySection number="02" title="PROBLEM"><p>{project.problem}</p></CaseStudySection>
      <CaseStudySection number="03" title="APPROACH"><p>{project.approach}</p></CaseStudySection>
      <CaseStudySection number="04" title="SYSTEM"><p>{project.system}</p><SystemFlow steps={project.systemSteps}/></CaseStudySection>
      <CaseStudySection number="05" title="TECHNOLOGY"><TechnologyList technologies={project.technologies}/></CaseStudySection>
      <CaseStudySection number="06" title="IMPLEMENTATION"><p>{project.implementation}</p></CaseStudySection>
      <CaseStudySection number="07" title="RESULT"><p>{project.result}</p></CaseStudySection>
      <CaseStudySection number="08" title="LESSONS"><p>{project.lessons}</p></CaseStudySection>
    </div>
    {(project.github || project.liveDemo) && <div className="case-resource-links">{project.github && <a href={project.github} target="_blank" rel="noreferrer" data-cursor="code">SOURCE CODE <ArrowUpRight size={16}/></a>}{project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer" data-cursor="open">LIVE DEMO <ArrowUpRight size={16}/></a>}</div>}
    <div className="case-bottom"><span>NEXT PROJECT / {nextProject.number}</span><Link to={`/projects/${nextProject.slug}`} data-cursor="explore">{nextProject.title} <ArrowUpRight size={18}/></Link></div>
  </main>
}
