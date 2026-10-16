import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowUpRight, Copy, Check, MoveUpRight, Sparkles } from 'lucide-react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { projects, type Project } from './data/projects'
import { Navigation } from './components/Navigation'
import { CustomCursor } from './components/CustomCursor'
import { PortfolioScene } from './components/three/PortfolioScene'
import type { TechNodeData } from './components/three/NeuralNetwork'
import { InteractiveStack } from './components/InteractiveStack'
import { SectionHeading } from './components/SectionHeading'
import { ProjectRow } from './components/ProjectRow'
import { ProjectHoverPreview } from './components/ProjectHoverPreview'
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
const email = 'sagarkalagudi7@gmail.com'

// Hero Typography Entrance with heavy cinematic easing cubic-bezier(0.16, 1, 0.3, 1)
const heroTitleVariants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
}

const heroWordVariants = {
  hidden: {
    clipPath: 'inset(100% 0 0 0)',
    y: '105%',
    opacity: 0.3,
  },
  show: {
    clipPath: 'inset(0% 0 0 0)',
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.92,
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
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (reduceMotion) return
    let frameId = 0
    const onMouseMove = (e: MouseEvent) => {
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          frameId = 0
          // Controlled subtle pointer parallax displacement (max X = ±8px, max Y = ±5px)
          const normX = (e.clientX / window.innerWidth - 0.5) * 16
          const normY = (e.clientY / window.innerHeight - 0.5) * 10
          setPointerOffset({
            x: Math.max(-8, Math.min(8, normX)),
            y: Math.max(-5, Math.min(5, normY)),
          })
        })
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [reduceMotion])

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
        {/* LEFT: Large Personal Typography with controlled parallax displacement */}
        <div
          className="hero-poster-left"
          style={
            reduceMotion
              ? undefined
              : {
                  transform: `translate3d(${pointerOffset.x}px, ${pointerOffset.y}px, 0)`,
                  transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                }
          }
        >
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
            VIEW RESUME ↗
          </button>
          <button
            type="button"
            className="resume-link-btn"
            onClick={() => {
              onOpenResume()
              setTimeout(() => window.print(), 350)
            }}
            title="Download / Print Resume as PDF"
          >
            DOWNLOAD RESUME ↓
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
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null)

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
              onHoverProject={setHoveredProject}
              onLeaveProject={() => setHoveredProject(null)}
            />
          ))}
      </div>

      {/* Floating Cursor Project Preview (Desktop only) */}
      <ProjectHoverPreview project={hoveredProject} visible={Boolean(hoveredProject)} />

      {/* Subsection: Currently Building */}
      <CurrentlyBuilding />
    </section>
  )
}

