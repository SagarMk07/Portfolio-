import { useEffect, useState } from 'react'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: -80, y: -80 })
  const [label, setLabel] = useState('')
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const move = (event: MouseEvent) => { setPosition({ x: event.clientX, y: event.clientY }); setVisible(true); const target = (event.target as HTMLElement).closest<HTMLElement>('[data-cursor]'); setLabel(target?.dataset.cursor ?? '') }
    const leave = () => setVisible(false)
    window.addEventListener('mousemove', move); document.addEventListener('mouseleave', leave)
    return () => { window.removeEventListener('mousemove', move); document.removeEventListener('mouseleave', leave) }
  }, [])
  return <div aria-hidden="true" className={`custom-cursor ${label ? 'cursor-active' : ''} ${visible ? 'cursor-visible' : ''}`} style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}><span>{label}</span></div>
}
