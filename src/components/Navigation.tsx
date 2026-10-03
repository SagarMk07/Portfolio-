import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [{ label: 'WORK', href: '/#work' }, { label: 'ABOUT', href: '/#about' }, { label: 'STACK', href: '/#stack' }, { label: 'CONTACT', href: '/#contact' }]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const scrolledRef = useRef(false)
  const location = useLocation()
  useEffect(() => {
    let frame = 0
    const update = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 20
        if (scrolledRef.current !== nextScrolled) {
          scrolledRef.current = nextScrolled
          setScrolled(nextScrolled)
        }
        frame = 0
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => { window.removeEventListener('scroll', update); if (frame) window.cancelAnimationFrame(frame) }
  }, [])
  useEffect(() => {
    if (location.pathname !== '/') { setActiveSection(''); return }
    const targets = links.map(link => document.querySelector(link.href.replace('/#', '#'))).filter((target): target is Element => Boolean(target))
    if (!targets.length || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (active) setActiveSection((active.target as HTMLElement).id)
    }, { rootMargin: '-18% 0px -68% 0px' })
    targets.forEach(target => observer.observe(target))
    return () => observer.disconnect()
  }, [location.pathname])
  useEffect(() => {
    if (open) menuButtonRef.current?.focus()
    setOpen(false)
  }, [location.pathname, location.hash])
  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButtonRef.current?.focus() }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])
  return <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
    <Link className="brand" to="/" aria-label="Sagar Kalagudi home" data-cursor="view"><span>SAGAR</span><i>/</i><span>MK</span></Link>
    <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">{links.map(link => { const section = link.href.split('#')[1]; return <Link to={link.href} key={link.label} data-cursor="view" aria-current={activeSection === section ? 'location' : undefined} onClick={() => { setOpen(false); if (open) menuButtonRef.current?.focus() }}>{link.label}</Link> })}<a className="nav-external" href="https://github.com/SagarMk07" target="_blank" rel="noreferrer" aria-label="GitHub profile" data-cursor="code"><ArrowUpRight size={15}/></a></nav>
    <button ref={menuButtonRef} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} data-cursor="view">{open ? <X/> : <Menu/>}</button>
  </header>
}
