import { useEffect, useRef, useState } from 'react'

function resolveSurface(x: number, y: number) {
  for (const element of document.elementsFromPoint(x, y)) {
    const themed = element.closest<HTMLElement>('[data-cursor-theme]')
    if (themed?.dataset.cursorTheme === 'lime') return 'lime'
    if (themed?.dataset.cursorTheme === 'dark') return 'dark'
  }
  return 'dark'
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const pointerRef = useRef({ x: -100, y: -100, hasPosition: false })

  useEffect(() => {
    // Only enable on fine pointer desktop devices with hover support
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const touchPointer = window.matchMedia('(any-pointer: coarse)')
    const syncAvailability = () => setEnabled(finePointer.matches && !touchPointer.matches)

    syncAvailability()
    finePointer.addEventListener('change', syncAvailability)
    touchPointer.addEventListener('change', syncAvailability)
    return () => {
      finePointer.removeEventListener('change', syncAvailability)
      touchPointer.removeEventListener('change', syncAvailability)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const root = document.documentElement
    const cursor = document.querySelector<HTMLElement>('.custom-cursor')
    if (!cursor) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const renderPosition = () => {
      frame = 0
      const { x, y } = pointerRef.current
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    const updateCursorState = () => {
      const pointer = pointerRef.current
      if (!pointer.hasPosition) return

      const elements = document.elementsFromPoint(pointer.x, pointer.y)
      const theme = resolveSurface(pointer.x, pointer.y)
      const isProject = elements.some(el => el.closest('.project-row, .project-art-link'))
      const isInteractive = elements.some(el => el.closest('a, button, input, textarea, [tabindex="0"]'))

      cursor.dataset.theme = theme
      cursor.dataset.project = isProject ? 'true' : 'false'
      cursor.dataset.interactive = isInteractive ? 'true' : 'false'
      cursor.dataset.visible = 'true'

      if (reducedMotion.matches) {
        cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      } else if (!frame) {
        frame = window.requestAnimationFrame(renderPosition)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointerRef.current.x = event.clientX
      pointerRef.current.y = event.clientY
      pointerRef.current.hasPosition = true
      updateCursorState()
    }

    const onScroll = () => {
      if (pointerRef.current.hasPosition) {
        updateCursorState()
      }
    }

    const hide = (clearPosition = true) => {
      cursor.dataset.visible = 'false'
      cursor.dataset.project = 'false'
      cursor.dataset.interactive = 'false'
      if (clearPosition) pointerRef.current.hasPosition = false
    }

    const onWindowBlur = () => hide(false)
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') hide(false)
      else updateCursorState()
    }

    root.classList.add('has-custom-cursor')
    cursor.dataset.visible = 'false'
    cursor.dataset.theme = 'dark'
    cursor.dataset.project = 'false'
    cursor.dataset.interactive = 'false'

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', updateCursorState)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('focus', updateCursorState)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      root.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className="custom-cursor"
      aria-hidden="true"
      data-theme="dark"
      data-project="false"
      data-interactive="false"
      data-visible="false"
    >
      <span className="custom-cursor__dot" />
    </div>
  )
}
