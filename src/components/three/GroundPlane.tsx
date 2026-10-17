import { useMemo, useRef, memo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface GroundPlaneProps {
  position?: [number, number, number]
  coreTransformRef?: React.MutableRefObject<{ position: [number, number, number]; scale: number }>
  coreX?: number
  coreZ?: number
  coreScale?: number
}

function GroundPlaneComponent({
  position = [0, -3.2, 0],
  coreTransformRef,
  coreX = 1.15,
  coreZ = 0,
  coreScale = 1.25,
}: GroundPlaneProps) {
  const shadowMeshRef = useRef<THREE.Mesh>(null)

  // Soft radial contact shadow texture generated procedurally (optimized 128x128)
  const shadowTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.90)')
      gradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.55)')
      gradient.addColorStop(0.68, 'rgba(0, 0, 0, 0.20)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const tex = new THREE.CanvasTexture(canvas)
    tex.generateMipmaps = false
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
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

  const { gridGeometry, ringsGeometry } = useMemo(() => {
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

    // 2. Concentric radial target rings merged into a single geometry (single draw call)
    const ringPts: THREE.Vector3[] = []
    const radii = [3.5, 7.5, 13, 20, 28]
    const segments = 64
    for (const radius of radii) {
      for (let s = 0; s < segments; s++) {
        const theta1 = (s / segments) * Math.PI * 2
        const theta2 = ((s + 1) / segments) * Math.PI * 2
        ringPts.push(new THREE.Vector3(Math.cos(theta1) * radius, 0.02, Math.sin(theta1) * radius))
        ringPts.push(new THREE.Vector3(Math.cos(theta2) * radius, 0.02, Math.sin(theta2) * radius))
      }
    }
    const ringsGeo = new THREE.BufferGeometry().setFromPoints(ringPts)

    return { gridGeometry: gridGeo, ringsGeometry: ringsGeo }
  }, [])

  // Smoothly lerp contact shadow position and scale to match core sculpture coordinates
  useFrame(() => {
    if (shadowMeshRef.current && materials.contactShadow) {
      const targetCoreX = coreTransformRef ? coreTransformRef.current.position[0] : coreX
      const targetCoreZ = coreTransformRef ? coreTransformRef.current.position[2] : coreZ
      const targetCoreScale = coreTransformRef ? coreTransformRef.current.scale : coreScale

      shadowMeshRef.current.position.x = THREE.MathUtils.lerp(
        shadowMeshRef.current.position.x,
        targetCoreX,
        0.06
      )
      shadowMeshRef.current.position.y = 0.012
      shadowMeshRef.current.position.z = THREE.MathUtils.lerp(
        shadowMeshRef.current.position.z,
        targetCoreZ,
        0.06
      )
      const targetScale = Math.max(0.0001, targetCoreScale * 0.95)
      shadowMeshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(shadowMeshRef.current.scale.x, targetScale, 0.06)
      )
      materials.contactShadow.opacity = Math.min(0.85, Math.max(0.02, targetCoreScale * 0.65))
    }
  })

  return (
    <group position={position}>
      {/* Physical Floor Mesh with Soft Shadow Reception */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={materials.floor}>
        <planeGeometry args={[90, 90]} />
      </mesh>

      {/* Realistic Soft Contact Shadow dynamically tracking beneath the core sculpture */}
      {materials.contactShadow && (
        <mesh
          ref={shadowMeshRef}
          position={[coreX, 0.012, coreZ]}
          rotation={[-Math.PI / 2, 0, 0]}
          material={materials.contactShadow}
        >
          <planeGeometry args={[7.5, 7.5]} />
        </mesh>
      )}

      {/* Subtle Orthogonal Ground Grid */}
      <lineSegments geometry={gridGeometry} material={materials.gridLines} />

      {/* Radial Metric Target Rings (single draw call) */}
      <lineSegments geometry={ringsGeometry} material={materials.ringLines} />
    </group>
  )
}

export const GroundPlane = memo(GroundPlaneComponent)
