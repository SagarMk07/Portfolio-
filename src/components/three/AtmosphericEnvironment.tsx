import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface AtmosphericEnvironmentProps {
  activeSection?: string
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function AtmosphericEnvironment({
  activeSection = 'hero',
  mouseRef,
}: AtmosphericEnvironmentProps) {
  // References
  const bgGridRef = useRef<THREE.GridHelper>(null)
  const midPointsRef = useRef<THREE.Points>(null)
  const fgPointsRef = useRef<THREE.Points>(null)
  const streakRef = useRef<THREE.LineSegments>(null)

  // ----------------------------------------------------
  // LAYER 1 — BACKGROUND (z ≈ -12 to -14): Subtle spatial coordinate matrix
  // ----------------------------------------------------

  // ----------------------------------------------------
  // LAYER 2 — MIDGROUND (z ≈ -2 to +2): Ambient computational dust & nodes
  // ----------------------------------------------------
  const midCount = 45
  const [midPositions, midScales] = useMemo(() => {
    const pos = new Float32Array(midCount * 3)
    const sca = new Float32Array(midCount)

    for (let i = 0; i < midCount; i++) {
      const radius = 2.2 + Math.random() * 7.5
      const theta = Math.random() * Math.PI * 2
      pos[i * 3] = Math.cos(theta) * radius
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7.5
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4.0 // z in [-2, 2]
      sca[i] = Math.random() * 0.02 + 0.012
    }
    return [pos, sca]
  }, [midCount])

  const midGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(midPositions, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(midScales, 1))
    return geo
  }, [midPositions, midScales])

  const midMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#707569',
      size: 0.018,
      transparent: true,
      opacity: 0.20,
      depthWrite: false,
    })
  }, [])

  // ----------------------------------------------------
  // LAYER 3 — FOREGROUND (z ≈ +3.5 to +5.5): Sparse optical micro-particles & light traces
  // ----------------------------------------------------
  const fgCount = 10
  const [fgPositions, fgScales] = useMemo(() => {
    const pos = new Float32Array(fgCount * 3)
    const sca = new Float32Array(fgCount)

    for (let i = 0; i < fgCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 6.5
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4.0
      pos[i * 3 + 2] = 3.6 + Math.random() * 1.8 // z in [3.6, 5.4]
      sca[i] = Math.random() * 0.024 + 0.014
    }
    return [pos, sca]
  }, [fgCount])

  const fgGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(fgScales, 1))
    return geo
  }, [fgPositions, fgScales])

  const fgMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#c7ff3d',
      size: 0.022,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  // Foreground optical trace lines (occasional subtle photon vectors crossing camera plane)
  const streakGeometry = useMemo(() => {
    const points: number[] = []
    const lines = 4
    for (let i = 0; i < lines; i++) {
      const x = (Math.random() - 0.5) * 6
      const y = (Math.random() - 0.5) * 3.5
      const z = 3.8 + Math.random() * 1.4
      const len = 0.6 + Math.random() * 0.8
      points.push(x, y, z)
      points.push(x + len, y + (Math.random() - 0.5) * 0.2, z)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [])

  const streakMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  // Dynamic frame loop with differential movement speeds for genuine parallax depth
  useFrame((state, delta) => {
    const mouse = mouseRef.current
    const time = state.clock.getElapsedTime()
    const isContact = activeSection === 'contact'
    const speedMult = isContact ? 0.08 : 1.0

    // 1. Background Grid (slowest parallax: 0.05x)
    if (bgGridRef.current) {
      bgGridRef.current.position.x = THREE.MathUtils.lerp(
        bgGridRef.current.position.x,
        mouse.x * 0.08,
        0.03
      )
      bgGridRef.current.position.y = THREE.MathUtils.lerp(
        bgGridRef.current.position.y,
        -0.8 - mouse.y * 0.05,
        0.03
      )
    }

    // 2. Midground Dust (moderate drift: 0.35x)
    if (midPointsRef.current) {
      midPointsRef.current.rotation.y += delta * 0.018 * speedMult
      midPointsRef.current.position.x = THREE.MathUtils.lerp(
        midPointsRef.current.position.x,
        mouse.x * 0.32,
        0.04
      )
      midPointsRef.current.position.y = THREE.MathUtils.lerp(
        midPointsRef.current.position.y,
        -mouse.y * 0.22,
        0.04
      )
    }

    // 3. Foreground Micro-Particles (fastest parallax: 1.2x)
    if (fgPointsRef.current) {
      fgPointsRef.current.position.x = THREE.MathUtils.lerp(
        fgPointsRef.current.position.x,
        mouse.x * 0.85,
        0.05
      )
      fgPointsRef.current.position.y = THREE.MathUtils.lerp(
        fgPointsRef.current.position.y,
        -mouse.y * 0.55,
        0.05
      )
      fgPointsRef.current.rotation.z += delta * 0.012 * speedMult
    }

    // 4. Optical Trace Streaks
    if (streakRef.current) {
      streakRef.current.position.x = THREE.MathUtils.lerp(
        streakRef.current.position.x,
        mouse.x * 0.9 + Math.sin(time * 0.4) * 0.15,
        0.05
      )
      streakRef.current.position.y = THREE.MathUtils.lerp(
        streakRef.current.position.y,
        -mouse.y * 0.6,
        0.05
      )
      streakMaterial.opacity = (0.16 + Math.sin(time * 1.8) * 0.08) * speedMult
    }

    // Opacity fade in contact section
    const targetMidOpacity = isContact ? 0.02 : 0.20
    midMaterial.opacity = THREE.MathUtils.lerp(midMaterial.opacity, targetMidOpacity, 0.06)

    const targetFgOpacity = isContact ? 0.01 : 0.26
    fgMaterial.opacity = THREE.MathUtils.lerp(fgMaterial.opacity, targetFgOpacity, 0.06)
  })

  return (
    <group>
      {/* LAYER 1: Background Spatial Grid (z ≈ -14, oriented on vertical plane) */}
      <group position={[0, -0.8, -14]}>
        <gridHelper
          ref={bgGridRef}
          args={[40, 40, '#182014', '#0b0f09']}
          rotation={[Math.PI / 2, 0, 0]}
        />
      </group>

      {/* LAYER 2: Midground Ambient Atmospheric Dust (z in [-2, 2]) */}
      <points ref={midPointsRef} geometry={midGeometry} material={midMaterial} />

      {/* LAYER 3: Foreground Sparse Optical Micro-Particles (z in [3.5, 5.5]) */}
      <points ref={fgPointsRef} geometry={fgGeometry} material={fgMaterial} />

      {/* LAYER 3: Foreground Subtle Optical Photon Trace Vectors */}
      <lineSegments ref={streakRef} geometry={streakGeometry} material={streakMaterial} />
    </group>
  )
}
