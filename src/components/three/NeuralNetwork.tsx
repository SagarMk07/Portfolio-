import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

export interface TechNodeData {
  id: string
  name: string
  category: 'ai' | 'lang' | 'frontend' | 'backend' | 'cloud'
  position: [number, number, number]
  connections: string[]
  info: string
}

export const techNodes: TechNodeData[] = [
  // AI / ML Cluster (Varying Z depths for true spatial composition)
  {
    id: 'ai-core',
    name: 'AI / ML',
    category: 'ai',
    position: [-2.2, 1.8, 0.8],
    connections: ['python', 'ml', 'vision', 'genai'],
    info: 'Multimodal AI systems, computer vision, and neural reasoning pipelines.',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'lang',
    position: [-3.6, 0.6, 1.4],
    connections: ['ai-core', 'ml', 'backend-core'],
    info: 'Primary language for deep learning, scientific computing, and system scripts.',
  },
  {
    id: 'ml',
    name: 'Machine Learning',
    category: 'ai',
    position: [-1.6, 0.2, -0.6],
    connections: ['ai-core', 'python', 'genai'],
    info: 'Supervised, unsupervised, and recommendation models for real-world telemetry.',
  },
  {
    id: 'vision',
    name: 'Computer Vision',
    category: 'ai',
    position: [-3.5, 2.4, -0.4],
    connections: ['ai-core', 'genai'],
    info: 'OCR, document feature extraction, and real-time visual parsing.',
  },
  {
    id: 'genai',
    name: 'Generative AI',
    category: 'ai',
    position: [-0.6, 2.2, 0.9],
    connections: ['ai-core', 'vision', 'ml', 'frontend-core'],
    info: 'Gemini, Vertex AI, and prompt/vector-assisted workflows.',
  },

  // Languages Cluster
  {
    id: 'cpp',
    name: 'C++',
    category: 'lang',
    position: [-4.4, -0.8, -1.2],
    connections: ['python'],
    info: 'Algorithms, memory efficiency, and computational performance.',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'lang',
    position: [0.4, 0.9, 1.1],
    connections: ['frontend-core', 'backend-core'],
    info: 'Strict type safety across full-stack applications and extensions.',
  },

  // Frontend Cluster
  {
    id: 'frontend-core',
    name: 'FRONTEND',
    category: 'frontend',
    position: [2.0, 1.7, 0.4],
    connections: ['typescript', 'react', 'tailwind', 'genai'],
    info: 'Modern reactive interfaces and high-performance interactive architectures.',
  },
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    position: [3.6, 1.9, 0.9],
    connections: ['frontend-core', 'typescript'],
    info: 'Component-driven reactive web applications and component systems.',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    position: [2.8, 2.9, -0.5],
    connections: ['frontend-core'],
    info: 'Design system tokens and responsive utility layouts.',
  },

  // Backend Cluster
  {
    id: 'backend-core',
    name: 'BACKEND',
    category: 'backend',
    position: [0.8, -1.1, 0.5],
    connections: ['typescript', 'python', 'node', 'cloud-core'],
    info: 'Scalable service endpoints, asynchronous processors, and APIs.',
  },
  {
    id: 'node',
    name: 'Node.js',
    category: 'backend',
    position: [2.0, -0.3, 1.3],
    connections: ['backend-core', 'typescript'],
    info: 'Asynchronous event-driven server runtime and API integrations.',
  },

  // Data & Cloud Cluster
  {
    id: 'cloud-core',
    name: 'DATA & CLOUD',
    category: 'cloud',
    position: [3.0, -1.7, -0.6],
    connections: ['backend-core', 'supabase', 'firebase'],
    info: 'Cloud datastores, document databases, and persistence layers.',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'cloud',
    position: [4.2, -1.0, 0.7],
    connections: ['cloud-core', 'backend-core'],
    info: 'Postgres persistence, Row Level Security, and real-time data sync.',
  },
  {
    id: 'firebase',
    name: 'Firebase',
    category: 'cloud',
    position: [3.4, -2.6, 0.3],
    connections: ['cloud-core'],
    info: 'NoSQL Firestore datastores, authentication, and serverless hosting.',
  },
]

interface NeuralNetworkProps {
  visible: boolean
  onHoverNode?: (node: TechNodeData | null) => void
  mouseRef: React.MutableRefObject<{ x: number; y: number }>
}

export function NeuralNetwork({ visible, onHoverNode, mouseRef }: NeuralNetworkProps) {
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

  useFrame((state) => {
    if (!groupRef.current) return
    const time = state.clock.getElapsedTime()
    const mouse = mouseRef.current

    // Subtle 3D spatial rotation response to mouse
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.sin(time * 0.18) * 0.1 + mouse.x * 0.32,
      0.05
    )
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.cos(time * 0.22) * 0.06 - mouse.y * 0.22,
      0.05
    )

    // Visibility scale animation
    const targetScale = visible ? 1 : 0.0001
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.08)
    )
  })

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {/* 3D Laser Connection Lines */}
      {lines.map((line, idx) => {
        const isHighlighted = hoveredId === line.idA || hoveredId === line.idB
        const points = [new THREE.Vector3(...line.from), new THREE.Vector3(...line.to)]
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points)

        return (
          <lineSegments key={idx} geometry={lineGeo}>
            <lineBasicMaterial
              color={isHighlighted ? '#c7ff3d' : '#ffffff'}
              transparent
              opacity={isHighlighted ? 0.95 : hoveredId ? 0.04 : 0.12}
            />
          </lineSegments>
        )
      })}

      {/* Technology Nodes with true depth positioning */}
      {techNodes.map((node) => {
        const isHovered = hoveredId === node.id
        const isConnected =
          hoveredId &&
          (nodeMap.get(hoveredId)?.connections.includes(node.id) ||
            node.connections.includes(hoveredId))

        const nodeRadius = node.category.includes('core') ? 0.22 : 0.15
        const activeColor = isHovered ? '#ffffff' : isConnected ? '#c7ff3d' : '#8f9286'
        const emissiveColor = isHovered || isConnected ? '#c7ff3d' : '#000000'
        const emissiveIntensity = isHovered ? 2.8 : isConnected ? 1.5 : 0

        return (
          <group
            key={node.id}
            position={[
              node.position[0],
              node.position[1],
              node.position[2] + (isHovered ? 0.65 : 0),
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
            {(isHovered || isConnected) && (
              <mesh>
                <ringGeometry args={[nodeRadius * 1.3, nodeRadius * 1.5, 32]} />
                <meshBasicMaterial color="#c7ff3d" transparent opacity={0.75} side={THREE.DoubleSide} />
              </mesh>
            )}

            {/* 3D Floating Typography */}
            <Text
              position={[0, nodeRadius + 0.22, 0]}
              fontSize={0.16}
              color={isHovered ? '#c7ff3d' : isConnected ? '#f1f1ed' : '#7f8376'}
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
