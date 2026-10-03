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
  const pointerRef = useRef({ x: 0, y: 0, hasPosition: false })

  useEffect(() => {
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
    const root = document.documentElement
    let frame = 0
    const cursor = document.querySelector<HTMLElement>('.custom-cursor')

    const syncSurface = () => {
      const scrolled = window.scrollY > 20
      root.dataset.scrolled = String(scrolled)
      const pointer = pointerRef.current
      if (!pointer.hasPosition || !cursor) return
      cursor.dataset.theme = resolveSurface(pointer.x, pointer.y)
      cursor.dataset.project = Boolean(document.elementsFromPoint(pointer.x, pointer.y)
        .some(element => element.closest('.project-row'))).toString()
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        syncSurface()
      })
    }

    syncSurface()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [enabled])

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

    const showAtPointer = () => {
      const pointer = pointerRef.current
      if (!pointer.hasPosition) return
      cursor.dataset.theme = resolveSurface(pointer.x, pointer.y)
      cursor.dataset.project = Boolean(document.elementsFromPoint(pointer.x, pointer.y)
        .some(element => element.closest('.project-row'))).toString()
      cursor.dataset.visible = 'true'
      if (reducedMotion.matches) {
        cursor.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`
      } else if (!frame) {
        frame = window.requestAnimationFrame(renderPosition)
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const pointer = pointerRef.current
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.hasPosition = true
      showAtPointer()
    }

    const hide = (clearPosition = true) => {
      cursor.dataset.visible = 'false'
      cursor.dataset.project = 'false'
      cursor.dataset.theme = 'dark'
      if (clearPosition) pointerRef.current.hasPosition = false
    }
    const onWindowBlur = () => hide(false)
    const onPointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) hide()
    }
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') hide(false)
      else showAtPointer()
    }

    root.classList.add('has-custom-cursor')
    cursor.dataset.visible = 'false'
    cursor.dataset.theme = 'dark'
    cursor.dataset.project = 'false'
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerout', onPointerOut)
    window.addEventListener('blur', onWindowBlur)
    window.addEventListener('focus', showAtPointer)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerout', onPointerOut)
      window.removeEventListener('blur', onWindowBlur)
      window.removeEventListener('focus', showAtPointer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      root.classList.remove('has-custom-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return <div className="custom-cursor" aria-hidden="true" data-theme="dark" data-project="false" data-visible="false">
    <span className="custom-cursor__dot" />
  </div>
}
