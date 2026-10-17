import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Printer, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { projects } from '../data/projects'

interface ResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handlePrint = () => {
    window.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="resume-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="resume-title">
          <motion.div
            className="resume-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            className="resume-modal-container"
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Modal Controls Bar */}
            <div className="resume-controls-bar">
              <div className="resume-controls-left">
                <span className="resume-pill">VERIFIED CURRICULUM VITAE</span>
                <span className="resume-filename">SAGAR_KALAGUDI_CV_2026.PDF</span>
              </div>
              <div className="resume-controls-actions">
                <button
                  type="button"
                  className="resume-action-btn"
                  onClick={handlePrint}
                  title="Print or Save as PDF"
                >
                  <Printer size={14} />
                  <span>PRINT / DOWNLOAD PDF</span>
                </button>
                <button
                  type="button"
                  className="resume-close-btn"
                  onClick={onClose}
                  aria-label="Close resume view"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Editorial Resume Document */}
            <article className="resume-document">
              {/* Header */}
              <header className="resume-doc-header">
                <div>
                  <h2 id="resume-title" className="resume-name">SAGAR KALAGUDI</h2>
                  <p className="resume-subtitle">AI &amp; ML DEVELOPER · SYSTEMS BUILDER</p>
                </div>
                <div className="resume-contact-block">
                  <span>BANGALORE, INDIA</span>
                  <a href="https://github.com/SagarMk07" target="_blank" rel="noreferrer">
                    github.com/SagarMk07 <ArrowUpRight size={11} />
                  </a>
                  <a href="https://www.linkedin.com/in/sagar-kalagudi-b375163a2/" target="_blank" rel="noreferrer">
                    linkedin.com/in/sagar-kalagudi <ArrowUpRight size={11} />
                  </a>
                </div>
              </header>

              {/* Summary */}
              <section className="resume-section">
                <h3 className="resume-section-heading">01 / EXECUTIVE PROFILE</h3>
                <p className="resume-text">
                  AI &amp; Machine Learning developer with strong foundations in neural architectures,
                  computer vision, and full-stack software systems. Experienced in designing end-to-end
                  intelligent products that connect machine learning models, reactive web interfaces, and
                  production datastores.
                </p>
              </section>

              {/* Education */}
              <section className="resume-section">
                <h3 className="resume-section-heading">02 / EDUCATION</h3>
                <div className="resume-item">
                  <div className="resume-item-top">
                    <strong>Bachelor of Engineering — Artificial Intelligence &amp; Machine Learning</strong>
                    <span className="resume-date">UNDERGRADUATE CANDIDATE</span>
                  </div>
                  <span className="resume-subtext">Bangalore, Karnataka, India</span>
                  <p className="resume-text">
                    Core Focus: Neural Networks, Machine Learning, Computer Vision, Data Structures &amp;
                    Algorithms, Systems Engineering.
                  </p>
                </div>
              </section>

              {/* Verified Projects */}
              <section className="resume-section">
                <h3 className="resume-section-heading">03 / KEY ENGINEERING PROJECTS</h3>
                <div className="resume-projects-grid">
                  {projects.map((proj) => (
                    <div key={proj.id} className="resume-project-item">
                      <div className="resume-item-top">
                        <strong>{proj.title}</strong>
                        <span className="resume-tag">{proj.category}</span>
                      </div>
                      <p className="resume-text">{proj.shortDescription}</p>
                      <div className="resume-tech-list">
                        {proj.technologies.map((t) => (
                          <span key={t}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Core Technical Stack */}
              <section className="resume-section">
                <h3 className="resume-section-heading">04 / TECHNICAL SKILLS</h3>
                <div className="resume-skills-block">
                  <div>
                    <span className="skills-group-title">AI &amp; MACHINE LEARNING</span>
                    <p>Machine Learning, Generative AI, AI APIs, Data Analysis</p>
                  </div>
                  <div>
                    <span className="skills-group-title">LANGUAGES</span>
                    <p>Python, C++, TypeScript, JavaScript, Kotlin</p>
                  </div>
                  <div>
                    <span className="skills-group-title">FRONTEND &amp; WEB</span>
                    <p>React, TypeScript, Vite, Tailwind CSS, HTML5, CSS3</p>
                  </div>
                  <div>
                    <span className="skills-group-title">BACKEND &amp; CLOUD</span>
                    <p>Node.js, REST APIs, Supabase, Firebase, Google Cloud</p>
                  </div>
                </div>
              </section>

              {/* Verification & Availability Footer */}
              <footer className="resume-doc-footer">
                <div className="resume-verify-badge">
                  <CheckCircle2 size={13} />
                  <span>VERIFIED REPOSITORY DATA · AVAILABLE FOR INTERNSHIPS &amp; COLLABORATIONS</span>
                </div>
                <span>BANGALORE, INDIA // 2026</span>
              </footer>
            </article>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
