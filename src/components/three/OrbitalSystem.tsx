import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface OrbitalSystemProps {
  activeProjectIndex?: number
  activeSection?: string
}

export function OrbitalSystem({ activeProjectIndex = -1, activeSection = 'hero' }: OrbitalSystemProps) {
  const ring1Ref = useRef<THREE.Group>(null)
  const ring2Ref = useRef<THREE.Group>(null)
  const ring3Ref = useRef<THREE.Group>(null)
  const satellitesGroupRef = useRef<THREE.Group>(null)

  // Geometries and materials
  const { ring1Geo, ring2Geo, ring3Geo, nodeGeo, satGeo, gimbalMat, accentMat, satMat } = useMemo(() => {
    const r1 = new THREE.TorusGeometry(2.2, 0.024, 16, 90)
    const r2 = new THREE.TorusGeometry(2.65, 0.02, 16, 90)
    const r3 = new THREE.TorusGeometry(3.15, 0.016, 16, 90)
    const nGeo = new THREE.SphereGeometry(0.065, 12, 12)
    const sGeo = new THREE.SphereGeometry(0.075, 12, 12)

    // Brushed titanium / tungsten physical material
    const gMat = new THREE.MeshStandardMaterial({
      color: '#1a1d17',
      metalness: 0.90,
      roughness: 0.25,
    })
    const aMat = new THREE.MeshStandardMaterial({
      color: '#c7ff3d',
      emissive: '#c7ff3d',
      emissiveIntensity: 1.2,
      metalness: 0.6,
      roughness: 0.18,
    })
    const sMat = new THREE.MeshStandardMaterial({
      color: '#f1f1ed',
      emissive: '#c7ff3d',
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.82,
    })

    return {
      ring1Geo: r1,
      ring2Geo: r2,
      ring3Geo: r3,
      nodeGeo: nGeo,
      satGeo: sGeo,
      gimbalMat: gMat,
      accentMat: aMat,
      satMat: sMat,
    }
  }, [])

  // 8 satellite node coordinates along outer orbital circumference
  const satellitePositions = useMemo(() => {
    const count = 8
    const points: [number, number, number][] = []
    const r = 3.15
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      points.push([Math.cos(angle) * r, Math.sin(angle) * r, 0])
    }
    return points
  }, [])

  useFrame((_, delta) => {
    // Project-reactive dynamics
    let ring1Speed = 0.35
    let ring2Speed = 0.4
    let ring3Speed = 0.22

    if (activeProjectIndex === 0) {
      // MedAssist AI: High frequency rotation & heightened caliber pulse
      ring1Speed = 1.05
      ring2Speed = 0.85
      accentMat.emissiveIntensity = 2.4
    } else if (activeProjectIndex === 1) {
      // SmartShopper Guardian: Angular ring 2 surge
      ring2Speed = 1.15
      ring1Speed = 0.5
      accentMat.emissiveIntensity = 1.4
    } else if (activeProjectIndex === 2) {
      // Trip Planner: Broad outer orbital velocity
      ring3Speed = 0.65
      ring1Speed = 0.4
      accentMat.emissiveIntensity = 1.2
    } else if (activeProjectIndex === 3) {
      // Rainwater: Deep contemplative harmonic roll
      ring1Speed = 0.2
      ring2Speed = 0.22
      ring3Speed = 0.15
      accentMat.emissiveIntensity = 1.0
    } else {
      accentMat.emissiveIntensity = 1.2
    }

    // In contact section, decelerate orbital rings toward quiet standstill
    const sectionMultiplier = activeSection === 'contact' ? 0.03 : 1.0
    ring1Speed *= sectionMultiplier
    ring2Speed *= sectionMultiplier
    ring3Speed *= sectionMultiplier

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * ring1Speed
      ring1Ref.current.rotation.y += delta * (ring1Speed * 0.4)
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * ring2Speed
      ring2Ref.current.rotation.z += delta * (ring2Speed * 0.6)
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * ring3Speed
      ring3Ref.current.rotation.x -= delta * (ring3Speed * 0.7)
    }
    if (satellitesGroupRef.current) {
      satellitesGroupRef.current.rotation.z += delta * 0.3 * sectionMultiplier
    }
  })

  return (
    <group>
      {/* 1. Inner Ring (Pitch/Yaw) */}
      <group ref={ring1Ref}>
        <mesh geometry={ring1Geo} material={gimbalMat} />
        <mesh position={[2.2, 0, 0]} geometry={nodeGeo} material={accentMat} />
        <mesh position={[-2.2, 0, 0]} geometry={nodeGeo} material={accentMat} />
      </group>

      {/* 2. Middle Ring (Angled Roll) */}
      <group ref={ring2Ref} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <mesh geometry={ring2Geo} material={gimbalMat} />
        <mesh position={[0, 2.65, 0]} geometry={nodeGeo} material={accentMat} />
        <mesh position={[0, -2.65, 0]} geometry={nodeGeo} material={accentMat} />
      </group>

      {/* 3. Outer Ring with 8 Satellites */}
      <group ref={ring3Ref} rotation={[-Math.PI / 5, Math.PI / 4, 0]}>
        <mesh geometry={ring3Geo} material={gimbalMat} />
        <group ref={satellitesGroupRef}>
          {satellitePositions.map((pos, idx) => (
            <mesh
              key={idx}
              position={pos}
              geometry={satGeo}
              material={idx % 2 === 0 ? accentMat : satMat}
            />
          ))}
        </group>
      </group>
    </group>
  )
}
