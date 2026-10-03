import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { projectById } from '../data/projects'
import { ProjectArtwork } from './ProjectArtwork'

export function ProjectDetail() {
  const { id } = useParams()
  const project = id ? projectById(id) : undefined
  if (!project) return <Navigate to="/" replace />
  const sections = [
    ['01', 'OVERVIEW', project.overview], ['02', 'PROBLEM', project.problem], ['03', 'APPROACH', project.approach], ['04', 'SYSTEM', project.system], ['05', 'TECHNOLOGY', project.technologies.join('  /  ')], ['06', 'IMPLEMENTATION', project.implementation], ['07', 'RESULT', project.result], ['08', 'LESSONS', project.lessons],
  ]
  return <main className="case-study"><div className="case-topline"><Link to="/#work" className="back-link"><ArrowLeft size={15}/> ALL PROJECTS</Link><span>{project.number} / CASE STUDY</span></div><div className="case-title-row"><div><div className="section-kicker">{project.category}</div><h1>{project.title}</h1></div><span className="case-index">{project.number}</span></div><p className="case-intro">{project.description}</p><div className="case-art"><ProjectArtwork project={project}/></div><div className="case-sections">{sections.map(([number, title, text]) => <section className="case-section" key={number}><span>{number} / {title}</span><p>{text}</p></section>)}</div><div className="case-bottom"><span>MORE WORK</span><Link to="/#work">BACK TO SELECTED PROJECTS <ArrowUpRight size={18}/></Link></div></main>
}
