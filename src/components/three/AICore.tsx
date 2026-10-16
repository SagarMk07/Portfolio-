import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface AICoreProps {
  position?: [number, number, number]
  scale?: number
  activeSection?: string
  activeProjectIndex?: number
  isHovered?: boolean
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function AICore({
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

  // ----------------------------------------------------
  // MATERIALS: Studio PBR titanium, faceted gunmetal, & acid-lime emission
  // ----------------------------------------------------
  const materials = useMemo(() => {
    // 1. Outer Dark Titanium Shell
    const exoskeleton = new THREE.MeshStandardMaterial({
      color: '#10130e',
      metalness: 0.95,
      roughness: 0.16,
      flatShading: true,
    })

    const exoskeletonEdges = new THREE.LineBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.38,
    })

    const exoskeletonCage = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.18,
    })

    const cornerNode = new THREE.MeshStandardMaterial({
      color: '#e4e7df',
      emissive: '#c7ff3d',
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.9,
    })

    // 2. Middle Aerospace Orbital Gimbal Rings (Brushed titanium)
    const ringMat = new THREE.MeshStandardMaterial({
      color: '#1b1e18',
      metalness: 0.92,
      roughness: 0.22,
    })

    const tickMat = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.45,
    })

    const telemetryBeamMat = new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.12,
    })

    const satelliteMat = new THREE.MeshStandardMaterial({
      color: '#f4f5f0',
      emissive: '#c7ff3d',
      emissiveIntensity: 0.7,
      metalness: 0.88,
      roughness: 0.18,
    })

    // 3. Inner Crystalline Octahedron
    const crystal = new THREE.MeshStandardMaterial({
      color: '#161c12',
      metalness: 0.88,
      roughness: 0.10,
      flatShading: true,
    })

    // 4. Quantum Emissive Nucleus
    const nucleus = new THREE.MeshStandardMaterial({
      color: '#c7ff3d',
      emissive: '#c7ff3d',
      emissiveIntensity: 2.2,
      roughness: 0.08,
      metalness: 0.4,
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
      nucleus,
    }
  }, [])

  // ----------------------------------------------------
  // GEOMETRIES: Polyhedral monolith, aerospace gimbals, & telemetry ticks
  // ----------------------------------------------------
  const geometries = useMemo(() => {
    // Outer Shell
    const exoGeo = new THREE.IcosahedronGeometry(1.5, 0)
    const exoEdges = new THREE.EdgesGeometry(exoGeo)
    const exoCageGeo = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1.72, 0))
    const cornerNodeGeo = new THREE.SphereGeometry(0.065, 12, 12)
    const bracketGeo = new THREE.BoxGeometry(0.12, 0.08, 0.14)

    // Two Aerospace Rings (Ring 1: radius 2.35, Ring 2: radius 2.85)
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.024, 16, 96)
    const ring2Geo = new THREE.TorusGeometry(2.85, 0.02, 16, 96)
    const satGeo = new THREE.SphereGeometry(0.07, 12, 12)

    // Aerospace Caliber Tick Marks along Ring 1
    const tickPoints: number[] = []
    const tickCount = 36
    const r1 = 2.35
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2
      const inner = r1 - 0.07
      const outer = r1 + 0.07
      tickPoints.push(Math.cos(angle) * inner, Math.sin(angle) * inner, 0)
      tickPoints.push(Math.cos(angle) * outer, Math.sin(angle) * outer, 0)
    }
    const ticksGeo = new THREE.BufferGeometry()
    ticksGeo.setAttribute('position', new THREE.Float32BufferAttribute(tickPoints, 3))

    // Satellite Telemetry Connecting Laser Vectors from Ring 2 to Ring 1
    const beamPoints: number[] = []
    const satCount = 8
    const r2 = 2.85
    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2
      beamPoints.push(Math.cos(angle) * r2, Math.sin(angle) * r2, 0)
      beamPoints.push(Math.cos(angle) * r1, Math.sin(angle) * r1, 0)
    }
    const beamsGeo = new THREE.BufferGeometry()
    beamsGeo.setAttribute('position', new THREE.Float32BufferAttribute(beamPoints, 3))

    // Inner Crystalline & Nucleus
    const crystalGeo = new THREE.OctahedronGeometry(0.95, 0)
    const nucleusGeo = new THREE.OctahedronGeometry(0.48, 0)

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
      nucleusGeo,
    }
  }, [])

  // Corner coordinates extracted from exoskeleton vertices
  const cornerPositions = useMemo(() => {
    const posAttr = geometries.exoGeo.attributes.position
    const points: [number, number, number][] = []
    const seen = new Set<string>()

    for (let i = 0; i < posAttr.count; i++) {
      const x = Number(posAttr.getX(i).toFixed(3))
      const y = Number(posAttr.getY(i).toFixed(3))
      const z = Number(posAttr.getZ(i).toFixed(3))
      const key = `${x},${y},${z}`
      if (!seen.has(key)) {
        seen.add(key)
        points.push([x, y, z])
      }
    }
    return points
  }, [geometries.exoGeo])

  // 8 Satellite orbital coordinates along Ring 2
  const satellitePositions = useMemo(() => {
    const count = 8
    const points: [number, number, number][] = []
    const r = 2.85
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      points.push([Math.cos(angle) * r, Math.sin(angle) * r, 0])
    }
    return points
  }, [])

  // ----------------------------------------------------
  // FRAME ANIMATION & PHYSICAL PROXIMITY INTERPOLATION
  // ----------------------------------------------------
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()
    const mouse = mouseRef.current
    const isContact = activeSection === 'contact'
    const contactDamping = isContact ? 0.04 : 1.0

    // Compute pointer proximity to center-right core (hero focal point)
    const coreScreenX = activeSection === 'hero' ? 0.35 : 0.0
    const coreScreenY = 0.0
    const distSq = (mouse.x - coreScreenX) ** 2 + (mouse.y - coreScreenY) ** 2
    const targetProximity = isHovered || distSq < 0.35 ? Math.max(0, 1 - Math.sqrt(distSq) / 0.8) : 0

    // Smoothly damp proximity factor
    proximityRef.current = THREE.MathUtils.lerp(proximityRef.current, targetProximity, 0.05)
    const prox = proximityRef.current

    // 1. Root group gentle physical levitation and mouse tilt
    if (rootGroupRef.current) {
      const floatY = Math.sin(time * 0.9) * 0.1 * contactDamping
      rootGroupRef.current.position.y = THREE.MathUtils.lerp(
        rootGroupRef.current.position.y,
        position[1] + floatY,
        0.06
      )
      rootGroupRef.current.position.x = THREE.MathUtils.lerp(
        rootGroupRef.current.position.x,
        position[0] + mouse.x * 0.35 * contactDamping,
        0.05
      )
      rootGroupRef.current.position.z = THREE.MathUtils.lerp(
        rootGroupRef.current.position.z,
        position[2] + prox * 0.22,
        0.06
      )

      // Damped mechanical angular tilt (never raw coordinates)
      const targetRotX = mouse.y * 0.16 * contactDamping
      const targetRotY = mouse.x * 0.22 * contactDamping
      rootGroupRef.current.rotation.x = THREE.MathUtils.lerp(rootGroupRef.current.rotation.x, targetRotX, 0.05)
      rootGroupRef.current.rotation.y = THREE.MathUtils.lerp(rootGroupRef.current.rotation.y, targetRotY, 0.05)

      // Section scale transitions
      let targetScale = scale
      if (isContact) {
        targetScale = 0.0001 // Dissolve into quantum singularity
      } else if (activeSection === 'stack') {
        targetScale = scale * 0.42
      } else if (activeSection === 'about') {
        targetScale = scale * 0.88
      }
      rootGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootGroupRef.current.scale.x, targetScale, 0.06)
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
      0.06
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

    // 4. Inner Crystalline Octahedron: Counter-rotation
    if (crystalCoreRef.current) {
      crystalCoreRef.current.rotation.y -= delta * 0.28 * contactDamping
      crystalCoreRef.current.rotation.z += delta * 0.22 * contactDamping
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
      0.08
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
      {/* 1. OUTER STRUCTURE: Dark Titanium Polyhedral Shell */}
      <mesh
        ref={exoRef}
        geometry={geometries.exoGeo}
        material={materials.exoskeleton}
        castShadow
        receiveShadow
      >
        {cornerPositions.map((pos, idx) => (
          <mesh
            key={idx}
            position={pos}
            geometry={geometries.cornerNodeGeo}
            material={materials.cornerNode}
          />
        ))}
      </mesh>

      {/* Structural Beveled Edges */}
      <lineSegments
        ref={exoEdgesRef}
        geometry={geometries.exoEdges}
        material={materials.exoskeletonEdges}
      />

      {/* Structural Concentric Exoskeleton Armature Cage */}
      <lineSegments
        ref={exoCageRef}
        geometry={geometries.exoCageGeo}
        material={materials.exoskeletonCage}
      />

      {/* 2. MIDDLE STRUCTURE: Two Independent Orbital Mechanical Rings */}
      {/* Ring 1 (Pitch/Yaw with aerospace caliber ticks & mechanical bracket mounts) */}
      <group ref={ring1GroupRef}>
        <mesh geometry={geometries.ring1Geo} material={materials.ringMat} />
        <lineSegments geometry={geometries.ticksGeo} material={materials.tickMat} />
        <mesh position={[2.35, 0, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
        <mesh position={[-2.35, 0, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
        <mesh position={[0, 2.35, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
        <mesh position={[0, -2.35, 0]} geometry={geometries.bracketGeo} material={materials.ringMat} />
      </group>

      {/* Ring 2 (Angled roll with 8 satellites & telemetry laser vectors) */}
      <group ref={ring2GroupRef} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <mesh geometry={geometries.ring2Geo} material={materials.ringMat} />
        <lineSegments geometry={geometries.beamsGeo} material={materials.telemetryBeamMat} />
        <group ref={satellitesGroupRef}>
          {satellitePositions.map((pos, idx) => (
            <mesh
              key={idx}
              position={pos}
              geometry={geometries.satGeo}
              material={materials.satelliteMat}
            />
          ))}
        </group>
      </group>

      {/* 3. INNER NUCLEUS: Crystalline Octahedron & Pulsing Emissive Core */}
      <mesh
        ref={crystalCoreRef}
        geometry={geometries.crystalGeo}
        material={materials.crystal}
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
    </group>
  )
}
