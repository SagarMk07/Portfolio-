import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, MoveUpRight, Sparkles } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { projects } from './data/projects'
import { Navigation } from './components/Navigation'
import { CustomCursor } from './components/CustomCursor'
import { PortfolioScene } from './components/three/PortfolioScene'
import type { TechNodeData } from './components/three/NeuralNetwork'
import { InteractiveStack } from './components/InteractiveStack'
import { SectionHeading } from './components/SectionHeading'
import { ProjectRow } from './components/ProjectRow'
import { CurrentlyBuilding } from './components/CurrentlyBuilding'
import { GitHubActivity } from './components/GitHubActivity'
import { ProjectDetail } from './components/ProjectDetail'
import { LineReveal } from './components/LineReveal'
import { ScrollReveal } from './components/ScrollReveal'
import { SystemStatus } from './components/SystemStatus'
import { ResumeModal } from './components/ResumeModal'
import {
  cinematicEase,
  motionDuration,
  motionEase,
  revealItemVariants,
} from './lib/motion'

const linkedin = 'https://www.linkedin.com/in/sagar-kalagudi-b375163a2/'
const github = 'https://github.com/SagarMk07'

// Hero Typography Entrance: SAGAR reveals first, KALAGUDI reveals second via clip-path
const heroTitleVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.12,
      staggerChildren: 0.16,
    },
  },
}

const heroWordVariants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    y: '105%',
    opacity: 0.35,
  },
  show: {
    clipPath: 'inset(0% 0 0 0)',
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.88,
      ease: cinematicEase,
    },
  },
}

const heroBottomVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.44, staggerChildren: 0.12 } },
}

function Hero({ onOpenResume }: { onOpenResume: () => void }) {
  const reduceMotion = useReducedMotion()

  return (
    <section className="hero" id="top" data-cursor-theme="dark">
      {/* Top Telemetry & Role Tag */}
      <motion.div
        className="hero-top"
        initial={reduceMotion ? false : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionDuration.normal, delay: 0.08, ease: motionEase }}
      >
        <span className="hero-role-tag">AI / ML DEVELOPER · SYSTEMS ARCHITECT</span>
        <span className="availability">
          <i /> AVAILABLE FOR PROJECTS
        </span>
      </motion.div>

      {/* Art-Directed Poster Grid: Left Name, Center 3D Space, Right Intro */}
      <div className="hero-poster-grid">
        {/* LEFT: Large Personal Typography */}
        <div className="hero-poster-left">
          <motion.h1
            className="hero-title"
            variants={heroTitleVariants}
            initial={reduceMotion ? false : 'hidden'}
            animate="show"
          >
            <motion.div className="hero-title-line" variants={heroWordVariants}>
              <span>SAGAR</span>
            </motion.div>
            <motion.div className="hero-title-line hero-lastname" variants={heroWordVariants}>
              <span>
                KALAGUDI<span className="hero-period">.</span>
              </span>
            </motion.div>
          </motion.h1>

          <motion.div
            className="hero-caption"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: motionDuration.normal, ease: motionEase }}
          >
            ENGINEERING / INTELLIGENCE / IMPACT
          </motion.div>
        </div>

        {/* CENTER / RIGHT: 3D Spatial Framing where the large AI Core physically lives */}
        <div className="hero-poster-center" aria-hidden="true">
          <div className="hero-spatial-target" />
        </div>

        {/* RIGHT: Short Personal Introduction & Telemetry */}
        <motion.div
          className="hero-poster-right"
          initial={reduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.42, duration: motionDuration.normal, ease: motionEase }}
        >
          <div className="hero-bio-card">
            <span className="bio-label">CORE BRIEF // 2026</span>
            <p>
              I build intelligent products where machine learning meets real-world software.
              Connecting models, data pipelines, and responsive interfaces into one continuous experience.
            </p>
            <div className="hero-telemetry-block">
              <span className="telemetry-coord">12°58′17.2″N · 77°35′14.5″E</span>
              <span className="telemetry-city">BANGALORE, INDIA</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom: Social Links, Scroll Cue, Spatial Index */}
      <motion.div
        className="hero-bottom"
        variants={heroBottomVariants}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        <div className="hero-links">
          <a href={github} target="_blank" rel="noreferrer">
            GITHUB <ArrowUpRight size={14} />
          </a>
          <a href={linkedin} target="_blank" rel="noreferrer">
            LINKEDIN <ArrowUpRight size={14} />
          </a>
          <button
            type="button"
            className="resume-link-btn"
            onClick={onOpenResume}
            title="View verified Curriculum Vitae"
          >
            RESUME / CV <ArrowUpRight size={13} />
          </button>
        </div>

        <a className="scroll-cue" href="#work">
          <span>SCROLL TO EXPLORE</span>
          <i>
            <ArrowDown size={16} />
          </i>
        </a>

        <div className="hero-index">
          01 <span>—</span> 04
        </div>
      </motion.div>
    </section>
  )
}

