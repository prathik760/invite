'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Float, Sparkles, ContactShadows, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// ─── The box mesh — base + hinged lid + gold ribbon + bow ─────────────────────
function Box({ onOpened, color }: { onOpened: () => void; color: string }) {
  const lidRef = useRef<THREE.Group>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [opening, setOpening] = useState(false)
  const [done, setDone] = useState(false)
  const liftRef = useRef(0)

  useFrame((_, delta) => {
    if (!lidRef.current || !groupRef.current) return
    if (opening) {
      // Tip the lid back on its rear hinge and float it up + away
      lidRef.current.rotation.x = THREE.MathUtils.lerp(lidRef.current.rotation.x, -2.3, delta * 3)
      liftRef.current = THREE.MathUtils.lerp(liftRef.current, 1.6, delta * 3)
      lidRef.current.position.y = 0.55 + liftRef.current
      if (!done && lidRef.current.rotation.x < -1.6) {
        setDone(true)
        setTimeout(onOpened, 650)
      }
    } else {
      // Gentle idle breathing so it feels alive before the tap
      const t = groupRef.current.rotation.y
      groupRef.current.rotation.y = t + delta * 0.35
    }
  })

  const gold = '#E8B84B'

  return (
    <group
      ref={groupRef}
      onPointerDown={(e) => { e.stopPropagation(); if (!opening) setOpening(true) }}
    >
      {/* Base */}
      <RoundedBox args={[2, 1.1, 2]} radius={0.09} smoothness={5} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
      </RoundedBox>

      {/* Vertical + horizontal ribbon on the base */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.32, 1.14, 2.02]} />
        <meshStandardMaterial color={gold} roughness={0.25} metalness={0.55} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[2.02, 1.14, 0.32]} />
        <meshStandardMaterial color={gold} roughness={0.25} metalness={0.55} />
      </mesh>

      {/* Hinged lid group — pivots at the rear-top edge */}
      <group ref={lidRef} position={[0, 0.55, -1]}>
        <group position={[0, 0.18, 1]}>
          <RoundedBox args={[2.16, 0.42, 2.16]} radius={0.08} smoothness={5} castShadow>
            <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} />
          </RoundedBox>
          {/* Ribbon on the lid */}
          <mesh>
            <boxGeometry args={[0.32, 0.46, 2.18]} />
            <meshStandardMaterial color={gold} roughness={0.25} metalness={0.55} />
          </mesh>
          <mesh>
            <boxGeometry args={[2.18, 0.46, 0.32]} />
            <meshStandardMaterial color={gold} roughness={0.25} metalness={0.55} />
          </mesh>
          {/* Bow — two flattened toruses */}
          <mesh position={[-0.28, 0.3, 0]} rotation={[Math.PI / 2, 0, 0.5]} scale={[1, 1, 0.4]}>
            <torusGeometry args={[0.3, 0.11, 12, 24]} />
            <meshStandardMaterial color={gold} roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[0.28, 0.3, 0]} rotation={[Math.PI / 2, 0, -0.5]} scale={[1, 1, 0.4]}>
            <torusGeometry args={[0.3, 0.11, 12, 24]} />
            <meshStandardMaterial color={gold} roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.32, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color={gold} roughness={0.2} metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* Magic sparkles that intensify once opened */}
      <Sparkles count={opening ? 60 : 24} scale={opening ? 6 : 3} size={opening ? 4 : 2} speed={0.4} color={gold} position={[0, 0.8, 0]} />
    </group>
  )
}

export default function GiftBox3D({ onOpened, color = '#B0324B' }: { onOpened: () => void; color?: string }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.6, 5.2], fov: 45 }} style={{ touchAction: 'none' }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#ffd9a0" />
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.5}>
        <Box onOpened={onOpened} color={color} />
      </Float>
      {/* Rim + fill lights stand in for image-based lighting (no external HDR fetch) */}
      <pointLight position={[0, 3, -4]} intensity={0.8} color="#ffe0b0" />
      <pointLight position={[3, -1, 3]} intensity={0.4} color="#ffd0e0" />
      <ContactShadows position={[0, -0.62, 0]} opacity={0.5} scale={7} blur={2.6} far={2} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
    </Canvas>
  )
}
