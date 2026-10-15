import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface ParticleFieldProps {
  count?: number
  visible?: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function ParticleField({ count = 280, visible = true, mouseRef }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sca = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Cylindrical / spherical volume around the center
      const theta = Math.random() * Math.PI * 2
      const radius = 3 + Math.random() * 18
      const x = Math.cos(theta) * radius
      const y = (Math.random() - 0.5) * 16
      const z = (Math.random() - 0.5) * 16

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z

      sca[i] = Math.random() * 0.05 + 0.02
    }

    return [pos, sca]
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1))
    return geo
  }, [positions, scales])

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#c7ff3d',
      size: 0.045,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((state) => {
    if (!pointsRef.current) return
    const time = state.clock.getElapsedTime()
    const mouse = mouseRef.current

    // Slow ambient drift
    pointsRef.current.rotation.y = time * 0.02 + mouse.x * 0.1
    pointsRef.current.rotation.x = Math.sin(time * 0.015) * 0.05 + mouse.y * 0.08

    // Visibility transition
    const targetOpacity = visible ? 0.35 : 0
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.08)
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
