import { Suspense, useEffect, useRef, useState, lazy } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { AICore } from './AICore'
import { GroundPlane } from './GroundPlane'
import type { TechNodeData } from './NeuralNetwork'
import { AtmosphericEnvironment } from './AtmosphericEnvironment'
import { DataStreams } from './DataStreams'
import { SceneController } from './SceneController'

// Lazy-load NeuralNetwork constellation so Drei and troika text are excluded from the initial critical bundle
const NeuralNetwork = lazy(() =>
  import('./NeuralNetwork').then((m) => ({ default: m.NeuralNetwork }))
)

interface PortfolioSceneProps {
  activeProjectIndex?: number
  onHoverTechNode?: (node: TechNodeData | null) => void
  onActiveSectionChange?: (section: string) => void
  onWebGLReadyChange?: (ready: boolean) => void
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

// Reports the exact frame that WebGL compiles shaders and executes its first render
function FirstFrameReporter({ onReady }: { onReady: () => void }) {
  const reported = useRef(false)
  useFrame(() => {
    if (!reported.current) {
      reported.current = true
      onReady()
    }
  })
  return null
}

export function PortfolioScene({
  activeProjectIndex = -1,
  onHoverTechNode,
  onActiveSectionChange,
  onWebGLReadyChange,
}: PortfolioSceneProps) {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [hasWebGL] = useState<boolean>(() => checkWebGLSupport())
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isCanvasHovered, setIsCanvasHovered] = useState<boolean>(false)

  // Mutable refs to eliminate React re-renders on animation and scroll loops
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const scrollProgressRef = useRef<number>(0)
  const activeSectionRef = useRef<string>('hero')
  const coreTransformRef = useRef<{
    position: [number, number, number]
    scale: number
  }>({
    position: [1.15, 0, 0],
    scale: 1.25,
  })

  const handleWebGLReady = () => {
    if (!isLoaded) {
      setIsLoaded(true)
      onWebGLReadyChange?.(true)
    }
  }

  // Proactively prefetch heavy 3D Neural constellation when user approaches Section 04/05
  useEffect(() => {
    if (activeSection === 'about' || activeSection === 'build-log') {
      import('./NeuralNetwork')
    }
  }, [activeSection])

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
        scrollProgressRef.current = progress

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

        if (activeSectionRef.current !== current) {
          activeSectionRef.current = current
          setActiveSection(current)
          onActiveSectionChange?.(current)
        }
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

  // Graceful fallback if WebGL is unavailable (persistent CSS fallback grid already active in App.tsx)
  if (!hasWebGL) {
    return null
  }

  return (
    <>
      {/* Non-blocking initialization banner - disappears on actual first frame rendered */}
      {!isLoaded && (
        <div className="webgl-init-banner" aria-live="polite">
          <span>INITIALIZING 3D ENVIRONMENT</span>
        </div>
      )}

      {/* 3D Canvas Container with smooth progressive fade-in once first frame is ready */}
      <div
        className="three-canvas-container"
        data-cursor-3d="true"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsCanvasHovered(true)}
        onMouseLeave={() => setIsCanvasHovered(false)}
      >
        <Canvas
          shadows
          camera={{ fov: 45, position: [0, 0.4, 6.8] }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1.25 : 1.75]}
        >
          <FirstFrameReporter onReady={handleWebGLReady} />

          {/* Low Ambient Lighting for High-Contrast Studio Definition */}
          <ambientLight color="#0a0d08" intensity={0.75} />

          {/* Key Light: High-angle directional light casting soft bounded shadows */}
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.85}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
            shadow-camera-near={1}
            shadow-camera-far={20}
            shadow-camera-left={-3.5}
            shadow-camera-right={3.5}
            shadow-camera-top={3.5}
            shadow-camera-bottom={-3.5}
            shadow-bias={-0.0002}
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
              coreTransformRef={coreTransformRef}
            />

            {/* 3-Tier Layered Atmospheric Depth Environment - staged after initial WebGL frame */}
            {isLoaded && <AtmosphericEnvironment activeSection={activeSection} mouseRef={mouseRef} />}

            {/* Ambient Procedural Computational Data Streams - staged after initial WebGL frame */}
            {isLoaded && (
              <DataStreams
                visible={activeSection !== 'contact'}
                activeSection={activeSection}
                activeProjectIndex={activeProjectIndex}
                mouseRef={mouseRef}
              />
            )}

            {/* Persistent Engineered AI Computational Sculpture */}
            <AICore
              coreTransformRef={coreTransformRef}
              activeSection={activeSection}
              activeProjectIndex={activeProjectIndex}
              isHovered={isCanvasHovered}
              mouseRef={mouseRef}
            />

            {/* Interactive 3D Neural Constellation for the STACK section */}
            {activeSection === 'stack' && (
              <NeuralNetwork
                visible={true}
                activeProjectIndex={activeProjectIndex}
                onHoverNode={onHoverTechNode}
                mouseRef={mouseRef}
              />
            )}

            {/* Cinematic Camera Journey Controller with Damped Motion */}
            <SceneController
              activeSection={activeSection}
              scrollProgressRef={scrollProgressRef}
              isCoreHovered={isCanvasHovered}
              mouseRef={mouseRef}
              coreTransformRef={coreTransformRef}
            />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
