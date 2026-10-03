import { useEffect } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { projects } from './data/projects'
import { stackGroups } from './data/stack'
import { Navigation } from './components/Navigation'
import { CustomCursor } from './components/CustomCursor'
import { SectionHeading } from './components/SectionHeading'
import { ProjectRow } from './components/ProjectRow'
import { GitHubActivity } from './components/GitHubActivity'
import { ProjectDetail } from './components/ProjectDetail'
import { LineReveal } from './components/LineReveal'
import { ScrollReveal } from './components/ScrollReveal'
import { fadeUpVariants, motionDuration, motionEase, revealItemVariants } from './lib/motion'

const linkedin = 'https://www.linkedin.com/in/sagar-kalagudi-b375163a2/'
const github = 'https://github.com/SagarMk07'

const heroTitleVariants = {
  hidden: {},
  show: { transition: { delayChildren: 0.16, staggerChildren: 0.12 } },
}
const heroWordVariants = {
  hidden: { opacity: 0.8, y: '105%' },
  show: { opacity: 1, y: '0%', transition: { duration: motionDuration.emphasis, ease: motionEase } },
}
const heroBottomVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.45, staggerChildren: 0.16 } },
}
const heroCopyVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.02, staggerChildren: 0.1 } },
}

function Hero() {
  const reduceMotion = useReducedMotion()

  return <section className="hero">
    <div className="hero-surface" aria-hidden="true">
      <div className="hero-grid"/><div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/>
      <div className="hero-crosshair crosshair-a">+</div><div className="hero-crosshair crosshair-b">+</div><div className="hero-signal"/>
      <div className="hero-coordinate">12°58′17.2″N<br/>77°35′14.5″E</div>
    </div>
    <motion.div className="hero-top" initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: motionDuration.normal, delay: 0.08, ease: motionEase }}>
      <span>AI / ML DEVELOPER</span><span className="availability"><i/> AVAILABLE FOR PROJECTS</span>
    </motion.div>
    <motion.h1 className="hero-title" variants={heroTitleVariants} initial={reduceMotion ? false : 'hidden'} animate="show">
      <motion.div className="hero-title-line" variants={heroWordVariants}><span>SAGAR</span></motion.div>
      <motion.div className="hero-title-line hero-lastname" variants={heroWordVariants}><span>KALAGUDI<span className="hero-period">.</span></span></motion.div>
    </motion.h1>
    <motion.div className="hero-bottom" variants={heroBottomVariants} initial={reduceMotion ? false : 'hidden'} animate="visible">
      <motion.div className="hero-description" variants={heroCopyVariants}>
        <motion.span className="hero-caption" variants={fadeUpVariants}>ENGINEERING / INTELLIGENCE / IMPACT</motion.span>
        <motion.p variants={fadeUpVariants}>I build intelligent products where<br className="desktop-break"/> machine learning meets real-world problems.</motion.p>
        <motion.div className="hero-links" variants={fadeUpVariants}>
          <a href={github} target="_blank" rel="noreferrer" data-cursor="open">GITHUB <ArrowUpRight size={14}/></a>
          <a href={linkedin} target="_blank" rel="noreferrer" data-cursor="open">LINKEDIN <ArrowUpRight size={14}/></a>
          <span className="resume-placeholder" title="Resume has not been provided">RESUME / NOT PROVIDED</span>
        </motion.div>
      </motion.div>
      <motion.a className="scroll-cue" href="#work" variants={revealItemVariants} data-cursor="view"><span>SCROLL TO EXPLORE</span><i><ArrowDown size={16}/></i></motion.a>
    </motion.div>
    <motion.div className="hero-index" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: motionDuration.normal, delay: 0.46, ease: motionEase }}>01 <span>—</span> 04</motion.div>
  </section>
}

function About() {
  return <section className="about-section page-section" id="about">
    <SectionHeading index="01" eyebrow="A NOTE ON THE WORK" title="BUILDING WITH|INTENT."/>
    <div className="about-content">
      <LineReveal as="h3" className="about-statement" lines={['MAKE IT', <em>USEFUL.</em>]} amount={0.3}/>
      <ScrollReveal className="about-copy">
        <p className="about-lead">I’m Sagar M Kalagudi — an AI &amp; ML developer working across intelligent systems and the interfaces that make them useful.</p>
        <p>Currently pursuing a B.E. in Artificial Intelligence &amp; Machine Learning, I build hands-on projects that connect models, data, and modern software. I’m interested in the whole path: the problem, the system behind it, and the details a person actually uses.</p>
        <div className="about-location"><span><i/> BANGALORE, INDIA</span><span>STUDENT / BUILDER</span></div>
      </ScrollReveal>
    </div>
    <ScrollReveal className="about-rule"><span>AI SYSTEMS</span><i/><span>FULL-STACK</span><i/><span>EXPERIMENTATION</span></ScrollReveal>
  </section>
}

