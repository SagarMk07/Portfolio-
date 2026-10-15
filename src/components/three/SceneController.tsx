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

    // Multi-stage cinematic camera journey linked to scroll and section
    if (activeSection === 'hero' || scrollProgress < 0.14) {
      // Hero: Core is dominant in center-right, framing the oversized left typography
      coreX = isMobile ? 0 : 1.15
      coreY = isMobile ? 0.35 : 0
      coreZ = 0
      coreScale = isMobile ? 0.82 : 1.25
      camX = 0
      camY = 0.4
      camZ = 6.8
    } else if (activeSection === 'work' || (scrollProgress >= 0.14 && scrollProgress < 0.46)) {
      // Work: Camera dollys in, Core shifts rightward, creating a stage companion
      coreX = isMobile ? 0 : 3.2
      coreY = -0.3
      coreZ = -1.0
      coreScale = isMobile ? 0.65 : 0.95
      camX = isMobile ? 0 : 0.6
      camY = 0.1
      camZ = 7.2
    } else if (activeSection === 'about' || (scrollProgress >= 0.46 && scrollProgress < 0.66)) {
      // About: Camera orbits around the core, framing 'I BUILD INTELLIGENT SYSTEMS'
      coreX = isMobile ? 0 : -2.8
      coreY = 0.2
      coreZ = -0.8
      coreScale = isMobile ? 0.65 : 0.9
      camX = isMobile ? 0 : -0.8
      camY = 0.3
      camZ = 6.4
    } else if (activeSection === 'stack' || (scrollProgress >= 0.66 && scrollProgress < 0.84)) {
      // Stack: Camera moves closer into the 3D network, Core steps down/back
      coreX = 0
      coreY = -1.8
      coreZ = -3.2
      coreScale = 0.45
      camX = 0
      camY = 0
      camZ = 5.8
    } else if (scrollProgress >= 0.84 && scrollProgress < 0.92) {
      // Build Log / GitHub: Camera pulls back to wide perspective
      coreX = 0
      coreY = -0.2
      coreZ = -2.0
      coreScale = 0.75
      camX = 0
      camY = 0.2
      camZ = 7.8
    } else if (activeSection === 'contact' || scrollProgress >= 0.92) {
      // Contact: Cinematic pull-back, Core dissolves into quantum singularity
      coreX = 0
      coreY = 0
      coreZ = -5
      coreScale = 0.0001
      camX = 0
      camY = 0
      camZ = 10.5
    }

    // Pass computed object transform to parent
    onCoreTransform({
      position: [coreX, coreY, coreZ],
      scale: coreScale,
    })

    // Cinematic mouse parallax (5-15px equivalent)
    targetCamPos.current.set(
      camX + mouse.x * 0.35,
      camY - mouse.y * 0.25,
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
