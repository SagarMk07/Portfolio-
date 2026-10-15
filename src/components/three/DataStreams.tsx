import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface DataStreamsProps {
  visible?: boolean
  activeSection?: string
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function DataStreams({ visible = true, activeSection = 'hero', mouseRef }: DataStreamsProps) {
  const linesRef = useRef<THREE.LineSegments>(null)

  // Generate 24 orthogonal computational data stream tracks
  const { geometry, speeds } = useMemo(() => {
    const streamCount = 28
    const positions = new Float32Array(streamCount * 2 * 3)
    const speedsArray = new Float32Array(streamCount)
    const bounds = { x: 14, y: 7, z: 12 }

    for (let i = 0; i < streamCount; i++) {
      const idx = i * 6
      const speed = 0.4 + Math.random() * 0.8
      speedsArray[i] = speed

      // Mostly horizontal and vertical lines in 3D grid space
      const isHorizontal = i % 2 === 0
      const fixedZ = -6 + Math.random() * 8
      const fixedY = -2.5 + Math.random() * 5

      if (isHorizontal) {
        const startX = -bounds.x + Math.random() * (bounds.x * 2)
        const length = 1.8 + Math.random() * 3.2
        positions[idx] = startX
        positions[idx + 1] = fixedY
        positions[idx + 2] = fixedZ

        positions[idx + 3] = startX + length
        positions[idx + 4] = fixedY
        positions[idx + 5] = fixedZ
      } else {
        const fixedX = -bounds.x + Math.random() * (bounds.x * 2)
        const startY = -bounds.y + Math.random() * (bounds.y * 2)
        const length = 1.2 + Math.random() * 2.5
        positions[idx] = fixedX
        positions[idx + 1] = startY
        positions[idx + 2] = fixedZ

        positions[idx + 3] = fixedX
        positions[idx + 4] = startY + length
        positions[idx + 5] = fixedZ
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    return {
      geometry: geo,
      speeds: speedsArray,
    }
  }, [])

  // Memoized subtle acid lime / white basic line material
  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: '#c7ff3d',
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    })
  }, [])

  useFrame((_, delta) => {
    if (!linesRef.current || !visible) return
    const posAttr = linesRef.current.geometry.attributes.position as THREE.BufferAttribute
    const positions = posAttr.array as Float32Array
    const mouse = mouseRef.current

    // Subtle drift and bounds wrap
    const count = speeds.length
    for (let i = 0; i < count; i++) {
      const idx = i * 6
      const isHorizontal = i % 2 === 0
      const spd = speeds[i] * delta * 1.5

      if (isHorizontal) {
        positions[idx] += spd
        positions[idx + 3] += spd
        if (positions[idx] > 14) {
          const len = positions[idx + 3] - positions[idx]
          positions[idx] = -14
          positions[idx + 3] = -14 + len
        }
      } else {
        positions[idx + 1] += spd * 0.7
        positions[idx + 4] += spd * 0.7
        if (positions[idx + 1] > 6) {
          const len = positions[idx + 4] - positions[idx + 1]
          positions[idx + 1] = -6
          positions[idx + 4] = -6 + len
        }
      }
    }

    // Parallax response
    linesRef.current.position.x = THREE.MathUtils.lerp(
      linesRef.current.position.x,
      mouse.x * 0.2,
      0.05
    )
    linesRef.current.position.y = THREE.MathUtils.lerp(
      linesRef.current.position.y,
      -mouse.y * 0.15,
      0.05
    )

    // Opacity modulation per section
    let targetOpacity = 0.18
    if (activeSection === 'github') targetOpacity = 0.32
    if (activeSection === 'contact') targetOpacity = 0.02
    material.opacity = THREE.MathUtils.lerp(material.opacity, targetOpacity, 0.08)

    posAttr.needsUpdate = true
  })

  if (!visible) return null

  return (
    <lineSegments ref={linesRef} geometry={geometry} material={material} />
  )
}