function About() {
  return (
    <section className="about-section page-section" id="about" data-cursor-theme="dark">
      <SectionHeading index="03" eyebrow="CORE PHILOSOPHY" title="BUILDING WITH|INTENT." />
      
      {/* Editorial Spatial Layout: Left Statement & Telemetry, Right Narrative & Capabilities */}
      <div className="about-editorial-grid">
        {/* Left Column: Bold Statement & Telemetry Block */}
        <div className="about-editorial-left">
          <LineReveal
            as="h3"
            className="about-statement"
            lines={['I BUILD', 'INTELLIGENT', <em>SYSTEMS.</em>]}
            amount={0.25}
          />
          <div className="about-telemetry-panel">
            <div className="telemetry-row">
              <span className="telemetry-label">LOCATION</span>
              <strong className="telemetry-val">BANGALORE / INDIA</strong>
              <small className="telemetry-sub">12°58′N · 77°35′E</small>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">FOCUS</span>
              <strong className="telemetry-val">AI / ML ARCHITECTURES</strong>
              <small className="telemetry-sub">MODELS · DATA PIPELINES</small>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">STACK</span>
              <strong className="telemetry-val">REACT · PYTHON · TYPESCRIPT</strong>
              <small className="telemetry-sub">FASTAPI · SUPABASE · THREE.JS</small>
            </div>
            <div className="telemetry-row">
              <span className="telemetry-label">STATUS</span>
              <strong className="telemetry-val telemetry-active">AVAILABLE FOR IMPACT</strong>
              <small className="telemetry-sub">INTERNSHIPS &amp; COLLABORATIONS</small>
            </div>
          </div>
        </div>

        {/* Right Column: Developer Narrative & Interactive Capabilities */}
        <div className="about-editorial-right">
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
          </ScrollReveal>

          {/* Technical Capability Modules */}
          <div className="about-capabilities-list">
            <div className="capability-card">
              <div className="capability-num">01</div>
              <div className="capability-info">
                <strong>INTELLIGENT MODEL PIPELINES</strong>
                <p>Computer vision, document understanding OCR, and generative reasoning workflows.</p>
              </div>
            </div>
            <div className="capability-card">
              <div className="capability-num">02</div>
              <div className="capability-info">
                <strong>FULL STACK SYSTEMS</strong>
                <p>High-throughput backend endpoints, PostgreSQL persistence, and asynchronous processing.</p>
              </div>
            </div>
            <div className="capability-card">
              <div className="capability-num">03</div>
              <div className="capability-info">
                <strong>REACTIVE USER INTERFACES</strong>
                <p>Pixel-precise interactive web experiences with WebGL, Three.js, and strict type safety.</p>
              </div>
            </div>
          </div>
        </div>
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

  const milestones = [
    {
      year: '2024',
      phase: 'AI / ML FOUNDATION',
      status: '[VERIFIED]',
      tech: 'Python · Scikit-Learn · Computer Vision · OCR',
      description: 'Explored deep learning foundations, statistical modeling, and real-time visual parsing systems.',
    },
    {
      year: '2025',
      phase: 'FULL STACK SYSTEMS',
      status: '[DEPLOYED]',
      tech: 'TypeScript · React · FastAPI · Supabase · Cloud',
      description: 'Engineered end-to-end applications bridging machine learning models to reactive client interfaces.',
    },
    {
      year: '2026',
      phase: 'INTELLIGENT PRODUCTS',
      status: '[ACTIVE]',
      tech: 'Generative AI · Three.js · Spatial Interaction',
      description: 'Developing autonomous agents, real-time spatial web experiences, and production ML tools.',
    },
  ]

  return (
    <section className="journey-section page-section" id="build-log" data-cursor-theme="dark">
      <SectionHeading
        index="04"
        eyebrow="SYS_EXEC // 2024—2026"
        title="BUILT BY FOLLOWING|THE QUESTION."
      />
      <div ref={containerRef} className="journey-list-wrapper">
        <div className="journey-timeline-track" aria-hidden="true">
          <motion.div className="journey-timeline-fill" style={{ scaleY }} />
        </div>
        <ScrollReveal className="journey-list" stagger amount={0.15}>
          {milestones.map((m) => (
            <motion.div className="journey-row" key={m.year} variants={revealItemVariants}>
              <span className="journey-index">{m.year}</span>
              <div className="journey-main">
                <div className="journey-milestone-top">
                  <span className="journey-meta">{m.phase}</span>
                  <span className="milestone-status-tag">{m.status}</span>
                </div>
                <h3>{m.phase}</h3>
                <p>{m.description}</p>
                <div className="milestone-tech-pills">
                  {m.tech.split(' · ').map(t => (
                    <span key={t} className="milestone-pill">{t}</span>
                  ))}
                </div>
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
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2400)
  }

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
          
          <div className="contact-action-row">
            <motion.a
              href={`mailto:${email}`}
              className="contact-cta"
              variants={revealItemVariants}
            >
              <span>START A CONVERSATION</span>
              <i>
                <MoveUpRight size={19} />
              </i>
            </motion.a>

            <button
              type="button"
              className="contact-email-copy-btn"
              onClick={handleCopyEmail}
              title="Copy email to clipboard"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? 'EMAIL COPIED' : email}</span>
            </button>
          </div>
        </ScrollReveal>

        <ScrollReveal className="contact-socials">
          <span>CONNECT</span>
          <a href={linkedin} target="_blank" rel="noreferrer">
            LINKEDIN <ArrowUpRight size={14} />
          </a>
          <a href={github} target="_blank" rel="noreferrer">
            GITHUB <ArrowUpRight size={14} />
          </a>
          <a href={`mailto:${email}`}>
            EMAIL ↗
          </a>
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
