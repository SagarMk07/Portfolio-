import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { projects } from './data/projects'
import { stackGroups } from './data/stack'
import { journey } from './data/journey'
import { Navigation } from './components/Navigation'
import { CustomCursor } from './components/CustomCursor'
import { SectionHeading } from './components/SectionHeading'
import { ProjectRow } from './components/ProjectRow'
import { GitHubActivity } from './components/GitHubActivity'
import { ProjectDetail } from './components/ProjectDetail'

const linkedin = 'https://www.linkedin.com/in/sagar-kalagudi-b375163a2/'
const github = 'https://github.com/SagarMk07'

function Hero() {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (reduceMotion || window.matchMedia('(pointer: coarse)').matches) return
    const element = heroRef.current
    if (!element) return
    const move = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      element.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width - 0.5) * 18}px`)
      element.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height - 0.5) * 18}px`)
    }
    element.addEventListener('mousemove', move)
    return () => element.removeEventListener('mousemove', move)
  }, [reduceMotion])
  return <section className="hero" ref={heroRef}>
    <div className="hero-surface" aria-hidden="true"><div className="hero-grid"/><div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/><div className="hero-crosshair crosshair-a">+</div><div className="hero-crosshair crosshair-b">+</div><div className="hero-signal"/><div className="hero-coordinate">12°58′17.2″N<br/>77°35′14.5″E</div></div>
    <div className="hero-top"><span>AI / ML DEVELOPER</span><span className="availability"><i/> AVAILABLE FOR PROJECTS</span></div>
    <motion.h1 className="hero-title" initial="hidden" animate="show" variants={{hidden:{},show:{transition:{staggerChildren:0.12,delayChildren:0.2}}}}><motion.div variants={{hidden:{opacity:0,y:56},show:{opacity:1,y:0,transition:{duration:0.8,ease:[0.22,1,0.36,1]}}}}>SAGAR</motion.div><motion.div className="hero-lastname" variants={{hidden:{opacity:0,y:56},show:{opacity:1,y:0,transition:{duration:0.8,ease:[0.22,1,0.36,1]}}}}>KALAGUDI<span className="hero-period">.</span></motion.div></motion.h1>
    <div className="hero-bottom"><div className="hero-description"><span className="hero-caption">ENGINEERING / INTELLIGENCE / IMPACT</span><p>I build intelligent products where<br className="desktop-break"/> machine learning meets real-world problems.</p><div className="hero-links"><a href={github} target="_blank" rel="noreferrer" data-cursor="OPEN">GITHUB <ArrowUpRight size={14}/></a><a href={linkedin} target="_blank" rel="noreferrer" data-cursor="OPEN">LINKEDIN <ArrowUpRight size={14}/></a><span className="resume-placeholder" title="Resume has not been provided">RESUME / NOT PROVIDED</span></div></div><a className="scroll-cue" href="#work"><span>SCROLL TO EXPLORE</span><i><ArrowDown size={16}/></i></a></div>
    <div className="hero-index">01 <span>—</span> 04</div>
  </section>
}

function About() {
  return <section className="about-section page-section" id="about"><SectionHeading index="01" eyebrow="A NOTE ON THE WORK" title="BUILDING WITH INTENT."/><div className="about-content"><h3>MAKE IT<br/><em>USEFUL.</em></h3><div className="about-copy"><p className="about-lead">I’m Sagar M Kalagudi — an AI &amp; ML developer working across intelligent systems and the interfaces that make them useful.</p><p>Currently pursuing a B.E. in Artificial Intelligence &amp; Machine Learning, I build hands-on projects that connect models, data, and modern software. I’m interested in the whole path: the problem, the system behind it, and the details a person actually uses.</p><div className="about-location"><span><i/> BANGALORE, INDIA</span><span>STUDENT / BUILDER</span></div></div></div><div className="about-rule"><span>AI SYSTEMS</span><i/><span>FULL-STACK</span><i/><span>EXPERIMENTATION</span></div></section>
}

function Stack() {
  return <section className="stack-section page-section" id="stack"><SectionHeading index="02" eyebrow="TOOLS & MATERIALS" title="THE WORKING SET."/><p className="stack-intro">A practical toolkit, shaped by what each project needs.</p><div className="stack-groups">{stackGroups.map((group, groupIndex) => <div className="stack-group" key={group.label}><div className="stack-label"><span>0{groupIndex + 1}</span>{group.label}</div><div className="stack-list">{group.items.map((item) => <span className="stack-item" key={item} tabIndex={0}>{item}</span>)}</div></div>)}</div></section>
}

function Work() {
  return <section className="work-section page-section" id="work"><SectionHeading index="03" eyebrow="SELECTED PROJECTS" title="IDEAS, MADE TANGIBLE."><p className="work-intro">Four explorations across healthcare, shopping, travel, and sustainability. Each starts with a real-world friction point.</p></SectionHeading><div className="project-list">{projects.map((project, index) => <ProjectRow key={project.id} project={project} reverse={index % 2 === 1}/>)}</div></section>
}

function Journey() {
  return <section className="journey-section page-section" id="journey"><SectionHeading index="04" eyebrow="THE THROUGH LINE" title="LEARNING BY BUILDING."/><div className="journey-list">{journey.map((step) => <div className="journey-row" key={step.index}><span className="journey-index">{step.index}</span><div className="journey-main"><span className="journey-meta">{step.meta}</span><h3>{step.title}</h3><p>{step.detail}</p></div><span className="journey-marker"><i/></span></div>)}</div></section>
}

function Contact() {
  return <section className="contact-section page-section" id="contact"><div className="contact-top"><span>05 / CONTACT</span><span>GOOD WORK STARTS WITH A CONVERSATION</span></div><h2>HAVE A<br/><em>GOOD</em><br/>PROBLEM?</h2><div className="contact-bottom"><p>Open to thoughtful projects, collaborations, and conversations about AI, software, and systems.</p><a href={linkedin} className="contact-cta" target="_blank" rel="noreferrer" data-cursor="OPEN"><span>START A CONVERSATION</span><i><MoveUpRight size={19}/></i></a></div><div className="contact-socials"><a href={linkedin} target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={14}/></a><a href={github} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={14}/></a><span>EMAIL / NOT LISTED</span></div></section>
}

function Footer() {
  return <footer className="site-footer"><a className="footer-brand" href="#top">SAGAR M KALAGUDI <ArrowUpRight size={14}/></a><span>AI / ML DEVELOPER</span><span>BANGALORE, INDIA</span><span>© 2026</span><a className="back-top" href="#top">BACK TO TOP ↑</a></footer>
}

function HomePage() {
  return <><main id="top"><Hero/><About/><Stack/><Work/><GitHubActivity/><Journey/><Contact/></main><Footer/></>
}

export default function App() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash) requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    else window.scrollTo(0, 0)
  }, [location.pathname, location.hash])
  return <><div className="ambient" aria-hidden="true"/><Navigation/><CustomCursor/><Routes><Route path="/" element={<HomePage/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="*" element={<HomePage/>}/></Routes></>
}
