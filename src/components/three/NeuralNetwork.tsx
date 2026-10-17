import { useRef, useMemo, useState, memo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export interface TechNodeData {
  id: string
  name: string
  category: 'ai' | 'lang' | 'frontend' | 'backend' | 'data' | 'tools'
  position: [number, number, number]
  connections: string[]
  info: string
}

const techNodes: TechNodeData[] = [
  // 1. Relational Chain 1: PYTHON -> AI / ML -> FASTAPI -> POSTGRESQL / SUPABASE
  {
    id: 'python',
    name: 'Python',
    category: 'lang',
    position: [-3.4, 0.8, 1.2],
    connections: ['ai-core', 'fastapi', 'ml'],
    info: 'Core language for machine learning, model training, and system pipelines.',
  },
  {
    id: 'ai-core',
    name: 'AI / ML',
    category: 'ai',
    position: [-2.0, 1.8, 0.6],
    connections: ['python', 'fastapi', 'ml', 'vision', 'genai'],
    info: 'Neural architectures, multimodal processing, and automated reasoning engines.',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'ai',
    position: [-2.6, 2.8, -0.4],
    connections: ['ai-core', 'python', 'vision'],
    info: 'Supervised, unsupervised, and recommendation models for real-world telemetry.',
  },
  {
    id: 'vision',
    name: 'Computer Vision',
    category: 'ai',
    position: [-1.2, 3.0, 0.2],
    connections: ['ai-core', 'ml'],
    info: 'OCR, document feature extraction, and real-time visual parsing.',
  },
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'ai',
    position: [-0.4, 2.2, 0.8],
    connections: ['ai-core', 'fastapi', 'frontend-core'],
    info: 'Gemini, Vertex AI, and prompt/vector-assisted workflows.',
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    position: [-0.6, 0.5, 1.1],
    connections: ['ai-core', 'python', 'postgres', 'backend-core'],
    info: 'High-performance asynchronous REST endpoints bridging ML models to interfaces.',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'data',
    position: [0.6, -0.4, 1.0],
    connections: ['fastapi', 'supabase', 'cloud-core'],
    info: 'Relational data modeling, ACID transactions, and structured indexing.',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'data',
    position: [1.8, -1.2, 0.8],
    connections: ['postgres', 'cloud-core', 'backend-core'],
    info: 'Postgres persistence, Row Level Security, and real-time data sync.',
  },

  // 2. Relational Chain 2: TYPESCRIPT -> REACT -> VITE
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'lang',
    position: [0.8, 1.6, 1.2],
    connections: ['react', 'vite', 'frontend-core', 'fastapi'],
    info: 'Strict type safety across full-stack applications and extensions.',
  },
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    position: [2.4, 2.0, 0.9],
    connections: ['typescript', 'vite', 'frontend-core', 'tailwind'],
    info: 'Component-driven reactive web applications and component systems.',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'frontend',
    position: [1.6, 3.1, 0.5],
    connections: ['react', 'typescript', 'frontend-core'],
    info: 'Fast ESM bundler, rollup optimization, and lightning-fast developer workflow.',
  },
  {
    id: 'frontend-core',
    name: 'FULL STACK',
    category: 'frontend',
    position: [2.0, 0.8, 0.4],
    connections: ['typescript', 'react', 'tailwind', 'genai', 'vite'],
    info: 'Modern reactive interfaces and high-performance interactive architectures.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    position: [3.4, 2.9, -0.4],
    connections: ['frontend-core', 'react'],
    info: 'Design system tokens and responsive utility layouts.',
  },

  // 3. Relational Chain 3: C++ -> DSA -> SYSTEMS
  {
    id: 'cpp',
    name: 'C++',
    category: 'lang',
    position: [-4.2, -1.0, -0.8],
    connections: ['dsa', 'python'],
    info: 'Algorithms, memory efficiency, and computational performance.',
  },
  {
    id: 'dsa',
    name: 'DSA',
    category: 'lang',
    position: [-3.2, -2.0, -0.4],
    connections: ['cpp', 'systems'],
    info: 'Algorithmic efficiency, time-space optimization, and computational rigor.',
  },
  {
    id: 'systems',
    name: 'Systems',
    category: 'lang',
    position: [-1.8, -2.5, 0.2],
    connections: ['dsa', 'cpp', 'backend-core'],
    info: 'Low-level architecture, memory management, and concurrent execution.',
  },

  // 4. Backend & Cloud Support
  {
    id: 'backend-core',
    name: 'BACKEND',
    category: 'backend',
    position: [0.2, -1.4, 0.6],
    connections: ['fastapi', 'systems', 'postgres', 'cloud-core', 'rest-apis'],
    info: 'Scalable service endpoints, asynchronous processors, and APIs.',
  },
  {
    id: 'rest-apis',
    name: 'REST APIs',
    category: 'backend',
    position: [-0.8, -2.2, 0.8],
    connections: ['backend-core', 'fastapi'],
    info: 'Deterministic REST communication contracts, rate-limiting, and webhooks.',
  },
  {
    id: 'cloud-core',
    name: 'DATA & CLOUD',
    category: 'data',
    position: [2.8, -1.8, -0.5],
    connections: ['backend-core', 'supabase', 'firebase'],
    info: 'Cloud datastores, document databases, and persistence layers.',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    category: 'data',
    position: [3.4, -2.6, 0.3],
    connections: ['cloud-core'],
    info: 'NoSQL Firestore datastores, authentication, and serverless hosting.',
  },
]

