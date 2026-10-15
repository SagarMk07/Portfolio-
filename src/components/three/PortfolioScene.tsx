import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { AICore } from './AICore'
import { GroundPlane } from './GroundPlane'
import { NeuralNetwork } from './NeuralNetwork'
import type { TechNodeData } from './NeuralNetwork'
import { ParticleField } from './ParticleField'
import { SceneController } from './SceneController'

interface PortfolioSceneProps {
  activeProjectIndex?: number
  onHoverTechNode?: (node: TechNodeData | null) => void
}

export function PortfolioScene({ activeProjectIndex = -1, onHoverTechNode }: PortfolioSceneProps) {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [coreTransform, setCoreTransform] = useState<{
    position: [number, number, number]
    scale: number
  }>({
    position: [1.15, 0, 0],
    scale: 1.25,
  })

  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    let frameId = 0
    const sections = [
      { id: 'top', name: 'hero' },
      { id: 'work', name: 'work' },
      { id: 'about', name: 'about' },
      { id: 'stack', name: 'stack' },
      { id: 'github', name: 'github' },
      { id: 'build-log', name: 'build-log' },
      { id: 'contact', name: 'contact' },
    ]

    const onScroll = () => {
      if (frameId) return
      frameId = requestAnimationFrame(() => {
        frameId = 0
        const scrollY = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0
        setScrollProgress(progress)

        // Section intersection detection
        const midPoint = window.innerHeight * 0.45
        let current = 'hero'

        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i].id)
          if (el) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= midPoint) {
              current = sections[i].name
              break
            }
          }
        }

        // Bottom check for contact
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
          current = 'contact'
        }

        setActiveSection((prev) => (prev === current ? prev : current))
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('mousemove', onMouseMove)
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  return (
    <div className="three-canvas-container" aria-hidden="true">
      <Canvas
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.75]}
      >
        <PerspectiveCamera makeDefault fov={45} position={[0, 0.4, 6.8]} />

        {/* Ambient Tone */}
        <ambientLight color="#0e110c" intensity={0.85} />

        {/* Key Light casting soft directional shadows */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.9}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={25}
          shadow-camera-near={1}
          shadow-bias={-0.0001}
        />

        {/* Specular Rim Light (Acid Lime) */}
        <directionalLight position={[-6, 4, -4]} intensity={1.5} color="#c7ff3d" />

        {/* Soft Distance Fog seamlessly blending into #080908 */}
        <fog attach="fog" args={['#080908', 8, 26]} />

        <Suspense fallback={null}>
          {/* Ground Plane with Subtle Reflective Floor & Metric Rings */}
          <GroundPlane position={[0, -3.2, 0]} />

          {/* Persistent AI Computational Sculpture */}
          <AICore
            position={coreTransform.position}
            scale={coreTransform.scale}
            activeSection={activeSection}
            activeProjectIndex={activeProjectIndex}
            mouseRef={mouseRef}
          />

          {/* Interactive 3D Neural Network for the STACK section */}
          <NeuralNetwork
            visible={activeSection === 'stack'}
            onHoverNode={onHoverTechNode}
            mouseRef={mouseRef}
          />

          {/* Atmospheric Micro-Particles */}
          <ParticleField visible={activeSection !== 'contact'} mouseRef={mouseRef} />

          {/* Cinematic Camera Journey Controller */}
          <SceneController
            activeSection={activeSection}
            scrollProgress={scrollProgress}
            mouseRef={mouseRef}
            onCoreTransform={setCoreTransform}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
