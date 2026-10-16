import { useMemo } from 'react'
import * as THREE from 'three'

export function GroundPlane({ position = [0, -3.2, 0] }: { position?: [number, number, number] }) {
  // Soft radial contact shadow texture generated procedurally
  const shadowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)')
      gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.52)')
      gradient.addColorStop(0.68, 'rgba(0, 0, 0, 0.18)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 256)
    }
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  const materials = useMemo(() => {
    // Deep dark metallic reflective floor with specular roughness
    const floor = new THREE.MeshStandardMaterial({
      color: '#060806',
      roughness: 0.28,
      metalness: 0.94,
    })

    // Subtle orthogonal coordinate lines
    const gridLines = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.032,
    })

    // Concentric radial coordinate target rings
    const ringLines = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.07,
    })

    // Contact shadow material
    const contactShadow = shadowTexture
      ? new THREE.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          opacity: 0.82,
          depthWrite: false,
        })
      : null

    return { floor, gridLines, ringLines, contactShadow }
  }, [shadowTexture])

  const { gridGeometry, ringGeometries } = useMemo(() => {
    // 1. Orthogonal coordinate grid
    const points: THREE.Vector3[] = []
    const size = 40
    const step = 2.5

    for (let i = -size; i <= size; i += step) {
      points.push(new THREE.Vector3(i, 0.01, -size))
      points.push(new THREE.Vector3(i, 0.01, size))
      points.push(new THREE.Vector3(-size, 0.01, i))
      points.push(new THREE.Vector3(size, 0.01, i))
    }

    const gridGeo = new THREE.BufferGeometry().setFromPoints(points)

    // 2. Concentric radial target rings beneath the sculpture
    const radii = [3.5, 7.5, 13, 20, 28]
    const rings = radii.map((radius) => {
      const ringPts: THREE.Vector3[] = []
      const segments = 80
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2
        ringPts.push(new THREE.Vector3(Math.cos(theta) * radius, 0.02, Math.sin(theta) * radius))
      }
      return new THREE.BufferGeometry().setFromPoints(ringPts)
    })

    return { gridGeometry: gridGeo, ringGeometries: rings }
  }, [])

  return (
    <group position={position}>
      {/* Physical Floor Mesh with Soft Shadow Reception */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={materials.floor}>
        <planeGeometry args={[90, 90]} />
      </mesh>

      {/* Realistic Soft Contact Shadow directly beneath the core sculpture */}
      {materials.contactShadow && (
        <mesh position={[1.15, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.contactShadow}>
          <planeGeometry args={[8.5, 8.5]} />
        </mesh>
      )}

      {/* Subtle Orthogonal Ground Grid */}
      <lineSegments geometry={gridGeometry} material={materials.gridLines} />

      {/* Radial Metric Target Rings */}
      {ringGeometries.map((geo, idx) => (
        <lineSegments key={idx} geometry={geo} material={materials.ringLines} />
      ))}
    </group>
  )
}
