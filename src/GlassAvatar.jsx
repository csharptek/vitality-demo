import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function getHealthColor(score) {
  if (score > 66) return new THREE.Color('#00ffaa')
  if (score > 33) return new THREE.Color('#ffcc44')
  return new THREE.Color('#ff4466')
}

function GlassBody() {
  // PRIMARY frosted glass — non-opaque silhouette
  // transmission=0.92 means light passes through (you see background through body)
  // roughness=0.38 creates the frosted/milky blur
  // ior=1.3 refracts light like real glass
  // clearcoat gives the shiny outer skin layer
  const frostMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),
    transmission: 0.92,
    opacity: 1.0,
    transparent: true,
    roughness: 0.38,
    metalness: 0,
    ior: 1.3,
    thickness: 1.5,
    envMapIntensity: 2.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.5,
    attenuationColor: new THREE.Color('#dff0ff'),
    attenuationDistance: 1.2,
    side: THREE.FrontSide,
    depthWrite: false,
  }), [])

  // INNER backside layer — gives the silhouette its readable edge
  // This creates the "rim" that makes the human shape visible
  const rimMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#b8d8f0'),
    transmission: 0.7,
    opacity: 0.85,
    transparent: true,
    roughness: 0.5,
    metalness: 0,
    ior: 1.15,
    thickness: 0.5,
    envMapIntensity: 1.0,
    clearcoat: 0.2,
    clearcoatRoughness: 0.8,
    side: THREE.BackSide,
    depthWrite: false,
  }), [])

  const parts = [
    // [geometry type, position, rotation, args]
    // HEAD
    { type: 'sphere',   pos: [0, 2.55, 0],    rot: [0,0,0],     args: [0.38, 64, 64] },
    // NECK
    { type: 'cylinder', pos: [0, 2.1, 0],      rot: [0,0,0],     args: [0.13, 0.15, 0.32, 32] },
    // TORSO
    { type: 'capsule',  pos: [0, 1.45, 0],     rot: [0,0,0],     args: [0.36, 0.9, 16, 32] },
    { type: 'box',      pos: [0, 1.65, 0],     rot: [0,0,0],     args: [0.82, 0.62, 0.3] },
    // ABDOMEN
    { type: 'capsule',  pos: [0, 0.98, 0],     rot: [0,0,0],     args: [0.3, 0.38, 12, 24] },
    // HIPS
    { type: 'box',      pos: [0, 0.52, 0],     rot: [0,0,0],     args: [0.76, 0.28, 0.28] },
    // LEFT ARM
    { type: 'sphere',   pos: [-0.52, 1.88, 0], rot: [0,0,0],     args: [0.16, 32, 32] },
    { type: 'capsule',  pos: [-0.72, 1.52, 0], rot: [0,0,0.18],  args: [0.11, 0.52, 12, 20] },
    { type: 'sphere',   pos: [-0.82, 1.1, 0],  rot: [0,0,0],     args: [0.12, 24, 24] },
    { type: 'capsule',  pos: [-0.86, 0.76, 0], rot: [0,0,0.05],  args: [0.09, 0.48, 12, 20] },
    { type: 'sphere',   pos: [-0.88, 0.42, 0], rot: [0,0,0],     args: [0.1, 20, 20] },
    // RIGHT ARM
    { type: 'sphere',   pos: [0.52, 1.88, 0],  rot: [0,0,0],     args: [0.16, 32, 32] },
    { type: 'capsule',  pos: [0.72, 1.52, 0],  rot: [0,0,-0.18], args: [0.11, 0.52, 12, 20] },
    { type: 'sphere',   pos: [0.82, 1.1, 0],   rot: [0,0,0],     args: [0.12, 24, 24] },
    { type: 'capsule',  pos: [0.86, 0.76, 0],  rot: [0,0,-0.05], args: [0.09, 0.48, 12, 20] },
    { type: 'sphere',   pos: [0.88, 0.42, 0],  rot: [0,0,0],     args: [0.1, 20, 20] },
    // LEFT LEG
    { type: 'sphere',   pos: [-0.22, 0.38, 0], rot: [0,0,0],     args: [0.16, 24, 24] },
    { type: 'capsule',  pos: [-0.22, -0.1, 0], rot: [0,0,0.04],  args: [0.155, 0.7, 12, 20] },
    { type: 'sphere',   pos: [-0.24, -0.58, 0],rot: [0,0,0],     args: [0.14, 24, 24] },
    { type: 'capsule',  pos: [-0.24, -0.98, 0],rot: [0,0,0],     args: [0.11, 0.65, 12, 20] },
    { type: 'box',      pos: [-0.24,-1.42,0.06],rot:[0,0,0],     args: [0.18, 0.1, 0.32] },
    // RIGHT LEG
    { type: 'sphere',   pos: [0.22, 0.38, 0],  rot: [0,0,0],     args: [0.16, 24, 24] },
    { type: 'capsule',  pos: [0.22, -0.1, 0],  rot: [0,0,-0.04], args: [0.155, 0.7, 12, 20] },
    { type: 'sphere',   pos: [0.24, -0.58, 0], rot: [0,0,0],     args: [0.14, 24, 24] },
    { type: 'capsule',  pos: [0.24, -0.98, 0], rot: [0,0,0],     args: [0.11, 0.65, 12, 20] },
    { type: 'box',      pos: [0.24,-1.42,0.06], rot:[0,0,0],     args: [0.18, 0.1, 0.32] },
  ]

  return (
    <group>
      {parts.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={p.rot}>
          {p.type === 'sphere'   && <sphereGeometry args={p.args} />}
          {p.type === 'cylinder' && <cylinderGeometry args={p.args} />}
          {p.type === 'capsule'  && <capsuleGeometry args={p.args} />}
          {p.type === 'box'      && <boxGeometry args={p.args} />}
          {/* Front face — frosted glass */}
          <primitive object={frostMat} attach="material" />
        </mesh>
      ))}
      {/* Second pass — back faces for silhouette rim */}
      {parts.map((p, i) => (
        <mesh key={`rim-${i}`} position={p.pos} rotation={p.rot}>
          {p.type === 'sphere'   && <sphereGeometry args={p.args} />}
          {p.type === 'cylinder' && <cylinderGeometry args={p.args} />}
          {p.type === 'capsule'  && <capsuleGeometry args={p.args} />}
          {p.type === 'box'      && <boxGeometry args={p.args} />}
          <primitive object={rimMat} attach="material" />
        </mesh>
      ))}
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
    const beat =
      1 +
      Math.pow(Math.max(0, Math.sin(t * 2.4)), 6) * 0.28 +
      Math.pow(Math.max(0, Math.sin(t * 2.4 - 0.55)), 9) * 0.12

    currentColor.current.lerp(targetColor, 0.05)
    const c = currentColor.current

    if (heartRef.current) {
      heartRef.current.scale.setScalar(beat)
      heartRef.current.material.color.copy(c)
      heartRef.current.material.emissive.copy(c)
      heartRef.current.material.emissiveIntensity = 3.5 * beat
    }
    if (innerGlowRef.current) {
      innerGlowRef.current.scale.setScalar(beat * 1.8)
      innerGlowRef.current.material.color.copy(c)
      innerGlowRef.current.material.opacity = 0.32 * beat
    }
    if (outerGlowRef.current) {
      outerGlowRef.current.scale.setScalar(beat * 3.5)
      outerGlowRef.current.material.color.copy(c)
      outerGlowRef.current.material.opacity = 0.1 * beat
    }
    if (lightRef.current) {
      lightRef.current.color.copy(c)
      lightRef.current.intensity = 4.5 * beat
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
        <meshBasicMaterial color="#00ffaa" transparent opacity={0.28} depthWrite={false} side={THREE.BackSide} />
      </mesh>
      <mesh ref={heartRef}>
        <sphereGeometry args={[0.095, 32, 32]} />
        <meshStandardMaterial
          color="#00ffaa"
          emissive="#00ffaa"
          emissiveIntensity={3.5}
          roughness={0.05}
          metalness={0.0}
        />
      </mesh>
      <pointLight ref={lightRef} color="#00ffaa" intensity={4.5} distance={3.0} decay={1.4} />
    </group>
  )
}

export default function GlassAvatar({ score }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.55) * 0.07 - 0.62
    }
  })

  return (
    <group ref={groupRef}>
      <GlassBody />
      <GlowingHeart score={score} />
    </group>
  )
}
