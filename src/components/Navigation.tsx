import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

const links = [
  { label: 'WORK', href: '/#work', id: 'work' },
  { label: 'ABOUT', href: '/#about', id: 'about' },
  { label: 'STACK', href: '/#stack', id: 'stack' },
  { label: 'CONTACT', href: '/#contact', id: 'contact' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  // Track scroll progress for the 2px acid-lime line using scaleX (no width animation)
  useEffect(() => {
    let frameId = 0
    const updateScrollProgress = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0
        const scrollY = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`
        }
      })
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true })
    updateScrollProgress()

    return () => {
      window.removeEventListener('scroll', updateScrollProgress)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  // Robust Section Detection: Hero has no active state; exact section highlighted
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    let frameId = 0
    const checkActiveSection = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0

        // If in hero viewport (top 35%), hero has NO active section per requirement
        if (window.scrollY < window.innerHeight * 0.35) {
          setActiveSection('')
          return
        }

        // Check contact section near bottom
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70) {
          setActiveSection('contact')
          return
        }

        const midPoint = window.innerHeight * 0.42
        let current = ''

        for (const link of links) {
          const el = document.getElementById(link.id)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= midPoint && rect.bottom >= midPoint * 0.25) {
              current = link.id
            }
          }
        }

        setActiveSection(prev => (prev === current ? prev : current))
      })
    }

    window.addEventListener('scroll', checkActiveSection, { passive: true })
    window.addEventListener('resize', checkActiveSection, { passive: true })
    checkActiveSection()

    return () => {
      window.removeEventListener('scroll', checkActiveSection)
      window.removeEventListener('resize', checkActiveSection)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [location.pathname])

  useEffect(() => {
    if (open) menuButtonRef.current?.focus()
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <header className="site-header" data-cursor-theme="dark">
      <Link className="brand" to="/" aria-label="Sagar Kalagudi home">
        <span>SAGAR</span>
        <i>/</i>
        <span>MK</span>
      </Link>

      <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">
        {links.map(link => {
          const isCurrent = activeSection === link.id
          return (
            <Link
              to={link.href}
              key={link.label}
              aria-current={isCurrent ? 'location' : undefined}
              className={isCurrent ? 'is-active-link' : ''}
              onClick={event => {
                setOpen(false)
                if (open) menuButtonRef.current?.focus()
                if (location.pathname === '/' && location.hash === `#${link.id}`) {
                  event.preventDefault()
                  document.getElementById(link.id)?.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start',
                  })
                }
              }}
            >
              {link.label}
            </Link>
          )
        })}
        <a
          className="nav-external"
          href="https://github.com/SagarMk07"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub profile"
        >
          <ArrowUpRight size={15} />
        </a>
      </nav>

      <button
        ref={menuButtonRef}
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X /> : <Menu />}
      </button>

      {/* 2px Acid Lime Scroll Progress Indicator using scaleX */}
      <div className="scroll-progress-track" aria-hidden="true">
        <div ref={progressRef} className="scroll-progress-bar" />
      </div>
    </header>
  )
}
