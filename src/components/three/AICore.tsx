import { useRef, useMemo, memo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface AICoreProps {
  coreTransformRef?: React.MutableRefObject<{ position: [number, number, number]; scale: number }>
  position?: [number, number, number]
  scale?: number
  activeSection?: string
  activeProjectIndex?: number
  isHovered?: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

type AICoreMaterials = ReturnType<typeof useAICoreMaterials>
type AICoreGeometries = ReturnType<typeof useAICoreGeometries>

function useAICoreMaterials() {
  return useMemo(() => {
    // 1. Outer Dark Titanium Shell (translucent faceted sheen reveals inner quantum core)
    const exoskeleton = new THREE.MeshStandardMaterial({
      color: '#1a2217',
      metalness: 0.92,
      roughness: 0.28,
      flatShading: true,
      transparent: true,
      opacity: 0.76,
    })

    const exoskeletonEdges = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.42,
    })

    const exoskeletonCage = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.16,
    })

    const cornerNode = new THREE.MeshStandardMaterial({
      color: '#dbe2d4',
      emissive: '#c7ff3d',
      emissiveIntensity: 0.5,
      roughness: 0.22,
      metalness: 0.88,
    })

    // 2. Middle Aerospace Orbital Gimbal Rings (Brushed titanium)
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#20251c',
      metalness: 0.94,
      roughness: 0.20,
    })

    const tickMat = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.45,
    })

    // Share identical acid-lime line material with exoskeletonCage
    const telemetryBeamMat = exoskeletonCage

    // Share titanium emissive PBR material with cornerNode
    const satelliteMat = cornerNode

    // 3. Inner Crystalline Octahedron & Luminous Edges
    const crystal = new THREE.MeshStandardMaterial({
      color: '#131e11',
      metalness: 0.86,
      roughness: 0.12,
      flatShading: true,
      transparent: true,
      opacity: 0.82,
    })

    const crystalEdgesMat = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.65,
    })

    // 4. Quantum Emissive Nucleus
    const nucleus = new THREE.MeshStandardMaterial({
      color: '#c7ff3d',
      emissive: '#c7ff3d',
      emissiveIntensity: 2.8,
      roughness: 0.06,
      metalness: 0.35,
    })

    return {
      exoskeleton,
      exoskeletonEdges,
      exoskeletonCage,
      cornerNode,
      ringMat,
      tickMat,
      telemetryBeamMat,
      satelliteMat,
      crystal,
      crystalEdgesMat,
      nucleus,
    }
  }, [])
}

function useAICoreGeometries() {
  return useMemo(() => {
    // Outer Shell (radius 1.45)
    const exoGeo = new THREE.IcosahedronGeometry(1.45, 0)
    const exoEdges = new THREE.EdgesGeometry(exoGeo)
    const exoCageGeo = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1.68, 0))
    const cornerNodeGeo = new THREE.SphereGeometry(0.038, 12, 12)
    const bracketGeo = new THREE.BoxGeometry(0.10, 0.07, 0.12)

    // Two Aerospace Rings (Ring 1: radius 2.05, Ring 2: radius 2.42)
    const ring1Geo = new THREE.TorusGeometry(2.05, 0.022, 16, 96)
    const ring2Geo = new THREE.TorusGeometry(2.42, 0.018, 16, 96)
    const satGeo = cornerNodeGeo

    // Aerospace Caliber Tick Marks along Ring 1
    const tickPoints: number[] = []
    const tickCount = 36
    const r1 = 2.05
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2
      const inner = r1 - 0.06
      const outer = r1 + 0.06
      tickPoints.push(Math.cos(angle) * inner, Math.sin(angle) * inner, 0)
      tickPoints.push(Math.cos(angle) * outer, Math.sin(angle) * outer, 0)
    }
    const ticksGeo = new THREE.BufferGeometry()
    ticksGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPoints, 3))

    // Satellite Telemetry Connecting Laser Vectors from Ring 2 to Ring 1
    const beamPoints: number[] = []
    const satCount = 8
    const r2 = 2.42
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2
      beamPoints.push(Math.cos(angle) * r2, Math.sin(angle) * r2, 0)
      beamPoints.push(Math.cos(angle) * r1, Math.sin(angle) * r1, 0)
    }
    const beamsGeo = new THREE.BufferGeometry()
    beamsGeo.setAttribute('position', new THREE.Float32BufferAttribute(beamPoints, 3))

    // Inner Crystalline & Nucleus
    const crystalGeo = new THREE.OctahedronGeometry(0.98, 0)
    const crystalEdges = new THREE.EdgesGeometry(crystalGeo)
    const nucleusGeo = new THREE.OctahedronGeometry(0.48, 0)

    // Corner coordinates extracted from exoskeleton vertices
    const posAttr = exoGeo.attributes.position
    const cornerPositions: [number, number, number][] = []
    const seen = new Set<string>()

    for (let i = 0; i < posAttr.count; i++) {
      const x = Number(posAttr.getX(i).toFixed(3))
      const y = Number(posAttr.getY(i).toFixed(3))
      const z = Number(posAttr.getZ(i).toFixed(3))
      const key = `${x},${y},${z}`
      if (!seen.has(key)) {
        seen.add(key)
        cornerPositions.push([x, y, z])
      }
    }

    // 8 Satellite orbital coordinates along Ring 2
    const satellitePositions: [number, number, number][] = []
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2
      satellitePositions.push([Math.cos(angle) * r2, Math.sin(angle) * r2, 0])
    }

    return {
      exoGeo,
      exoEdges,
      exoCageGeo,
      cornerNodeGeo,
      bracketGeo,
      ring1Geo,
      ring2Geo,
      satGeo,
      ticksGeo,
      beamsGeo,
      crystalGeo,
      crystalEdges,
      nucleusGeo,
      cornerPositions,
      satellitePositions,
    }
  }, [])
}