function Work({ onActiveProject }: { onActiveProject: (index: number) => void }) {
  return (
    <section className="work-section page-section" id="work" data-cursor-theme="dark">
      <SectionHeading
        index="02"
        eyebrow="SELECTED CASE FILES"
        title="IDEAS, MADE|TANGIBLE."
      >
        <p className="work-intro">
          Four explorations across healthcare, shopping intelligence, travel systems, and
          sustainability. Each engineered to eliminate friction in real-world workflows.
        </p>
      </SectionHeading>
      <div className="project-list">
        {projects
          .filter(project => project.featured)
          .map((project, index) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={index}
              reverse={index % 2 === 1}
              onInView={onActiveProject}
            />
          ))}
      </div>

      {/* Subsection: Currently Building */}
      <CurrentlyBuilding />
    </section>
  )
}

function About() {
  return (
    <section className="about-section page-section" id="about" data-cursor-theme="dark">
      <SectionHeading index="03" eyebrow="CORE PHILOSOPHY" title="BUILDING WITH|INTENT." />
      <div className="about-content">
        <LineReveal
          as="h3"
          className="about-statement"
          lines={['I BUILD', 'INTELLIGENT', <em>SYSTEMS.</em>]}
          amount={0.25}
        />
        <ScrollReveal className="about-copy">
          <p className="about-lead">
            I’m Sagar Kalagudi — an AI &amp; ML developer working across computational models and
            the interfaces that make them genuinely useful.
          </p>
          <p>
            Currently pursuing a B.E. in Artificial Intelligence &amp; Machine Learning, I engineer
            hands-on systems that bridge models, real-time data, and resilient web software.
            I’m invested in the entire path: from problem framing and vector embeddings to
            the interface a person actually touches.
          </p>
          <div className="about-location">
            <span>
              <i /> BANGALORE, INDIA
            </span>
            <span>STUDENT / BUILDER</span>
          </div>
        </ScrollReveal>
      </div>
      <ScrollReveal className="about-rule">
        <span>AI ARCHITECTURES</span>
        <i />
        <span>REACTIVE SYSTEMS</span>
        <i />
        <span>PRACTICAL EXPERIMENTATION</span>
      </ScrollReveal>
    </section>
  )
}

