import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

interface SceneControllerProps {
  activeSection: string
  scrollProgress: number
  isCoreHovered?: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  onCoreTransform: (transform: { position: [number, number, number]; scale: number }) => void
}

export function SceneController({
  activeSection,
  scrollProgress,
  isCoreHovered = false,
  mouseRef,
  onCoreTransform,
}: SceneControllerProps) {
  const { camera } = useThree()
  const targetCamPos = useRef(new THREE.Vector3(0, 0.4, 6.8))
  const targetLookAt = useRef(new THREE.Vector3(0.35, 0.05, 0))
  const currentLookAt = useRef(new THREE.Vector3(0.35, 0.05, 0))
  const lastScrollProgress = useRef(scrollProgress)
  const scrollVelocity = useRef(0)

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
    const currentProgress = scrollProgress
    const rawVelocity = (currentProgress - lastScrollProgress.current) / Math.max(delta, 0.001)
    lastScrollProgress.current = currentProgress
    scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, rawVelocity, 0.08)

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
        coreX = 1.32
        coreY = 0.0
        coreScale = 1.52 // Visually dominant focal centerpiece on 1920x1080
        camZ = isCoreHovered ? 6.45 : 6.65
        lookX = 0.38
      } else if (isDesktop) {
        coreX = 1.18
        coreY = 0.0
        coreScale = 1.38
        camZ = isCoreHovered ? 6.55 : 6.8
        lookX = 0.32
      } else if (isSmallDesktop) {
        coreX = 0.95
        coreY = 0.05
        coreScale = 1.20
        camZ = isCoreHovered ? 6.8 : 7.0
        lookX = 0.25
      } else if (isTablet) {
        coreX = 0.40
        coreY = 0.20
        coreScale = 0.98
        camZ = 7.2
        lookX = 0.10
      } else {
        // Mobile 390x844 / 430x932: Centered above/between text, simplified camera
        coreX = 0.0
        coreY = 0.32
        coreScale = 0.78
        camZ = 7.5
        lookX = 0.0
        lookY = 0.10
      }
      camX = 0
      camY = isMobile ? 0.2 : 0.4
    } else if (activeSection === 'work') {
      // 02 WORK: Camera dollys in, Core shifts rightward, creating a companion frame
      coreX = isMobile ? 0.0 : isTablet ? 1.8 : 3.2
      coreY = isMobile ? -0.4 : -0.3
      coreZ = isMobile ? -2.2 : -1.0
      coreScale = isMobile ? 0.55 : 0.98
      camX = isMobile ? 0.0 : 0.6
      camY = 0.1
      camZ = 7.2
      lookX = isMobile ? 0.0 : 1.2
      lookY = -0.1
      lookZ = -0.4
    } else if (activeSection === 'about') {
      // 03 ABOUT: Camera orbits around the core to the left flank, calming complexity
      coreX = isMobile ? 0.0 : isTablet ? -1.6 : -2.8
      coreY = isMobile ? 0.4 : 0.2
      coreZ = isMobile ? -2.0 : -0.8
      coreScale = isMobile ? 0.55 : 0.92
      camX = isMobile ? 0.0 : -0.8
      camY = 0.3
      camZ = 6.4
      lookX = isMobile ? 0.0 : -0.9
      lookY = 0.1
      lookZ = -0.3
    } else if (activeSection === 'build-log') {
      // 04 BUILD LOG: Camera moves along central axis through data environment
      coreX = 0
      coreY = -0.25
      coreZ = -2.0
      coreScale = isMobile ? 0.50 : 0.75
      camX = 0
      camY = 0.15
      camZ = 7.0
      lookX = 0
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
    const scrollDepth = (scrollProgress - 0.5) * 0.30 + scrollVelocity.current * 0.06
    camZ += scrollDepth

    // Pass computed object transform to parent
    onCoreTransform({
      position: [coreX, coreY, coreZ],
      scale: coreScale,
    })

    // Subconscious mouse parallax with strict bounding (max X = ±0.08, max Y = ±0.05 on desktop)
    const clampedMouseX = Math.max(-1, Math.min(1, mouse.x)) * (isMobile ? 0.02 : 0.08)
    const clampedMouseY = Math.max(-1, Math.min(1, mouse.y)) * (isMobile ? 0.015 : 0.05)

    targetCamPos.current.set(
      camX + clampedMouseX,
      camY - clampedMouseY,
      camZ
    )
    targetLookAt.current.set(lookX, lookY, lookZ)

    // Smooth weighted interpolation with damping factor 0.045
    camera.position.lerp(targetCamPos.current, 0.045)
    currentLookAt.current.lerp(targetLookAt.current, 0.045)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
