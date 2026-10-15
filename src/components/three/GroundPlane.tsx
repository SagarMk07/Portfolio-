import { useMemo } from 'react'
import * as THREE from 'three'

export function GroundPlane({ position = [0, -3.2, 0] }: { position?: [number, number, number] }) {
  const materials = useMemo(() => {
    // Deep dark metallic reflective floor that captures the dynamic lime point light reflections
    const floor = new THREE.MeshStandardMaterial({
      color: '#060806',
      roughness: 0.32,
      metalness: 0.92,
    })

    // Subtle orthogonal grid lines
    const gridLines = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.038,
    })

    // Concentric radial coordinate target rings
    const ringLines = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.09,
    })

    return { floor, gridLines, ringLines }
  }, [])

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

      {/* Subtle Orthogonal Ground Grid */}
      <lineSegments geometry={gridGeometry} material={materials.gridLines} />

      {/* Radial Metric Target Rings */}
      {ringGeometries.map((geo, idx) => (
        <lineSegments key={idx} geometry={geo} material={materials.ringLines} />
      ))}
    </group>
  )
}
