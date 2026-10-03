import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const links = [{ label: 'WORK', href: '/#work' }, { label: 'ABOUT', href: '/#about' }, { label: 'STACK', href: '/#stack' }, { label: 'CONTACT', href: '/#contact' }]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  useEffect(() => { const update = () => setScrolled(window.scrollY > 20); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, [])
  useEffect(() => setOpen(false), [location.pathname, location.hash])
  return <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
    <Link className="brand" to="/" aria-label="Sagar Kalagudi home"><span>SAGAR</span><i>/</i><span>MK</span></Link>
    <nav className={open ? 'nav-open' : ''} aria-label="Main navigation">{links.map(link => <a href={link.href} key={link.label}>{link.label}</a>)}<a className="nav-external" href="https://github.com/SagarMk07" target="_blank" rel="noreferrer" aria-label="GitHub profile"><ArrowUpRight size={15}/></a></nav>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X/> : <Menu/>}</button>
  </header>
}
