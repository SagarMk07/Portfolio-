import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { AICore } from './AICore'
import { GroundPlane } from './GroundPlane'
import { NeuralNetwork } from './NeuralNetwork'
import type { TechNodeData } from './NeuralNetwork'
import { AtmosphericEnvironment } from './AtmosphericEnvironment'
import { DataStreams } from './DataStreams'
import { SceneController } from './SceneController'

interface PortfolioSceneProps {
  activeProjectIndex?: number
  onHoverTechNode?: (node: TechNodeData | null) => void
  onActiveSectionChange?: (section: string) => void
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export function PortfolioScene({
  activeProjectIndex = -1,
  onHoverTechNode,
  onActiveSectionChange,
}: PortfolioSceneProps) {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [hasWebGL] = useState<boolean>(() => checkWebGLSupport())
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isCanvasHovered, setIsCanvasHovered] = useState<boolean>(false)
  const [coreTransform, setCoreTransform] = useState<{
    position: [number, number, number]
    scale: number
  }>({
    position: [1.15, 0, 0],
    scale: 1.25,
  })

  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 120)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let frameId = 0
    // Exact sequence per prompt: 01 Hero, 02 Work, 03 About, 04 Build Log, 05 Stack, 06 GitHub, 07 Contact
    const sections = [
      { id: 'top', name: 'hero' },
      { id: 'work', name: 'work' },
      { id: 'about', name: 'about' },
      { id: 'build-log', name: 'build-log' },
      { id: 'stack', name: 'stack' },
      { id: 'github', name: 'github' },
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

        setActiveSection((prev) => {
          if (prev !== current) {
            onActiveSectionChange?.(current)
            return current
          }
          return prev
        })
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
  }, [onActiveSectionChange])

  // Graceful fallback if WebGL is unavailable
  if (!hasWebGL) {
    return (
      <div className="three-fallback-surface" aria-hidden="true">
        <div className="fallback-grid" />
      </div>
    )
  }

  return (
    <>
      {/* Minimal non-blocking initialization banner */}
      {!isLoaded && (
        <div className="webgl-init-banner" aria-live="polite">
          <span>INITIALIZING 3D ENVIRONMENT</span>
        </div>
      )}

      <div
        className="three-canvas-container"
        data-cursor-3d="true"
        onMouseEnter={() => setIsCanvasHovered(true)}
        onMouseLeave={() => setIsCanvasHovered(false)}
      >
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

          {/* Low Ambient Lighting for High-Contrast Studio Definition */}
          <ambientLight color="#0a0d08" intensity={0.75} />

          {/* Key Light: High-angle directional light casting soft shadows */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.85}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-far={25}
            shadow-camera-near={1}
            shadow-bias={-0.0001}
          />

          {/* Specular Rim Light: Subtle acid-lime separation */}
          <directionalLight position={[-6, 4, -4]} intensity={1.5} color="#c7ff3d" />

          {/* Soft Fill Light: Neutral fill to lift dark shadow areas on the left flank */}
          <directionalLight position={[-4, -2, 4]} intensity={0.55} color="#e2e5dc" />

          {/* Atmospheric Distance Fog seamlessly blending into #080908 */}
          <fog attach="fog" args={['#080908', 8, 26]} />

          <Suspense fallback={null}>
            {/* Ground Plane with Dynamic Shadow Tracking directly beneath the AI Core */}
            <GroundPlane
              position={[0, -3.2, 0]}
              coreX={coreTransform.position[0]}
              coreZ={coreTransform.position[2]}
              coreScale={coreTransform.scale}
            />

            {/* 3-Tier Layered Atmospheric Depth Environment */}
            <AtmosphericEnvironment activeSection={activeSection} mouseRef={mouseRef} />

            {/* Ambient Procedural Computational Data Streams */}
            <DataStreams
              visible={activeSection !== 'contact'}
              activeSection={activeSection}
              activeProjectIndex={activeProjectIndex}
              mouseRef={mouseRef}
            />

            {/* Persistent Engineered AI Computational Sculpture */}
            <AICore
              position={coreTransform.position}
              scale={coreTransform.scale}
              activeSection={activeSection}
              activeProjectIndex={activeProjectIndex}
              isHovered={isCanvasHovered}
              mouseRef={mouseRef}
            />

            {/* Interactive 3D Neural Constellation for the STACK section */}
            <NeuralNetwork
              visible={activeSection === 'stack'}
              activeProjectIndex={activeProjectIndex}
              onHoverNode={onHoverTechNode}
              mouseRef={mouseRef}
            />

            {/* Cinematic Camera Journey Controller with Damped Motion */}
            <SceneController
              activeSection={activeSection}
              scrollProgress={scrollProgress}
              isCoreHovered={isCanvasHovered}
              mouseRef={mouseRef}
              onCoreTransform={setCoreTransform}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
