import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type CursorState = 'default' | 'view' | 'open' | 'code' | 'explore' | 'drag'

const cursorLabels: Record<Exclude<CursorState, 'default'>, string> = {
  view: 'VIEW →',
  open: 'OPEN →',
  code: 'CODE →',
  explore: 'EXPLORE →',
  drag: 'DRAG ↔',
}

function resolveCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default'
  const interactive = target.closest<HTMLElement>('[data-cursor]')
  const state = interactive?.dataset.cursor?.toLowerCase()
  return state && Object.prototype.hasOwnProperty.call(cursorLabels, state) ? state as CursorState : 'default'
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const positionRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0, hasPosition: false })
  const [enabled, setEnabled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const syncAvailability = () => setEnabled(finePointer.matches && motionAllowed.matches)
    syncAvailability()
    finePointer.addEventListener('change', syncAvailability)
    motionAllowed.addEventListener('change', syncAvailability)
    return () => {
      finePointer.removeEventListener('change', syncAvailability)
      motionAllowed.removeEventListener('change', syncAvailability)
    }
  }, [])

  useEffect(() => {
    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor || !label) return
    cursor.dataset.state = 'default'
    label.textContent = ''
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!enabled) return
    const cursor = cursorRef.current
    const label = labelRef.current
    if (!cursor || !label) return

    const root = document.documentElement
    root.classList.add('has-custom-cursor')
    const position = positionRef.current
    position.hasPosition = false
    let frame = 0
    let visible = false

    const animate = () => {
      frame = 0
      const deltaX = position.targetX - position.currentX
      const deltaY = position.targetY - position.currentY
      const distance = Math.hypot(deltaX, deltaY)
      const follow = distance > 100 ? 0.82 : 0.48
      position.currentX = distance < 0.5 ? position.targetX : position.currentX + deltaX * follow
      position.currentY = distance < 0.5 ? position.targetY : position.currentY + deltaY * follow
      cursor.style.transform = `translate3d(${position.currentX}px, ${position.currentY}px, 0)`
      if (distance >= 0.5) frame = window.requestAnimationFrame(animate)
    }

    const schedulePosition = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      position.targetX = event.clientX
      position.targetY = event.clientY
      if (!position.hasPosition) {
        position.currentX = position.targetX
        position.currentY = position.targetY
        position.hasPosition = true
      }
      if (!visible) {
        visible = true
        cursor.dataset.visible = 'true'
      }
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const syncState = (target: EventTarget | null) => {
      const state = resolveCursorState(target)
      if (cursor.dataset.state === state) return
      cursor.dataset.state = state
      label.textContent = state === 'default' ? '' : cursorLabels[state]
    }

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') {
        schedulePosition(event)
        syncState(event.target)
      }
    }
    const onPointerOut = (event: PointerEvent) => {
      if (event.pointerType !== 'touch') syncState(event.relatedTarget)
    }
    const hide = () => {
      visible = false
      cursor.dataset.visible = 'false'
      cursor.dataset.state = 'default'
      label.textContent = ''
      position.hasPosition = false
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }

    cursor.dataset.state = 'default'
    cursor.dataset.visible = 'false'
    window.addEventListener('pointermove', schedulePosition, { passive: true })
    document.addEventListener('pointerover', onPointerOver, { passive: true })
    document.addEventListener('pointerout', onPointerOut, { passive: true })
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', hide)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', schedulePosition)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', hide)
      root.classList.remove('has-custom-cursor')
      position.hasPosition = false
    }
  }, [enabled])

  if (!enabled) return null
  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" data-state="default" data-visible="false">
    <span className="custom-cursor__core"><span ref={labelRef} className="custom-cursor__label"/></span>
  </div>
}
