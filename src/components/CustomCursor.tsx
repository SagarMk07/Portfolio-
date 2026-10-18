import { useEffect, useRef, useState } from 'react'

type CursorState = 'default' | 'interactive' | 'project' | 'core'
type CursorTheme = 'dark' | 'lime'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const pointerRef = useRef<{
    x: number
    y: number
    hasPosition: boolean
    theme: CursorTheme
    state: CursorState
  }>({
    x: -100,
    y: -100,
    hasPosition: false,
    theme: 'dark',
    state: 'default',
  })

  // Detect desktop device with fine pointer and hover support
  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const syncAvailability = () => setEnabled(finePointer.matches)

    syncAvailability()
    finePointer.addEventListener('change', syncAvailability)
    return () => {
      finePointer.removeEventListener('change', syncAvailability)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    const cursor = document.querySelector<HTMLElement>('.custom-cursor')
    if (!cursor) return

    let frameId = 0
    let lastRenderedTheme: CursorTheme = 'dark'
    let lastRenderedState: CursorState = 'default'

    // High-performance single RAF render loop
    const render = () => {
      frameId = 0
      const pointer = pointerRef.current
      if (!pointer.hasPosition) return

      // Hardware accelerated translate3d directly to mouse tip with zero lag
      cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`

      if (lastRenderedTheme !== pointer.theme) {
        cursor.dataset.theme = pointer.theme
        lastRenderedTheme = pointer.theme
      }
      if (lastRenderedState !== pointer.state) {
        cursor.dataset.state = pointer.state
        lastRenderedState = pointer.state
      }
    }

    const scheduleRender = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render)
      }
    }

    // Zero-reflow O(1) event target inspection (NO document.elementsFromPoint)
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return

      pointerRef.current.x = event.clientX
      pointerRef.current.y = event.clientY
      pointerRef.current.hasPosition = true

      const target = event.target as HTMLElement | null
      if (target) {
        // Surface detection via data-cursor-theme
        const themed = target.closest<HTMLElement>('[data-cursor-theme]')
        if (themed?.dataset.cursorTheme === 'lime') {
          pointerRef.current.theme = 'lime'
        } else {
          pointerRef.current.theme = 'dark'
        }

        // 4 precise interactive states
        if (target.closest('[data-cursor-3d="true"]')) {
          pointerRef.current.state = 'core'
        } else if (target.closest('.project-row, .project-stage, .project-art-link, .project-preview-card')) {
          pointerRef.current.state = 'project'
        } else if (target.closest('a, button, input, textarea, [tabindex="0"], [role="button"], [role="tab"]')) {
          pointerRef.current.state = 'interactive'
        } else {
          pointerRef.current.state = 'default'
        }
      }

      cursor.dataset.visible = 'true'
      scheduleRender()
    }

    // IntersectionObserver on surface themes to maintain theme during scroll without mouse movement
    const themeSections = document.querySelectorAll<HTMLElement>('[data-cursor-theme]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const theme = (entry.target as HTMLElement).dataset.cursorTheme as CursorTheme
            if (theme) {
              pointerRef.current.theme = theme
              scheduleRender()
            }
          }
        }
      },
      { threshold: 0.25 }
    )

    themeSections.forEach((el) => observer.observe(el))

    const hide = (clearPosition = true) => {
      cursor.dataset.visible = 'false'
      if (clearPosition) pointerRef.current.hasPosition = false
    }

    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide()
    }
    const onWindowBlur = () => hide(false)
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') hide(false)
    }

    root.classList.add('has-custom-cursor')
    cursor.dataset.visible = 'false'
    cursor.dataset.theme = 'dark'
    cursor.dataset.state = 'default'

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
    window.addEventListener('blur', onWindowBlur)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', onWindowBlur)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
      root.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className="custom-cursor"
      aria-hidden="true"
      data-theme="dark"
      data-state="default"
      data-visible="false"
    >
      <span className="custom-cursor__dot" />
      <span className="custom-cursor__ring" />
    </div>
  )
}