function ExoskeletonShell({
  exoRef,
  exoEdgesRef,
  exoCageRef,
  geometries,
  materials,
}: {
  exoRef: React.RefObject<THREE.Mesh | null>
  exoEdgesRef: React.RefObject<THREE.LineSegments | null>
  exoCageRef: React.RefObject<THREE.LineSegments | null>
  geometries: AICoreGeometries
  materials: AICoreMaterials
}) {
  return (
    <>
      <mesh
        ref={exoRef}
        geometry={geometries.exoGeo}
        material={materials.exoskeleton}
        castShadow
        receiveShadow
      >
        {geometries.cornerPositions.map((pos) => (
          <mesh
            key={`node-${pos[0]}_${pos[1]}_${pos[2]}`}
            position={pos}
            geometry={geometries.cornerNodeGeo}
            material={materials.cornerNode}
          />
        ))}
      </mesh>

      <lineSegments
        ref={exoEdgesRef}
        geometry={geometries.exoEdges}
        material={materials.exoskeletonEdges}
      />

      <lineSegments
        ref={exoCageRef}
        geometry={geometries.exoCageGeo}
        material={materials.exoskeletonCage}
      />
    </>
  )
}

function OrbitalGimbalRings({
  ring1GroupRef,
  ring2GroupRef,
  satellitesGroupRef,
  geometries,
  materials,
}: {
  ring1GroupRef: React.RefObject<THREE.Group | null>
  ring2GroupRef: React.RefObject<THREE.Group | null>
  satellitesGroupRef: React.RefObject<THREE.Group | null>
  geometries: AICoreGeometries
  materials: AICoreMaterials
}) {
  return (
    <>
      <group ref={ring1GroupRef}>
        <mesh geometry={geometries.ring1Geo} material={materials.ringMat} />
        <lineSegments geometry={geometries.ticksGeo} material={materials.tickMat} />
        <mesh position={[2.05, 0, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
        <mesh position={[-2.05, 0, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
        <mesh position={[0, 2.05, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
        <mesh position={[0, -2.05, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
      </group>

      <group ref={ring2GroupRef} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <mesh geometry={geometries.ring2Geo} material={materials.ringMat} />
        <lineSegments geometry={geometries.beamsGeo} material={materials.telemetryBeamMat} />
        <group ref={satellitesGroupRef}>
          {geometries.satellitePositions.map((pos) => (
            <mesh
              key={`sat-${pos[0]}_${pos[1]}_${pos[2]}`}
              position={pos}
              geometry={geometries.satGeo}
              material={materials.satelliteMat}
            />
          ))}
        </group>
      </group>
    </>
  )
}

function QuantumCoreNucleus({
  crystalCoreRef,
  crystalEdgesRef,
  nucleusRef,
  pointLightRef,
  geometries,
  materials,
}: {
  crystalCoreRef: React.RefObject<THREE.Mesh | null>
  crystalEdgesRef: React.RefObject<THREE.LineSegments | null>
  nucleusRef: React.RefObject<THREE.Mesh | null>
  pointLightRef: React.RefObject<THREE.PointLight | null>
  geometries: AICoreGeometries
  materials: AICoreMaterials
}) {
  return (
    <>
      <mesh
        ref={crystalCoreRef}
        geometry={geometries.crystalGeo}
        material={materials.crystal}
      />
      <lineSegments
        ref={crystalEdgesRef}
        geometry={geometries.crystalEdges}
        material={materials.crystalEdgesMat}
      />
      <mesh
        ref={nucleusRef}
        geometry={geometries.nucleusGeo}
        material={materials.nucleus}
      />
      <pointLight
        ref={pointLightRef}
        color="#c7ff3d"
        intensity={2.5}
        distance={9}
        decay={2}
      />
    </>
  )
}

function AICoreComponent({
  coreTransformRef,
  position = [1.15, 0, 0],
  scale = 1.25,
  activeSection = 'hero',
  activeProjectIndex = -1,
  isHovered = false,
  mouseRef,
}: AICoreProps) {
  // References
  const rootGroupRef = useRef<THREE.Group>(null)
  const exoRef = useRef<THREE.Mesh>(null)
  const exoEdgesRef = useRef<THREE.LineSegments>(null)
  const exoCageRef = useRef<THREE.LineSegments>(null)
  const crystalCoreRef = useRef<THREE.Mesh>(null)
  const crystalEdgesRef = useRef<THREE.LineSegments>(null)
  const nucleusRef = useRef<THREE.Mesh>(null)
  const pointLightRef = useRef<THREE.PointLight>(null)

  // Orbital Ring References
  const ring1GroupRef = useRef<THREE.Group>(null)
  const ring2GroupRef = useRef<THREE.Group>(null)
  const satellitesGroupRef = useRef<THREE.Group>(null)

  // Interactive animated state refs (damped smoothly)
  const proximityRef = useRef<number>(0)
  const currentRingScaleRef = useRef<number>(1)
  const currentEmissiveRef = useRef<number>(2.2)

  const materials = useAICoreMaterials()
  const geometries = useAICoreGeometries()

  // Frame animation loop with delta-scaled damping
  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const mouse = mouseRef.current
    const isContact = activeSection === 'contact'
    const contactDamping = isContact ? 0.04 : 1.0
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Target coordinates from shared ref or base props
    const targetPos = coreTransformRef ? coreTransformRef.current.position : position
    const targetBaseScale = coreTransformRef ? coreTransformRef.current.scale : scale

    // Compute pointer proximity to center-right core (hero focal point)
    const coreScreenX = activeSection === 'hero' ? 0.35 : 0.0
    const coreScreenY = 0.0
    const distSq = (mouse.x - coreScreenX) ** 2 + (mouse.y - coreScreenY) ** 2
    const targetProximity = (isHovered || distSq < 0.35) && !reduceMotion ? Math.max(0, 1 - Math.sqrt(distSq) / 0.8) : 0

    // Frame-rate independent exponential damping factors
    const damp3 = 1 - Math.exp(-3.0 * delta)
    const damp36 = 1 - Math.exp(-3.6 * delta)
    const damp48 = 1 - Math.exp(-4.8 * delta)

    // Smoothly damp proximity factor
    proximityRef.current = THREE.MathUtils.lerp(proximityRef.current, targetProximity, damp3)
    const prox = proximityRef.current

    // 1. Root group gentle physical levitation and mouse tilt
    if (rootGroupRef.current) {
      const floatY = reduceMotion ? 0 : Math.sin(time * 0.9) * 0.1 * contactDamping
      const mouseOffsetX = reduceMotion ? 0 : mouse.x * 0.35 * contactDamping
      const mouseOffsetZ = reduceMotion ? 0 : prox * 0.22

      rootGroupRef.current.position.y = THREE.MathUtils.lerp(
        rootGroupRef.current.position.y,
        targetPos[1] + floatY,
        damp36
      )
      rootGroupRef.current.position.x = THREE.MathUtils.lerp(
        rootGroupRef.current.position.x,
        targetPos[0] + mouseOffsetX,
        damp3
      )
      rootGroupRef.current.position.z = THREE.MathUtils.lerp(
        rootGroupRef.current.position.z,
        targetPos[2] + mouseOffsetZ,
        damp36
      )

      // Damped mechanical angular tilt (never raw coordinates)
      const targetRotX = reduceMotion ? 0 : mouse.y * 0.16 * contactDamping
      const targetRotY = reduceMotion ? 0 : mouse.x * 0.22 * contactDamping
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetRotX, damp3)
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, damp3)

      // Section scale transitions
      let targetScale = targetBaseScale
      if (isContact) {
        targetScale = 0.0001 // Dissolve into quantum singularity
      } else if (activeSection === 'stack') {
        targetScale = targetBaseScale * 0.42
      } else if (activeSection === 'about') {
        targetScale = targetBaseScale * 0.88
      }
      rootGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootGroupRef.current.scale.x, targetScale, damp36)
      )
    }

    // 2. Outer Faceted Shell: slow, intentional, mechanical rotation
    let organicScale = 1.0
    if (activeProjectIndex === 3) {
      organicScale = 1.0 + Math.sin(time * 1.6) * 0.09
      materials.exoskeleton.roughness = 0.26
    } else {
      materials.exoskeleton.roughness = 0.16
    }

    if (exoRef.current) {
      exoRef.current.rotation.x += delta * 0.14 * contactDamping
      exoRef.current.rotation.y += delta * 0.18 * contactDamping
      exoRef.current.scale.setScalar(organicScale)
    }
    if (exoEdgesRef.current) {
      exoEdgesRef.current.rotation.x = exoRef.current?.rotation.x || 0
      exoEdgesRef.current.rotation.y = exoRef.current?.rotation.y || 0
      exoEdgesRef.current.scale.setScalar(organicScale)
    }
    if (exoCageRef.current) {
      exoCageRef.current.rotation.y -= delta * 0.12 * contactDamping
      exoCageRef.current.rotation.z += delta * 0.10 * contactDamping
      exoCageRef.current.scale.setScalar(organicScale)
    }

    // 3. Middle Aerospace Orbital Rings: Independent CW and CCW rotations
    let ring1Speed = (0.28 + prox * 0.22) * contactDamping
    let ring2Speed = (0.34 + prox * 0.26) * contactDamping

    if (activeProjectIndex === 0) {
      ring1Speed *= 2.2
      ring2Speed *= 1.8
    } else if (activeProjectIndex === 1) {
      ring2Speed *= 2.4
    }

    // Ring expansion when cursor approaches
    const targetRingScale = 1.0 + prox * 0.12
    currentRingScaleRef.current = THREE.MathUtils.lerp(
      currentRingScaleRef.current,
      targetRingScale,
      damp36
    )

    if (ring1GroupRef.current) {
      ring1GroupRef.current.rotation.x += delta * ring1Speed
      ring1GroupRef.current.rotation.y += delta * (ring1Speed * 0.35)
      ring1GroupRef.current.scale.setScalar(currentRingScaleRef.current)
    }
    if (ring2GroupRef.current) {
      ring2GroupRef.current.rotation.y -= delta * ring2Speed
      ring2GroupRef.current.rotation.z += delta * (ring2Speed * 0.45)
      ring2GroupRef.current.scale.setScalar(currentRingScaleRef.current)
    }
    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.z += delta * (0.26 + prox * 0.2) * contactDamping
    }

    // 4. Inner Crystalline Octahedron & Luminous Edges: Counter-rotation
    if (crystalCoreRef.current) {
      crystalCoreRef.current.rotation.y -= delta * 0.28 * contactDamping
      crystalCoreRef.current.rotation.z += delta * 0.22 * contactDamping
    }
    if (crystalEdgesRef.current) {
      crystalEdgesRef.current.rotation.y = crystalCoreRef.current?.rotation.y || 0
      crystalEdgesRef.current.rotation.z = crystalCoreRef.current?.rotation.z || 0
    }

    // 5. Quantum Emissive Nucleus: Breathing & Proximity Brightening
    let pulseFrequency = 2.4
    if (activeProjectIndex === 0) pulseFrequency = 4.0
    else if (activeProjectIndex === 1) pulseFrequency = 3.0
    else if (activeProjectIndex === 2) pulseFrequency = 2.0
    else if (activeProjectIndex === 3) pulseFrequency = 1.6

    // Proximity elevates emissive intensity from 2.2 up to 3.4
    const targetEmissive = (2.2 + prox * 1.2 + Math.sin(time * pulseFrequency) * 0.4) * contactDamping
    currentEmissiveRef.current = THREE.MathUtils.lerp(
      currentEmissiveRef.current,
      targetEmissive,
      damp48
    )
    materials.nucleus.emissiveIntensity = currentEmissiveRef.current

    if (nucleusRef.current) {
      const pulse = (1 + Math.sin(time * pulseFrequency) * 0.16 + prox * 0.08) * contactDamping
      nucleusRef.current.scale.setScalar(pulse)
      nucleusRef.current.rotation.x += delta * 0.45 * contactDamping
      nucleusRef.current.rotation.z -= delta * 0.35 * contactDamping
    }

    if (pointLightRef.current) {
      pointLightRef.current.intensity = (2.2 + prox * 1.5 + Math.sin(time * pulseFrequency) * 0.8) * contactDamping
    }
  })

  return (
    <group ref={rootGroupRef} position={position}>
      <ExoskeletonShell
        exoRef={exoRef}
        exoEdgesRef={exoEdgesRef}
        exoCageRef={exoCageRef}
        geometries={geometries}
        materials={materials}
      />
      <OrbitalGimbalRings
        ring1GroupRef={ring1GroupRef}
        ring2GroupRef={ring2GroupRef}
        satellitesGroupRef={satellitesGroupRef}
        geometries={geometries}
        materials={materials}
      />
      <QuantumCoreNucleus
        crystalCoreRef={crystalCoreRef}
        crystalEdgesRef={crystalEdgesRef}
        nucleusRef={nucleusRef}
        pointLightRef={pointLightRef}
        geometries={geometries}
        materials={materials}
      />
    </group>
  )
}

export const AICore = memo(AICoreComponent)
