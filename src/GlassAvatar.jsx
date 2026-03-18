import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function getHealthColor(score) {
  if (score > 66) return new THREE.Color('#00ffaa')
  if (score > 33) return new THREE.Color('#ffcc44')
  return new THREE.Color('#ff4466')
}

function GlassBody() {
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#c8dde8'),
    transparent: true,
    opacity: 0.42,
    roughness: 0.06,
    metalness: 0.18,
    transmission: 0.35,
    thickness: 0.8,
    side: THREE.DoubleSide,
    depthWrite: false,
  }), [])

  return (
    <group>
      {/* HEAD */}
      <mesh position={[0, 2.55, 0]} material={bodyMat}><sphereGeometry args={[0.38, 32, 32]} /></mesh>
      {/* NECK */}
      <mesh position={[0, 2.1, 0]} material={bodyMat}><cylinderGeometry args={[0.13, 0.15, 0.32, 20]} /></mesh>
      {/* TORSO */}
      <mesh position={[0, 1.45, 0]} material={bodyMat}><capsuleGeometry args={[0.36, 0.9, 16, 32]} /></mesh>
      <mesh position={[0, 1.65, 0]} material={bodyMat}><boxGeometry args={[0.82, 0.62, 0.3]} /></mesh>
      {/* ABDOMEN */}
      <mesh position={[0, 0.98, 0]} material={bodyMat}><capsuleGeometry args={[0.3, 0.38, 12, 24]} /></mesh>
      {/* HIPS */}
      <mesh position={[0, 0.52, 0]} material={bodyMat}><boxGeometry args={[0.76, 0.28, 0.28]} /></mesh>

      {/* LEFT ARM */}
      <mesh position={[-0.52, 1.88, 0]} material={bodyMat}><sphereGeometry args={[0.16, 16, 16]} /></mesh>
      <mesh position={[-0.72, 1.52, 0]} rotation={[0, 0, 0.18]} material={bodyMat}><capsuleGeometry args={[0.11, 0.52, 12, 20]} /></mesh>
      <mesh position={[-0.82, 1.1, 0]} material={bodyMat}><sphereGeometry args={[0.12, 12, 12]} /></mesh>
      <mesh position={[-0.86, 0.76, 0]} rotation={[0, 0, 0.05]} material={bodyMat}><capsuleGeometry args={[0.09, 0.48, 12, 20]} /></mesh>
      <mesh position={[-0.88, 0.42, 0]} material={bodyMat}><sphereGeometry args={[0.1, 14, 14]} /></mesh>

      {/* RIGHT ARM */}
      <mesh position={[0.52, 1.88, 0]} material={bodyMat}><sphereGeometry args={[0.16, 16, 16]} /></mesh>
      <mesh position={[0.72, 1.52, 0]} rotation={[0, 0, -0.18]} material={bodyMat}><capsuleGeometry args={[0.11, 0.52, 12, 20]} /></mesh>
      <mesh position={[0.82, 1.1, 0]} material={bodyMat}><sphereGeometry args={[0.12, 12, 12]} /></mesh>
      <mesh position={[0.86, 0.76, 0]} rotation={[0, 0, -0.05]} material={bodyMat}><capsuleGeometry args={[0.09, 0.48, 12, 20]} /></mesh>
      <mesh position={[0.88, 0.42, 0]} material={bodyMat}><sphereGeometry args={[0.1, 14, 14]} /></mesh>

      {/* LEFT LEG */}
      <mesh position={[-0.22, 0.38, 0]} material={bodyMat}><sphereGeometry args={[0.16, 14, 14]} /></mesh>
      <mesh position={[-0.22, -0.1, 0]} rotation={[0, 0, 0.04]} material={bodyMat}><capsuleGeometry args={[0.155, 0.7, 12, 20]} /></mesh>
      <mesh position={[-0.24, -0.58, 0]} material={bodyMat}><sphereGeometry args={[0.14, 14, 14]} /></mesh>
      <mesh position={[-0.24, -0.98, 0]} material={bodyMat}><capsuleGeometry args={[0.11, 0.65, 12, 20]} /></mesh>
      <mesh position={[-0.24, -1.42, 0.06]} material={bodyMat}><boxGeometry args={[0.18, 0.1, 0.32]} /></mesh>

      {/* RIGHT LEG */}
      <mesh position={[0.22, 0.38, 0]} material={bodyMat}><sphereGeometry args={[0.16, 14, 14]} /></mesh>
      <mesh position={[0.22, -0.1, 0]} rotation={[0, 0, -0.04]} material={bodyMat}><capsuleGeometry args={[0.155, 0.7, 12, 20]} /></mesh>
      <mesh position={[0.24, -0.58, 0]} material={bodyMat}><sphereGeometry args={[0.14, 14, 14]} /></mesh>
      <mesh position={[0.24, -0.98, 0]} material={bodyMat}><capsuleGeometry args={[0.11, 0.65, 12, 20]} /></mesh>
      <mesh position={[0.24, -1.42, 0.06]} material={bodyMat}><boxGeometry args={[0.18, 0.1, 0.32]} /></mesh>
    </group>
  )
}

function GlowingHeart({ score }) {
  const heartRef = useRef()
  const innerGlowRef = useRef()
  const outerGlowRef = useRef()
  const lightRef = useRef()
  const currentColor = useRef(new THREE.Color('#00ffaa'))
  const targetColor = useMemo(() => getHealthColor(score), [score])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const beat = 1 + Math.pow(Math.max(0, Math.sin(t * 2.4)), 6) * 0.25 + Math.pow(Math.max(0, Math.sin(t * 2.4 - 0.5)), 8) * 0.1
    currentColor.current.lerp(targetColor, 0.05)
    const c = currentColor.current

    if (heartRef.current) {
      heartRef.current.scale.setScalar(beat)
      heartRef.current.material.color.copy(c)
      heartRef.current.material.emissive.copy(c)
      heartRef.current.material.emissiveIntensity = 3.0 * beat
    }
    if (innerGlowRef.current) {
      innerGlowRef.current.scale.setScalar(beat * 1.7)
      innerGlowRef.current.material.color.copy(c)
      innerGlowRef.current.material.opacity = 0.28 * beat
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.scale.setScalar(beat * 3.2)
      outerGlowRef.current.material.color.copy(c)
      outerGlowRef.current.material.opacity = 0.1 * beat
    }
    if (lightRef.current) {
      lightRef.current.color.copy(c)
      lightRef.current.intensity = 3.5 * beat
    }
  })

  return (
    <group position={[-0.1, 1.65, 0.18]}>
      <mesh ref={outerGlowRef}>
        <sphereGeometry args={[0.26, 16, 16]} />
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.08} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={innerGlowRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.25} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={heartRef}>
        <sphereGeometry args={[0.095, 24, 24]} />
        <meshStandardMaterial color="#00ffaa" emissive="#00ffaa" emissiveIntensity={3.0} roughness={0.05} metalness={0.0} />
      </mesh>
      <pointLight ref={lightRef} color="#00ffaa" intensity={3.5} distance={2.5} decay={1.5} />
    </group>
  )
}

export default function GlassAvatar({ score }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.55) * 0.07 - 0.5
    }
  })

  return (
    <group ref={groupRef}>
      <GlassBody />
      <GlowingHeart score={score} />
    </group>
  )
}