function Stack() {
  return <section className="stack-section page-section" id="stack">
    <SectionHeading index="02" eyebrow="TOOLS & MATERIALS" title="THE WORKING SET."/>
    <ScrollReveal as="p" className="stack-intro">A practical toolkit, shaped by what each project needs.</ScrollReveal>
    <ScrollReveal className="stack-groups" stagger amount={0.12}>
      {stackGroups.map((group, groupIndex) => <motion.div className="stack-group" key={group.label} variants={revealItemVariants}>
        <div className="stack-label"><span>0{groupIndex + 1}</span>{group.label}</div>
        <div className="stack-list">{group.items.map(item => <span className="stack-item" key={item} tabIndex={0}>{item}</span>)}</div>
      </motion.div>)}
    </ScrollReveal>
  </section>
}

function Work() {
  return <section className="work-section page-section" id="work">
    <SectionHeading index="03" eyebrow="SELECTED PROJECTS" title="IDEAS, MADE|TANGIBLE.">
      <p className="work-intro">Four explorations across healthcare, shopping, travel, and sustainability. Each starts with a real-world friction point.</p>
    </SectionHeading>
    <div className="project-list">{projects.filter(project => project.featured).map((project, index) => <ProjectRow key={project.id} project={project} reverse={index % 2 === 1}/>)}</div>
  </section>
}

function BuildLog() {
  return <section className="journey-section page-section" id="build-log">
    <SectionHeading index="05" eyebrow="BUILD LOG / SEQUENCE, NO DATES" title="BUILT BY FOLLOWING|THE QUESTION."/>
    <ScrollReveal className="journey-list" stagger amount={0.15}>
      {projects.map(project => <motion.div className="journey-row" key={project.id} variants={revealItemVariants}>
        <span className="journey-index">{project.number}</span><div className="journey-main"><span className="journey-meta">{project.category}</span><h3>{project.title}</h3><p>{project.shortDescription}</p></div><span className="journey-marker"><i/></span>
      </motion.div>)}
    </ScrollReveal>
  </section>
}

function Contact() {
  return <section className="contact-section page-section" id="contact">
    <ScrollReveal className="contact-top"><span>06 / CONTACT</span><span>GOOD WORK STARTS WITH A CONVERSATION</span></ScrollReveal>
    <LineReveal as="h2" className="contact-headline" lines={['LET’S BUILD', <em>SOMETHING</em>, 'INTELLIGENT.']} amount={0.2}/>
    <ScrollReveal className="contact-bottom" stagger amount={0.2}>
      <motion.p variants={revealItemVariants}>Open to thoughtful projects, collaborations, and conversations about AI, software, and systems.</motion.p>
      <motion.a href={linkedin} className="contact-cta" target="_blank" rel="noreferrer" data-cursor="open" variants={revealItemVariants}><span>START A CONVERSATION</span><i><MoveUpRight size={19}/></i></motion.a>
    </ScrollReveal>
    <ScrollReveal className="contact-socials"><span>CONNECT</span><a href={linkedin} target="_blank" rel="noreferrer" data-cursor="open">LINKEDIN <ArrowUpRight size={14}/></a><a href={github} target="_blank" rel="noreferrer" data-cursor="code">GITHUB <ArrowUpRight size={14}/></a><span>EMAIL / NOT LISTED</span></ScrollReveal>
  </section>
}

function Footer() {
  return <footer className="site-footer"><a className="footer-brand" href="#top" data-cursor="view">SAGAR M KALAGUDI <ArrowUpRight size={14}/></a><span>AI / ML DEVELOPER</span><span>BANGALORE, INDIA</span><span>© 2026</span><a className="back-top" href="#top" data-cursor="view">BACK TO TOP ↑</a></footer>
}

function HomePage() {
  return <><main id="top"><Hero/><About/><Stack/><Work/><GitHubActivity/><BuildLog/><Contact/></main><Footer/></>
}

export default function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    let frame = 0
    if (location.hash) frame = requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }))
    else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    return () => { if (frame) cancelAnimationFrame(frame) }
  }, [location.pathname, location.hash, reduceMotion])
  return <><div className="ambient" aria-hidden="true"/><Navigation/><CustomCursor/><Routes><Route path="/" element={<HomePage/>}/><Route path="/projects/:id" element={<ProjectDetail/>}/><Route path="*" element={<HomePage/>}/></Routes></>
}
