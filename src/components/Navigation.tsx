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

  // Track scroll progress for the minimal progress line
  useEffect(() => {
    let frameId = 0
    const updateScrollProgress = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / docHeight)) : 0
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

  // Section observer for accurate navigation highlight
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const sectionElements = links
      .map(link => document.getElementById(link.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!sectionElements.length) return

    let frameId = 0
    const updateActiveSection = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0

        // If in hero or near top, no active navigation item
        if (window.scrollY < window.innerHeight * 0.4) {
          setActiveSection('')
          return
        }

        const midPoint = window.innerHeight * 0.42
        let current = ''

        for (let i = 0; i < sectionElements.length; i++) {
          const el = sectionElements[i]
          const rect = el.getBoundingClientRect()
          if (rect.top <= midPoint && rect.bottom >= midPoint * 0.3) {
            current = el.id
          }
        }

        // Check if user scrolled all the way to bottom (contact)
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
          current = 'contact'
        }

        setActiveSection(prev => (prev === current ? prev : current))
      })
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection, { passive: true })
    updateActiveSection()

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
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

      {/* Subtle Scroll Progress Indicator */}
      <div className="scroll-progress-track" aria-hidden="true">
        <div ref={progressRef} className="scroll-progress-bar" />
      </div>
    </header>
  )
}
