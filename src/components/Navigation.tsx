import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useReducedMotion } from 'framer-motion'

const links = [
  { label: 'WORK', href: '/#work' },
  { label: 'ABOUT', href: '/#about' },
  { label: 'STACK', href: '/#stack' },
  { label: 'CONTACT', href: '/#contact' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('')
      return
    }

    const targets = links
      .map(link => document.getElementById(link.href.slice(2)))
      .filter((target): target is HTMLElement => Boolean(target))
    if (!targets.length || !('IntersectionObserver' in window)) return

    const intersecting = new Set<HTMLElement>()
    const updateActive = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement
        if (entry.isIntersecting) intersecting.add(target)
        else intersecting.delete(target)
      })

      const anchorY = Math.max(84, window.innerHeight * 0.45)
      const active = [...intersecting].sort((a, b) =>
        Math.abs(a.getBoundingClientRect().top - anchorY) - Math.abs(b.getBoundingClientRect().top - anchorY),
      )[0]
      const nextSection = active?.id ?? ''
      setActiveSection(current => current === nextSection ? current : nextSection)
    }
    let observer: IntersectionObserver | null = null
    const observeSections = () => {
      observer?.disconnect()
      intersecting.clear()
      observer = new IntersectionObserver(updateActive, {
        rootMargin: `-84px 0px -${Math.round(window.innerHeight * 0.55)}px 0px`,
        threshold: 0,
      })
      targets.forEach(target => observer?.observe(target))
    }

    observeSections()
    window.addEventListener('resize', observeSections, { passive: true })
    return () => {
      window.removeEventListener('resize', observeSections)
      observer?.disconnect()
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

  return <header className="site-header" data-cursor-theme="dark">
    <Link className="brand" to="/" aria-label="Sagar Kalagudi home"><span>SAGAR</span><i>/</i><span>MK</span></Link>
    <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">
      {links.map(link => {
        const section = link.href.slice(2)
        return <Link
          to={link.href}
          key={link.label}
          aria-current={activeSection === section ? 'location' : undefined}
          onClick={event => {
            setOpen(false)
            if (open) menuButtonRef.current?.focus()
            if (location.pathname === '/' && location.hash === `#${section}`) {
              event.preventDefault()
              document.getElementById(section)?.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start',
              })
            }
          }}
        >{link.label}</Link>
      })}
      <a className="nav-external" href="https://github.com/SagarMk07" target="_blank" rel="noreferrer" aria-label="GitHub profile"><ArrowUpRight size={15}/></a>
    </nav>
    <button ref={menuButtonRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X/> : <Menu/>}</button>
  </header>
}
