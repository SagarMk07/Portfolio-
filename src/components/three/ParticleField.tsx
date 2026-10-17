import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface ParticleFieldProps {
  count?: number
  visible?: boolean
  activeSection?: string
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function ParticleField({ count = 95, visible = true, activeSection = 'hero', mouseRef }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sca = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Atmospheric distribution surrounding the computational room
      const theta = Math.random() * Math.PI * 2
      const radius = 2.5 + Math.random() * 16
      const x = Math.cos(theta) * radius
      const y = (Math.random() - 0.5) * 14
      const z = (Math.random() - 0.5) * 14

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      sca[i] = Math.random() * 0.03 + 0.015
    }

    return [pos, sca]
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
    return geo
  }, [positions, scales])

  // Subtle neutral atmospheric dust (not distracting neon particles)
  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#8b8e84',
      size: 0.024,
      transparent: true,
      opacity: 0.22,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current) return
    const mouse = mouseRef.current

    // In contact section, dust decelerates to near standstill
    const speedMultiplier = activeSection === 'contact' ? 0.08 : 1.0

    // Ultra-slow ambient atmospheric drift with delta-scaled damping
    const damp30 = 1 - Math.exp(-3.0 * delta)
    const damp48 = 1 - Math.exp(-4.8 * delta)

    pointsRef.current.rotation.y += delta * 0.018 * speedMultiplier
    pointsRef.current.rotation.x = THREE.MathUtils.lerp(
      pointsRef.current.rotation.x,
      mouse.y * 0.04,
      damp30
    )

    // Visibility transition
    const targetOpacity = visible && activeSection !== 'contact' ? 0.22 : 0.02
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, damp48)
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
