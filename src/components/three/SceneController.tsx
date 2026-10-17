import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

interface SceneControllerProps {
  activeSection: string
  scrollProgressRef: React.MutableRefObject<number>
  isCoreHovered?: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  coreTransformRef: React.MutableRefObject<{ position: [number, number, number]; scale: number }>
}

export function SceneController({
  activeSection,
  scrollProgressRef,
  isCoreHovered = false,
  mouseRef,
  coreTransformRef,
}: SceneControllerProps) {
  const { camera } = useThree()
  const targetCamPos = useMemo(() => new THREE.Vector3(0, 0.4, 6.8), [])
  const targetLookAt = useMemo(() => new THREE.Vector3(0.35, 0.05, 0), [])
  const currentLookAt = useMemo(() => new THREE.Vector3(0.35, 0.05, 0), [])
  const lastScrollProgress = useRef(scrollProgressRef.current)
  const scrollVelocity = useRef(0)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useFrame((_, delta) => {
    const mouse = mouseRef.current
    const w = typeof window !== 'undefined' ? window.innerWidth : 1440

    // Viewport Tier Detection for Precise Spatial Composition
    const isUltraWide = w >= 1600        // 1920x1080+
    const isDesktop = w >= 1280 && w < 1600 // 1440x900, 1280x800
    const isSmallDesktop = w >= 1024 && w < 1280 // 1024x768
    const isTablet = w >= 768 && w < 1024  // 768x1024
    const isMobile = w < 768             // 390x844, 430x932

    // Track scroll velocity for subtle dynamic inertia
    const currentProgress = scrollProgressRef.current
    const rawVelocity = (currentProgress - lastScrollProgress.current) / Math.max(delta, 0.001)
    lastScrollProgress.current = currentProgress
    const velDamp = 1 - Math.exp(-5.0 * delta)
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, rawVelocity, velDamp)

    // Base coordinates
    let camX = 0
    let camY = 0.4
    let camZ = 6.8
    let lookX = 0.35
    let lookY = 0.05
    let lookZ = 0

    let coreX = 1.15
    let coreY = 0
    let coreZ = 0
    let coreScale = 1.35

    // Responsive 7-State continuous camera & core narrative
    if (activeSection === 'hero') {
      // 01 HERO: Core dominant in center-right, framing the oversized left typography
      if (isUltraWide) {
        coreX = 1.05
        coreY = 0.0
        coreScale = 1.25 // Visually dominant focal centerpiece framing left typography
        camZ = isCoreHovered ? 6.75 : 7.0
        lookX = 0.26
      } else if (isDesktop) {
        coreX = 0.95
        coreY = 0.0
        coreScale = 1.12
        camZ = isCoreHovered ? 6.95 : 7.2
        lookX = 0.20
      } else if (isSmallDesktop) {
        coreX = 0.75
        coreY = 0.05
        coreZ = -0.5
        coreScale = 0.95
        camZ = isCoreHovered ? 7.0 : 7.2
        lookX = 0.15
      } else if (isTablet) {
        coreX = 0.0
        coreY = 0.35
        coreZ = -1.5
        coreScale = 0.72
        camZ = 7.6
        lookX = 0.0
        lookY = 0.12
      } else {
        // Mobile 390x844 / 430x932: Centered behind typography in atmospheric depth
        coreX = 0.0
        coreY = 0.45
        coreZ = -2.2
        coreScale = 0.58
        camZ = 8.0
        lookX = 0.0
        lookY = 0.15
      }
      camX = 0
      camY = isMobile ? 0.2 : 0.4
    } else if (activeSection === 'work') {
      // 02 WORK: Camera dollys in, Core shifts rightward, creating a companion frame
      coreX = isMobile ? 0.0 : isTablet ? 1.4 : 2.4
      coreY = isMobile ? -0.5 : -0.3
      coreZ = isMobile ? -2.5 : -1.4
      coreScale = isMobile ? 0.48 : 0.88
      camX = isMobile ? 0.0 : 0.5
      camY = 0.1
      camZ = 7.2
      lookX = isMobile ? 0.0 : 1.0
      lookY = -0.1
      lookZ = -0.4
    } else if (activeSection === 'about') {
      // 03 ABOUT: Ambient depth between left statement and right narrative
      coreX = isMobile ? 0.0 : isTablet ? 0.0 : 0.6
      coreY = isMobile ? 0.3 : 0.1
      coreZ = isMobile ? -2.5 : -2.2
      coreScale = isMobile ? 0.45 : 0.78
      camX = 0.0
      camY = 0.2
      camZ = 6.8
      lookX = 0.0
      lookY = 0.0
      lookZ = -0.3
    } else if (activeSection === 'build-log') {
      // 04 BUILD LOG: Frames the timeline on the left with the core in right midground
      coreX = isMobile ? 0.0 : 1.4
      coreY = -0.15
      coreZ = -2.0
      coreScale = isMobile ? 0.45 : 0.72
      camX = 0
      camY = 0.1
      camZ = 7.0
      lookX = isMobile ? 0.0 : 0.3
      lookY = 0
      lookZ = -1.0
    } else if (activeSection === 'stack') {
      // 05 STACK: Camera moves close to the 3D network, Core steps down
      coreX = 0
      coreY = -2.0
      coreZ = -3.2
      coreScale = 0.40
      camX = 0
      camY = 0
      camZ = 5.6
      lookX = 0
      lookY = -0.2
      lookZ = -0.5
    } else if (activeSection === 'github') {
      // 06 GITHUB: Wide open-source telemetry perspective
      coreX = 0
      coreY = -0.2
      coreZ = -2.0
      coreScale = isMobile ? 0.50 : 0.75
      camX = 0
      camY = 0.2
      camZ = 7.8
      lookX = 0
      lookY = 0
      lookZ = -0.8
    } else if (activeSection === 'contact') {
      // 07 CONTACT: Cinematic pull-back, Core dissolves into quantum singularity
      coreX = 0
      coreY = 0
      coreZ = -5
      coreScale = 0.0001
      camX = 0
      camY = 0
      camZ = 10.5
      lookX = 0
      lookY = 0
      lookZ = 0
    }

    // Scroll depth progression and velocity nudge (subtle, non-linear)
    const scrollDepth = reduceMotion ? 0 : (currentProgress - 0.5) * 0.30 + scrollVelocity.current * 0.06
    camZ += scrollDepth

    // Mutate shared ref directly without triggering React re-renders
    coreTransformRef.current.position[0] = coreX
    coreTransformRef.current.position[1] = coreY
    coreTransformRef.current.position[2] = coreZ
    coreTransformRef.current.scale = coreScale

    // Subconscious mouse parallax with strict bounding (max X = ±0.08, max Y = ±0.05 on desktop)
    const clampedMouseX = reduceMotion ? 0 : Math.max(-1, Math.min(1, mouse.x)) * (isMobile ? 0.02 : 0.08)
    const clampedMouseY = reduceMotion ? 0 : Math.max(-1, Math.min(1, mouse.y)) * (isMobile ? 0.015 : 0.05)

    targetCamPos.set(
      camX + clampedMouseX,
      camY - clampedMouseY,
      camZ
    )
    targetLookAt.set(lookX, lookY, lookZ)

    // Smooth weighted interpolation with frame-rate independent damping
    const camDamp = 1 - Math.exp(-2.8 * delta)
    camera.position.lerp(targetCamPos, camDamp)
    currentLookAt.lerp(targetLookAt, camDamp)
    camera.lookAt(currentLookAt)
  })

  return null
}