interface NeuralNetworkProps {
  visible: boolean
  activeProjectIndex?: number
  onHoverNode?: (node: TechNodeData | null) => void
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

function NeuralNetworkComponent({
  visible,
  activeProjectIndex = -1,
  onHoverNode,
  mouseRef,
}: NeuralNetworkProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Map of node ID to index/position
  const nodeMap = useMemo(() => {
    const map = new Map<string, TechNodeData>()
    techNodes.forEach((n) => map.set(n.id, n))
    return map
  }, [])

  // Build connection lines
  const lines = useMemo(() => {
    const list: { from: [number, number, number]; to: [number, number, number]; idA: string; idB: string }[] = []
    const visited = new Set<string>()

    techNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodeMap.get(targetId)
        if (target) {
          const pairKey = [node.id, targetId].sort().join('--')
          if (!visited.has(pairKey)) {
            visited.add(pairKey)
            list.push({
              from: node.position,
              to: target.position,
              idA: node.id,
              idB: target.id,
            })
          }
        }
      })
    })

    return list
  }, [nodeMap])

  // Precomputed reusable geometries for connection lines (created once, zero frame allocation)
  const lineGeometries = useMemo(() => {
    return lines.map((line) => {
      const points = [new THREE.Vector3(...line.from), new THREE.Vector3(...line.to)]
      return new THREE.BufferGeometry().setFromPoints(points)
    })
  }, [lines])

  // Reusable line materials
  const lineMaterials = useMemo(() => {
    return {
      normal: new THREE.LineBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.10,
      }),
      dimmed: new THREE.LineBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.03,
      }),
      highlighted: new THREE.LineBasicMaterial({
        color: '#c7ff3d',
        transparent: true,
        opacity: 0.95,
      }),
    }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current || !visible) return
    const time = state.clock.elapsedTime
    const mouse = mouseRef.current

    // Subtle 3D spatial rotation response to mouse with delta-independent damping
    const rotDamp = 1 - Math.exp(-3.0 * delta)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(time * 0.18) * 0.08 + mouse.x * 0.28,
      rotDamp
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.cos(time * 0.22) * 0.05 - mouse.y * 0.18,
      rotDamp
    )
  })

  // Project 02 (SmartShopper Guardian): Highlights Frontend & Extension cluster
  const project2Cluster = useMemo(() => new Set(['frontend-core', 'typescript', 'react', 'rest-apis']), [])

  // Fast O(1) Set lookup for connections to hovered node
  const hoveredConnections = useMemo(() => {
    if (!hoveredId) return null
    const node = nodeMap.get(hoveredId)
    return new Set(node?.connections || [])
  }, [hoveredId, nodeMap])

  if (!visible) return null

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {/* 3D Laser Connection Lines */}
      {lines.map((line, idx) => {
        const isHoverPair = hoveredId === line.idA || hoveredId === line.idB
        const isProject2Pair = activeProjectIndex === 1 && (project2Cluster.has(line.idA) && project2Cluster.has(line.idB))
        const isHighlighted = isHoverPair || isProject2Pair
        const mat = isHighlighted
          ? lineMaterials.highlighted
          : hoveredId
            ? lineMaterials.dimmed
            : lineMaterials.normal

        return (
          <lineSegments
            key={`link-${line.idA}--${line.idB}`}
            geometry={lineGeometries[idx]}
            material={mat}
          />
        )
      })}

      {/* Technology Nodes with true depth positioning */}
      {techNodes.map((node) => {
        const isHovered = hoveredId === node.id
        const isConnected =
          Boolean(hoveredId && (
            hoveredConnections?.has(node.id) ||
            node.connections.includes(hoveredId)
          ))

        const isProject2Active = activeProjectIndex === 1 && project2Cluster.has(node.id)

        const isCoreNode = node.category.includes('core') || node.id === 'ai-core'
        const nodeRadius = isCoreNode ? 0.22 : 0.15
        const activeColor = isHovered ? '#ffffff' : isConnected || isProject2Active ? '#c7ff3d' : '#8f9286'
        const emissiveColor = isHovered || isConnected || isProject2Active ? '#c7ff3d' : '#000000'
        const emissiveIntensity = isHovered ? 2.8 : isConnected ? 1.6 : isProject2Active ? 1.2 : 0

        return (
          <group
            key={node.id}
            position={[
              node.position[0],
              node.position[1],
              node.position[2] + (isHovered ? 0.55 : 0),
            ]}
          >
            {/* Interactive 3D Sphere */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredId(node.id)
                onHoverNode?.(node)
              }}
              onPointerOut={() => {
                setHoveredId(null)
                onHoverNode?.(null)
              }}
            >
              <sphereGeometry args={[nodeRadius, 16, 16]} />
              <meshStandardMaterial
                color={activeColor}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity}
                roughness={0.18}
                metalness={0.8}
              />
            </mesh>

            {/* Glowing Target Ring on Active Nodes */}
            {(isHovered || isConnected || isProject2Active) && (
              <mesh>
                <ringGeometry args={[nodeRadius * 1.3, nodeRadius * 1.5, 32]} />
                <meshBasicMaterial color="#c7ff3d" transparent opacity={0.75} side={THREE.DoubleSide} />
              </mesh>
            )}

            {/* 3D Floating Typography */}
            <Text
              position={[0, nodeRadius + 0.22, 0]}
              fontSize={0.16}
              color={isHovered ? '#c7ff3d' : isConnected || isProject2Active ? '#f1f1ed' : '#7f8376'}
              anchorX="center"
              anchorY="bottom"
              letterSpacing={0.07}
            >
              {node.name.toUpperCase()}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

export const NeuralNetwork = memo(NeuralNetworkComponent)
