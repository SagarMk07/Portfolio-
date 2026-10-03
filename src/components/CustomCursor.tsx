import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

type CursorState = 'default' | 'view' | 'explore' | 'code' | 'open'

const cursorLabels: Record<Exclude<CursorState, 'default'>, string> = {
  view: 'VIEW →',
  explore: 'EXPLORE →',
  code: 'CODE →',
  open: 'OPEN →',
}

const interactiveStates = new Set<string>(Object.keys(cursorLabels))

function resolveCursorState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default'

  const targetElement = target.closest<HTMLElement>('[data-cursor]')
  const state = targetElement?.dataset.cursor?.toLowerCase()
  return state && interactiveStates.has(state) ? state as CursorState : 'default'
}

type PointerPosition = {
  targetX: number
  targetY: number
  currentX: number
  currentY: number
  targetParallaxX: number
  targetParallaxY: number
  currentParallaxX: number
  currentParallaxY: number
  hasPosition: boolean
}

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const positionRef = useRef<PointerPosition>({
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    targetParallaxX: 0,
    targetParallaxY: 0,
    currentParallaxX: 0,
    currentParallaxY: 0,
    hasPosition: false,
  })
  const [enabled, setEnabled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const touchPointer = window.matchMedia('(any-pointer: coarse)')
    const motionAllowed = window.matchMedia('(prefers-reduced-motion: no-preference)')
    const syncAvailability = () => setEnabled(finePointer.matches && !touchPointer.matches && motionAllowed.matches)

    syncAvailability()
    finePointer.addEventListener('change', syncAvailability)
    touchPointer.addEventListener('change', syncAvailability)
    motionAllowed.addEventListener('change', syncAvailability)

    return () => {
      finePointer.removeEventListener('change', syncAvailability)
      touchPointer.removeEventListener('change', syncAvailability)
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
    let heroSurface = document.querySelector<HTMLElement>('.hero-surface')
    const position = positionRef.current
    let frame = 0

    root.classList.add('has-custom-cursor')
    position.hasPosition = false
    cursor.dataset.visible = 'false'
    cursor.dataset.state = 'default'

    const syncState = (target: EventTarget | null) => {
      const state = resolveCursorState(target)
      if (cursor.dataset.state === state) return

      cursor.dataset.state = state
      label.textContent = state === 'default' ? '' : cursorLabels[state]
    }

    const animate = () => {
      frame = 0

      const deltaX = position.targetX - position.currentX
      const deltaY = position.targetY - position.currentY
      const cursorDistance = Math.hypot(deltaX, deltaY)
      const follow = cursorDistance > 120 ? 0.88 : 0.62
      position.currentX = cursorDistance < 0.35 ? position.targetX : position.currentX + deltaX * follow
      position.currentY = cursorDistance < 0.35 ? position.targetY : position.currentY + deltaY * follow
      cursor.style.transform = `translate3d(${position.currentX}px, ${position.currentY}px, 0)`

      const parallaxDeltaX = position.targetParallaxX - position.currentParallaxX
      const parallaxDeltaY = position.targetParallaxY - position.currentParallaxY
      position.currentParallaxX = Math.abs(parallaxDeltaX) < 0.05 ? position.targetParallaxX : position.currentParallaxX + parallaxDeltaX * 0.22
      position.currentParallaxY = Math.abs(parallaxDeltaY) < 0.05 ? position.targetParallaxY : position.currentParallaxY + parallaxDeltaY * 0.22

      if (heroSurface) {
        heroSurface.style.setProperty('--px', `${position.currentParallaxX}px`)
        heroSurface.style.setProperty('--py', `${position.currentParallaxY}px`)
      }

      const cursorMoving = cursorDistance >= 0.35
      const parallaxMoving = Math.abs(position.targetParallaxX - position.currentParallaxX) >= 0.05
        || Math.abs(position.targetParallaxY - position.currentParallaxY) >= 0.05
      if (cursorMoving || parallaxMoving) frame = window.requestAnimationFrame(animate)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return

      position.targetX = event.clientX
      position.targetY = event.clientY
      if (!position.hasPosition) {
        position.currentX = event.clientX
        position.currentY = event.clientY
        position.hasPosition = true
      }

      const targetElement = event.target instanceof Element ? event.target : null
      const nextHeroSurface = targetElement?.closest<HTMLElement>('.hero')?.querySelector<HTMLElement>('.hero-surface') ?? null
      if (heroSurface !== nextHeroSurface) {
        heroSurface?.style.setProperty('--px', '0px')
        heroSurface?.style.setProperty('--py', '0px')
        heroSurface = nextHeroSurface
      }
      position.targetParallaxX = heroSurface ? (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 14 : 0
      position.targetParallaxY = heroSurface ? (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 14 : 0

      if (cursor.dataset.visible !== 'true') cursor.dataset.visible = 'true'
      syncState(event.target)
      if (!frame) frame = window.requestAnimationFrame(animate)
    }

    const hide = () => {
      cursor.dataset.visible = 'false'
      syncState(null)
      position.hasPosition = false
      position.targetParallaxX = 0
      position.targetParallaxY = 0
      position.currentParallaxX = 0
      position.currentParallaxY = 0
      if (heroSurface) {
        heroSurface.style.setProperty('--px', '0px')
        heroSurface.style.setProperty('--py', '0px')
      }
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', hide)
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', hide)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', hide)
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', hide)
      root.classList.remove('has-custom-cursor')
      position.hasPosition = false
      if (heroSurface) {
        heroSurface.style.setProperty('--px', '0px')
        heroSurface.style.setProperty('--py', '0px')
      }
    }
  }, [enabled])

  if (!enabled) return null

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" data-state="default" data-visible="false">
    <span className="custom-cursor__dot" />
    <span className="custom-cursor__pill"><span ref={labelRef} className="custom-cursor__label" /></span>
  </div>
}
