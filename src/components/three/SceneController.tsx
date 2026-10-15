import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'

interface SceneControllerProps {
  activeSection: string
  scrollProgress: number
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
  onCoreTransform: (transform: { position: [number, number, number]; scale: number }) => void
}

export function SceneController({
  activeSection,
  scrollProgress,
  mouseRef,
  onCoreTransform,
}: SceneControllerProps) {
  const { camera } = useThree()
  const targetCamPos = useRef(new THREE.Vector3(0, 0.4, 6.8))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    const mouse = mouseRef.current
    const isMobile = window.innerWidth < 768

    // Base coordinates
    let camX = 0
    let camY = 0.4
    let camZ = 6.8
    let lookX = 0
    let lookY = 0
    let lookZ = 0

    let coreX = isMobile ? 0 : 1.15
    let coreY = isMobile ? 0.35 : 0
    let coreZ = 0
    let coreScale = isMobile ? 0.82 : 1.25

    // 7-State continuous camera & core journey
    if (activeSection === 'hero') {
      // 01 HERO: Core dominant in center-right, framing the oversized left typography
      coreX = isMobile ? 0 : 1.15
      coreY = isMobile ? 0.35 : 0
      coreZ = 0
      coreScale = isMobile ? 0.82 : 1.25
      camX = 0
      camY = 0.4
      camZ = 6.8
    } else if (activeSection === 'work') {
      // 02 WORK: Camera dollys in, Core shifts rightward, creating a stage companion
      coreX = isMobile ? 0 : 3.2
      coreY = -0.3
      coreZ = -1.0
      coreScale = isMobile ? 0.65 : 0.95
      camX = isMobile ? 0 : 0.6
      camY = 0.1
      camZ = 7.2
    } else if (activeSection === 'about') {
      // 03 ABOUT: Camera orbits around the core, framing 'I BUILD INTELLIGENT SYSTEMS'
      coreX = isMobile ? 0 : -2.8
      coreY = 0.2
      coreZ = -0.8
      coreScale = isMobile ? 0.65 : 0.9
      camX = isMobile ? 0 : -0.8
      camY = 0.3
      camZ = 6.4
    } else if (activeSection === 'build-log') {
      // 04 BUILD LOG: Camera moves through the computational environment
      coreX = 0
      coreY = -0.25
      coreZ = -2.0
      coreScale = isMobile ? 0.55 : 0.75
      camX = 0
      camY = 0.15
      camZ = 7.0
    } else if (activeSection === 'stack') {
      // 05 STACK: Camera moves closer into 3D network, Core steps down
      coreX = 0
      coreY = -1.9
      coreZ = -3.2
      coreScale = 0.45
      camX = 0
      camY = 0
      camZ = 5.6
    } else if (activeSection === 'github') {
      // 06 GITHUB: Wide data perspective, data streams intensify
      coreX = 0
      coreY = -0.2
      coreZ = -2.0
      coreScale = isMobile ? 0.55 : 0.75
      camX = 0
      camY = 0.2
      camZ = 7.8
    } else if (activeSection === 'contact') {
      // 07 CONTACT: Cinematic pull-back, Core dissolves into quantum singularity
      coreX = 0
      coreY = 0
      coreZ = -5
      coreScale = 0.0001
      camX = 0
      camY = 0
      camZ = 10.5
    }

    // Continuous subtle scroll depth progression
    const scrollDepth = (scrollProgress - 0.5) * 0.35
    camZ += scrollDepth

    // Pass computed object transform to parent
    onCoreTransform({
      position: [coreX, coreY, coreZ],
      scale: coreScale,
    })

    // Cinematic mouse parallax (controlled, 5-15px equivalent)
    targetCamPos.current.set(
      camX + mouse.x * (isMobile ? 0.1 : 0.35),
      camY - mouse.y * (isMobile ? 0.08 : 0.25),
      camZ
    )
    targetLookAt.current.set(lookX, lookY, lookZ)

    // Smooth non-linear interpolation
    camera.position.lerp(targetCamPos.current, 0.05)
    currentLookAt.current.lerp(targetLookAt.current, 0.05)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
