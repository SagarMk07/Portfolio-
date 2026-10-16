import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cinematicEase } from '../lib/motion'

interface Category {
  id: string
  number: string
  label: string
  telemetry: string
  description: string
  technologies: string[]
}

const categories: Category[] = [
  {
    id: 'ai-ml',
    number: '01',
    label: 'AI / ML',
    telemetry: 'MODELS · VISION · REASONING ENGINES',
    description: 'Practical intelligence pipelines combining vision, multimodal APIs, and recommendation algorithms.',
    technologies: [
      'Python',
      'Machine Learning',
      'Computer Vision',
      'Generative AI',
      'OCR',
      'Gemini / Vertex AI',
      'AI APIs',
      'Data Analysis',
    ],
  },
  {
    id: 'fullstack',
    number: '02',
    label: 'FULL STACK',
    telemetry: 'REACT · NODE · CLIENT EXTENSIONS',
    description: 'High-performance interactive interfaces, browser extensions, and modular backend endpoints.',
    technologies: [
      'React',
      'TypeScript',
      'JavaScript',
      'Node.js',
      'FastAPI',
      'Tailwind CSS',
      'REST APIs',
      'Browser Extension',
    ],
  },
  {
    id: 'languages',
    number: '03',
    label: 'LANGUAGES',
    telemetry: 'SYSTEMS · TYPING · SCRIPTING',
    description: 'Strong foundation across typed client frameworks, computational modeling, and systems.',
    technologies: [
      'Python',
      'C++',
      'TypeScript',
      'Kotlin',
      'JavaScript',
    ],
  },
  {
    id: 'cloud-data',
    number: '04',
    label: 'DATA & PLATFORMS',
    telemetry: 'SUPABASE · POSTGRES · FIREBASE',
    description: 'Managed data backends, document storage, authentication, and spatial coordinate integrations.',
    technologies: [
      'Supabase',
      'PostgreSQL',
      'Firebase',
      'Firestore',
      'Google Maps',
    ],
  },
  {
    id: 'tooling',
    number: '05',
    label: 'DEV WORKSPACE',
    telemetry: 'GIT · VITE · WORKFLOWS',
    description: 'Reproducible development workflows, versioning rigor, and automated development environments.',
    technologies: [
      'Git',
      'GitHub',
      'VS Code',
      'Vite',
      'Linux / Bash',
    ],
  },
]

export function InteractiveStack() {
  const [activeId, setActiveId] = useState<string>('ai-ml')
  const reduceMotion = useReducedMotion()

  const activeCategory = categories.find(c => c.id === activeId) || categories[0]

  return (
    <div className="interactive-stack">
      {/* Category selector strip */}
      <div className="stack-matrix-nav" role="tablist" aria-label="Technology domains">
        {categories.map((cat) => {
          const isActive = cat.id === activeId
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${cat.id}`}
              id={`tab-${cat.id}`}
              className={`stack-matrix-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveId(cat.id)}
              onMouseEnter={() => setActiveId(cat.id)}
              onFocus={() => setActiveId(cat.id)}
            >
              <div className="tab-header">
                <span className="tab-number">{cat.number}</span>
                <span className="tab-indicator" />
              </div>
              <strong className="tab-label">{cat.label}</strong>
              <span className="tab-telemetry">{cat.telemetry}</span>
            </button>
          )
        })}
      </div>

      {/* Active Domain Telemetry Display */}
      <div className="stack-matrix-stage">
        <div className="stage-topline">
          <div className="stage-telemetry">
            <span className="telemetry-pill">DOMAIN ACTIVE</span>
            <span className="telemetry-label">{activeCategory.telemetry}</span>
          </div>
          <span className="stage-count">
            {activeCategory.technologies.length} TECHNOLOGIES VERIFIED
          </span>
        </div>

        <p className="stage-description">{activeCategory.description}</p>

        {/* Technology Badges with dynamic entrance */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            id={`panel-${activeCategory.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategory.id}`}
            className="stack-matrix-grid"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: cinematicEase }}
          >
            {activeCategory.technologies.map((tech, idx) => (
              <motion.div
                key={tech}
                className="matrix-tech-card"
                initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={reduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }}
                transition={{ duration: 0.22, delay: idx * 0.03, ease: cinematicEase }}
              >
                <div className="tech-card-header">
                  <span className="tech-index">0{idx + 1}</span>
                  <ArrowUpRight className="tech-arrow" size={13} />
                </div>
                <strong className="tech-name">{tech}</strong>
                <span className="tech-badge">VERIFIED STACK</span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
