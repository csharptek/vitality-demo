import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Lerp helper
function lerp(a, b, t) {
  return a + (b - a) * t
}

// Health score → color
function getHealthColor(score) {
  if (score > 66) return new THREE.Color('#00ffaa')
  if (score > 33) return new THREE.Color('#ffcc44')
  return new THREE.Color('#ff4466')
}

// Glass material factory
function glassMaterial(opacity = 0.13, color = '#c8f0e8') {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.7,
    thickness: 1.2,
    side: THREE.DoubleSide,
    depthWrite: false,
  })
}

function GlassBody() {
  const mat = useMemo(() => glassMaterial(0.13, '#d0e8f0'), [])
  const edgeMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#ffffff'),
    transparent: true,
    opacity: 0.18,
    roughness: 0.1,
    metalness: 0.3,
    wireframe: false,
    side: THREE.FrontSide,
    depthWrite: false,
  }), [])

  return (
    <group>
      {/* Head */}
      <mesh position={[0, 2.55, 0]} material={mat} castShadow>
        <sphereGeometry args={[0.38, 32, 32]} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 2.1, 0]} material={mat}>
        <cylinderGeometry args={[0.13, 0.15, 0.32, 20]} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1.35, 0]} material={mat} castShadow>
        <capsuleGeometry args={[0.38, 1.1, 16, 32]} />
      </mesh>
      {/* Chest width */}
      <mesh position={[0, 1.6, 0]} material={mat}>
        <boxGeometry args={[0.82, 0.7, 0.32]} />
      </mesh>
      {/* Abdomen */}
      <mesh position={[0, 0.9, 0]} material={mat}>
        <boxGeometry args={[0.7, 0.52, 0.28]} />
      </mesh>
      {/* Hips */}
      <mesh position={[0, 0.5, 0]} material={mat}>
        <boxGeometry args={[0.78, 0.32, 0.3]} />
      </mesh>

      {/* Left Upper Arm */}
      <mesh position={[-0.72, 1.55, 0]} rotation={[0, 0, 0.18]} material={mat}>
        <capsuleGeometry args={[0.11, 0.55, 12, 20]} />
      </mesh>
      {/* Left Lower Arm */}
      <mesh position={[-0.82, 0.88, 0]} rotation={[0, 0, 0.08]} material={mat}>
        <capsuleGeometry args={[0.09, 0.5, 12, 20]} />
      </mesh>
      {/* Left Hand */}
      <mesh position={[-0.86, 0.48, 0]} material={mat}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Right Upper Arm */}
      <mesh position={[0.72, 1.55, 0]} rotation={[0, 0, -0.18]} material={mat}>
        <capsuleGeometry args={[0.11, 0.55, 12, 20]} />
      </mesh>
      {/* Right Lower Arm */}
      <mesh position={[0.82, 0.88, 0]} rotation={[0, 0, -0.08]} material={mat}>
        <capsuleGeometry args={[0.09, 0.5, 12, 20]} />
      </mesh>
      {/* Right Hand */}
      <mesh position={[0.86, 0.48, 0]} material={mat}>
        <sphereGeometry args={[0.1, 16, 16]} />
      </mesh>

      {/* Left Upper Leg */}
      <mesh position={[-0.22, -0.08, 0]} rotation={[0, 0, 0.04]} material={mat}>
        <capsuleGeometry args={[0.16, 0.72, 12, 20]} />
      </mesh>
      {/* Left Lower Leg */}
      <mesh position={[-0.24, -0.9, 0]} material={mat}>
        <capsuleGeometry args={[0.12, 0.68, 12, 20]} />
      </mesh>
      {/* Left Foot */}
      <mesh position={[-0.24, -1.42, 0.06]} material={mat}>
        <boxGeometry args={[0.18, 0.1, 0.32]} />
      </mesh>

      {/* Right Upper Leg */}
      <mesh position={[0.22, -0.08, 0]} rotation={[0, 0, -0.04]} material={mat}>
        <capsuleGeometry args={[0.16, 0.72, 12, 20]} />
      </mesh>
      {/* Right Lower Leg */}
      <mesh position={[0.24, -0.9, 0]} material={mat}>
        <capsuleGeometry args={[0.12, 0.68, 12, 20]} />
      </mesh>
      {/* Right Foot */}
      <mesh position={[0.24, -1.42, 0.06]} material={mat}>
        <boxGeometry args={[0.18, 0.1, 0.32]} />
      </mesh>
    </group>
  )
}

function GlowingHeart({ score }) {
  const heartRef = useRef()
  const glowRef = useRef()
  const outerGlowRef = useRef()
  const targetColor = useMemo(() => getHealthColor(score), [score])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Heartbeat pulse
    const beat = 1 + Math.sin(t * 2.2) * 0.08 + Math.sin(t * 4.4) * 0.03
    if (heartRef.current) {
      heartRef.current.scale.setScalar(beat)
      heartRef.current.material.color.lerp(targetColor, 0.05)
      heartRef.current.material.emissive.lerp(targetColor, 0.05)
      heartRef.current.material.emissiveIntensity = lerp(
        heartRef.current.material.emissiveIntensity,
        score > 66 ? 1.8 : score > 33 ? 1.2 : 2.2,
        0.05
      )
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(beat * 1.4)
      glowRef.current.material.color.lerp(targetColor, 0.05)
      glowRef.current.material.opacity = 0.12 + Math.sin(t * 2.2) * 0.04
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.scale.setScalar(beat * 2.2)
      outerGlowRef.current.material.color.lerp(targetColor, 0.05)
      outerGlowRef.current.material.opacity = 0.04 + Math.sin(t * 2.2) * 0.02
    }
  })

  return (
    <group position={[-0.12, 1.62, 0.18]}>
      {/* Outer ambient glow */}
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color={targetColor}
          transparent
          opacity={0.04}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Inner glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial
          color={targetColor}
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Heart core */}
      <mesh ref={heartRef}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshPhysicalMaterial
          color={targetColor}
          emissive={targetColor}
          emissiveIntensity={1.8}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Point light from heart */}
      <pointLight
        color={targetColor}
        intensity={score > 66 ? 1.2 : score > 33 ? 0.8 : 1.6}
        distance={1.8}
        decay={2}
      />
    </group>
  )
}

export default function GlassAvatar({ score }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.28
      // Gentle float
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.06
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <GlassBody />
      <GlowingHeart score={score} />
    </group>
  )
}