function BuildLog() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 70%'],
  })
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 })

  return (
    <section className="journey-section page-section" id="build-log" data-cursor-theme="dark">
      <SectionHeading
        index="04"
        eyebrow="BUILD LOG / EVOLUTION"
        title="BUILT BY FOLLOWING|THE QUESTION."
      />
      <div ref={containerRef} className="journey-list-wrapper">
        <div className="journey-timeline-track" aria-hidden="true">
          <motion.div className="journey-timeline-fill" style={{ scaleY }} />
        </div>
        <ScrollReveal className="journey-list" stagger amount={0.15}>
          {projects.map(project => (
            <motion.div className="journey-row" key={project.id} variants={revealItemVariants}>
              <span className="journey-index">{project.number}</span>
              <div className="journey-main">
                <span className="journey-meta">{project.category}</span>
                <h3>{project.title}</h3>
                <p>{project.shortDescription}</p>
              </div>
              <span className="journey-marker">
                <i />
              </span>
            </motion.div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}

function Stack({ hoveredNode }: { hoveredNode: TechNodeData | null }) {
  return (
    <section className="stack-section page-section" id="stack" data-cursor-theme="dark">
      <SectionHeading index="05" eyebrow="TOOLS &amp; MATERIALS" title="THE WORKING|MATRIX.">
        <p className="stack-intro">
          An interactive 3D computational network of technologies, shaped by project requirements.
          Explore the 3D constellation directly or select domains below.
        </p>
      </SectionHeading>

      {/* 3D Node Live Inspector (when user hovers a 3D node) */}
      {hoveredNode && (
        <motion.div
          className="node-3d-inspector"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="inspector-badge">
            <Sparkles size={13} />
            <span>3D NETWORK NODE ACTIVE</span>
          </div>
          <strong className="inspector-title">{hoveredNode.name}</strong>
          <p className="inspector-info">{hoveredNode.info}</p>
        </motion.div>
      )}

      <InteractiveStack />
    </section>
  )
}

function Contact() {
  return (
    <div className="contact-wrapper">
      {/* Seamless transition zone from dark 3D environment to acid lime */}
      <div className="contact-gradient-lead" aria-hidden="true" />
      <section className="contact-section page-section" id="contact" data-cursor-theme="lime">
        <ScrollReveal className="contact-top">
          <span>07 / CONTACT</span>
          <span>GOOD WORK STARTS WITH A CONVERSATION</span>
        </ScrollReveal>

        <LineReveal
          as="h2"
          className="contact-headline"
          lines={['LET’S BUILD', <em>SOMETHING</em>, 'INTELLIGENT.']}
          amount={0.2}
        />

        <ScrollReveal className="contact-bottom" stagger amount={0.2}>
          <motion.p variants={revealItemVariants}>
            Open to thoughtful projects, engineering collaborations, and conversations about AI,
            software systems, and modern products.
          </motion.p>
          <div className="contact-availability-banner">
            <span className="avail-dot" />
            <span>AVAILABLE FOR INTERNSHIPS &amp; COLLABORATIONS</span>
          </div>
          <motion.a
            href={linkedin}
            className="contact-cta"
            target="_blank"
            rel="noreferrer"
            variants={revealItemVariants}
          >
            <span>START A CONVERSATION</span>
            <i>
              <MoveUpRight size={19} />
            </i>
          </motion.a>
        </ScrollReveal>

        <ScrollReveal className="contact-socials">
          <span>CONNECT</span>
          <a href={linkedin} target="_blank" rel="noreferrer">
            LINKEDIN <ArrowUpRight size={14} />
          </a>
          <a href={github} target="_blank" rel="noreferrer">
            GITHUB <ArrowUpRight size={14} />
          </a>
          <span>EMAIL / NOT LISTED</span>
        </ScrollReveal>
      </section>
    </div>
  )
}

function Footer() {
  return (
    <footer className="site-footer" data-cursor-theme="dark">
      <a className="footer-brand" href="#top">
        SAGAR&nbsp;&nbsp;KALAGUDI <ArrowUpRight size={14} />
      </a>
      <span>AI / ML DEVELOPER</span>
      <span>BANGALORE, INDIA</span>
      <span>© 2026</span>
      <a className="back-top" href="#top">
        BACK TO TOP ↑
      </a>
    </footer>
  )
}

function HomePage({
  hoveredNode,
  onActiveProject,
  onOpenResume,
}: {
  hoveredNode: TechNodeData | null
  onActiveProject: (index: number) => void
  onOpenResume: () => void
}) {
  return (
    <>
      <main id="top">
        <Hero onOpenResume={onOpenResume} />
        <Work onActiveProject={onActiveProject} />
        <About />
        <BuildLog />
        <Stack hoveredNode={hoveredNode} />
        <GitHubActivity />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [hovered3DNode, setHovered3DNode] = useState<TechNodeData | null>(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(-1)
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false)

  useEffect(() => {
    let frame = 0
    if (location.hash) {
      frame = requestAnimationFrame(() =>
        document.querySelector(location.hash)?.scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start',
        })
      )
    } else {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    }
    return () => {
      if (frame) cancelAnimationFrame(frame)
    }
  }, [location.pathname, location.hash, reduceMotion])

  return (
    <>
      {/* Real Persistent 3D WebGL Scene using Three.js, React Three Fiber & Drei */}
      <PortfolioScene
        activeProjectIndex={activeProjectIndex}
        onHoverTechNode={setHovered3DNode}
        onActiveSectionChange={setActiveSection}
      />

      {/* Global Navigation Header with Scroll Progress Bar */}
      <Navigation />

      {/* Precision Micro-Dot Cursor with Lime-to-Black Theme Inversion */}
      <CustomCursor />

      {/* Ambient System Status Telemetry HUD */}
      <SystemStatus activeSection={activeSection} />

      {/* Clean Verified Resume/CV Modal */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

      {/* Main Application Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              hoveredNode={hovered3DNode}
              onActiveProject={setActiveProjectIndex}
              onOpenResume={() => setIsResumeOpen(true)}
            />
          }
        />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route
          path="*"
          element={
            <HomePage
              hoveredNode={hovered3DNode}
              onActiveProject={setActiveProjectIndex}
              onOpenResume={() => setIsResumeOpen(true)}
            />
          }
        />
      </Routes>
    </>
  )
}
