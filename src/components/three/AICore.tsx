import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { OrbitalSystem } from './OrbitalSystem'

interface AICoreProps {
  position?: [number, number, number]
  scale?: number
  activeSection?: string
  activeProjectIndex?: number
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function AICore({
  position = [1.15, 0, 0],
  scale = 1.25,
  activeSection = 'hero',
  activeProjectIndex = -1,
  mouseRef,
}: AICoreProps) {
  const rootGroupRef = useRef<THREE.Group>(null)
  const exoRef = useRef<THREE.Mesh>(null)
  const exoEdgesRef = useRef<THREE.LineSegments>(null)
  const crystalCoreRef = useRef<THREE.Mesh>(null)
  const nucleusRef = useRef<THREE.Mesh>(null)
  const pointLightRef = useRef<THREE.PointLight>(null)

  // Memoized industrial materials
  const materials = useMemo(() => {
    return {
      // Dark gunmetal exoskeleton with specular facets
      exoskeleton: new THREE.MeshStandardMaterial({
        color: '#121410',
        metalness: 0.94,
        roughness: 0.16,
        flatShading: true,
      }),
      exoskeletonEdges: new THREE.LineBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.45,
      }),
      // Crystalline processor core
      crystal: new THREE.MeshStandardMaterial({
        color: '#1a1f16',
        metalness: 0.85,
        roughness: 0.12,
        flatShading: true,
      }),
      // Quantum nucleus with vivid lime emission
      nucleus: new THREE.MeshStandardMaterial({
        color: '#c7ff3d',
        emissive: '#c7ff3d',
        emissiveIntensity: 2.2,
        roughness: 0.1,
        metalness: 0.4,
      }),
      cornerNode: new THREE.MeshStandardMaterial({
        color: '#f1f1ed',
        emissive: '#c7ff3d',
        emissiveIntensity: 0.6,
        roughness: 0.25,
        metalness: 0.8,
      }),
    }
  }, [])

  // Geometries
  const geometries = useMemo(() => {
    // 1. Exoskeleton faceted polyhedron
    const exoGeo = new THREE.IcosahedronGeometry(1.5, 0)
    const exoEdges = new THREE.EdgesGeometry(exoGeo)
    const cornerNode = new THREE.SphereGeometry(0.065, 12, 12)

    // 2. Inner crystalline processor
    const crystalGeo = new THREE.OctahedronGeometry(0.95, 0)

    // 3. Quantum pulsing nucleus
    const nucleusGeo = new THREE.OctahedronGeometry(0.48, 0)

    return {
      exoGeo,
      exoEdges,
      cornerNode,
      crystalGeo,
      nucleusGeo,
    }
  }, [])

  // Corner node coordinates extracted from exoskeleton vertices
  const cornerPositions = useMemo(() => {
    const posAttr = geometries.exoGeo.attributes.position
    const points: [number, number, number][] = []
    const set = new Set<string>()

    for (let i = 0; i < posAttr.count; i++) {
      const x = Number(posAttr.getX(i).toFixed(3))
      const y = Number(posAttr.getY(i).toFixed(3))
      const z = Number(posAttr.getZ(i).toFixed(3))
      const key = `${x},${y},${z}`
      if (!set.has(key)) {
        set.add(key)
        points.push([x, y, z])
      }
    }
    return points
  }, [geometries.exoGeo])

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const mouse = mouseRef.current

    if (rootGroupRef.current) {
      // Smooth physical position lerp
      const floatY = Math.sin(time * 0.95) * 0.12
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(
        rootGroupRef.current.position.y,
        position[1] + floatY,
        0.06
      )
      rootGroupRef.current.position.x = THREE.MathUtils.lerp(
        rootGroupRef.current.position.x,
        position[0] + mouse.x * 0.45,
        0.05
      )
      rootGroupRef.current.position.z = THREE.MathUtils.lerp(
        rootGroupRef.current.position.z,
        position[2],
        0.06
      )

      // Mouse-driven subtle angular tilt (restrained, 5-15px equivalent)
      const targetRotX = mouse.y * 0.18
      const targetRotY = mouse.x * 0.25
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetRotX, 0.05)
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, 0.05)

      // Section scale transitions
      let targetScale = scale
      if (activeSection === 'contact') {
        targetScale = 0.0001 // Dissolve into quantum singularity
      } else if (activeSection === 'stack') {
        targetScale = scale * 0.45 // Step back for 3D Neural Network
      }

      rootGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootGroupRef.current.scale.x, targetScale, 0.06)
      )
    }

    // Dynamic pulse frequency per project
    let pulseFrequency = 2.4
    if (activeProjectIndex === 0) pulseFrequency = 4.2
    else if (activeProjectIndex === 1) pulseFrequency = 3.0
    else if (activeProjectIndex === 2) pulseFrequency = 2.0
    else if (activeProjectIndex === 3) pulseFrequency = 1.6

    // 1. Exoskeleton multi-axis rotation
    if (exoRef.current) {
      exoRef.current.rotation.x += delta * 0.18
      exoRef.current.rotation.y += delta * 0.22
    }
    if (exoEdgesRef.current) {
      exoEdgesRef.current.rotation.x = exoRef.current?.rotation.x || 0
      exoEdgesRef.current.rotation.y = exoRef.current?.rotation.y || 0
    }

    // 2. Crystalline processor reverse counter-rotation
    if (crystalCoreRef.current) {
      crystalCoreRef.current.rotation.y -= delta * 0.32
      crystalCoreRef.current.rotation.z += delta * 0.25
    }

    // 3. Quantum nucleus pulse & point light breathing
    if (nucleusRef.current) {
      const pulse = 1 + Math.sin(time * pulseFrequency) * 0.22
      nucleusRef.current.scale.setScalar(pulse)
      nucleusRef.current.rotation.x += delta * 0.5
      nucleusRef.current.rotation.z -= delta * 0.4
    }
    if (pointLightRef.current) {
      pointLightRef.current.intensity = 2.0 + Math.sin(time * pulseFrequency) * 1.0
    }
  })

  return (
    <group ref={rootGroupRef} position={position}>
      {/* 1. Structural Exoskeleton Monolith */}
      <mesh ref={exoRef} geometry={geometries.exoGeo} material={materials.exoskeleton} castShadow receiveShadow>
        {cornerPositions.map((pos, idx) => (
          <mesh key={idx} position={pos} geometry={geometries.cornerNode} material={materials.cornerNode} />
        ))}
      </mesh>

      {/* Exoskeleton Beveled Edges */}
      <lineSegments ref={exoEdgesRef} geometry={geometries.exoEdges} material={materials.exoskeletonEdges} />

      {/* 2. Inner Crystalline Processor */}
      <mesh ref={crystalCoreRef} geometry={geometries.crystalGeo} material={materials.crystal} />

      {/* 3. Quantum Nucleus (Acid Lime Emissive Center) */}
      <mesh ref={nucleusRef} geometry={geometries.nucleusGeo} material={materials.nucleus} />
      <pointLight ref={pointLightRef} color="#c7ff3d" intensity={2.5} distance={9} decay={2} />

      {/* 4. Modular Orbital Aerospace Gimbal System */}
      <OrbitalSystem activeProjectIndex={activeProjectIndex} activeSection={activeSection} />
    </group>
  )
}
