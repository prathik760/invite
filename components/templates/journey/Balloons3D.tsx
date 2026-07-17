'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

const COLORS = ['#E4577B', '#F2A93B', '#5AB7C9', '#8E6BD1', '#57B98A', '#EC6F9B', '#4F9BE0', '#F0C24B']

function Balloon({
  position, color, popped, onPop,
}: { position: [number, number, number]; color: string; popped: boolean; onPop: () => void }) {
  const ref = useRef<THREE.Group>(null)
  const scale = useRef(1)

  useFrame((_, delta) => {
    if (!ref.current) return
    const target = popped ? 0 : 1
    scale.current = THREE.MathUtils.lerp(scale.current, target, delta * 12)
    ref.current.scale.setScalar(Math.max(scale.current, 0.0001))
  })

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={1.2}>
      <group
        ref={ref}
        position={position}
        onPointerDown={(e) => { e.stopPropagation(); if (!popped) onPop() }}
      >
        {/* Body — slightly egg-shaped */}
        <mesh scale={[1, 1.25, 1]} castShadow>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.15} metalness={0.05} />
        </mesh>
        {/* Tie */}
        <mesh position={[0, -0.72, 0]}>
          <coneGeometry args={[0.1, 0.18, 12]} />
          <meshStandardMaterial color={color} roughness={0.2} />
        </mesh>
        {/* String */}
        <mesh position={[0, -1.35, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 1.1, 6]} />
          <meshStandardMaterial color="#d8c9a8" />
        </mesh>
        {/* Highlight */}
        <mesh position={[-0.18, 0.28, 0.42]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  )
}

export default function Balloons3D({
  count, onPop, onAllPopped,
}: { count: number; onPop: (index: number) => void; onAllPopped: () => void }) {
  const [popped, setPopped] = useState<boolean[]>(() => Array(count).fill(false))

  const positions: [number, number, number][] = Array.from({ length: count }, (_, i) => {
    const cols = Math.min(count, 4)
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = (col - (cols - 1) / 2) * 1.7
    const y = 0.6 - row * 2.2 + (col % 2) * 0.4
    return [x, y, 0]
  })

  const handlePop = (i: number) => {
    setPopped((prev) => {
      if (prev[i]) return prev
      const next = [...prev]
      next[i] = true
      onPop(i)
      if (next.every(Boolean)) setTimeout(onAllPopped, 700)
      return next
    })
  }

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 50 }} style={{ touchAction: 'none' }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#ffd9a0" />
      {positions.map((pos, i) => (
        <Balloon
          key={i}
          position={pos}
          color={COLORS[i % COLORS.length]}
          popped={popped[i]}
          onPop={() => handlePop(i)}
        />
      ))}
      <pointLight position={[0, 2, 5]} intensity={0.5} color="#fff2d0" />
      <Sparkles count={40} scale={10} size={2} speed={0.3} color="#ffe9b0" />
    </Canvas>
  )
}
