'use client'

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export type Motif = 'hearts' | 'rings' | 'stars' | 'petals' | 'confetti' | 'diyas'

// ─── Geometry factory (one geometry, reused across all instances) ─────────────
function makeGeometry(motif: Motif): THREE.BufferGeometry {
  switch (motif) {
    case 'hearts': {
      const s = new THREE.Shape()
      s.moveTo(0, 0.3)
      s.bezierCurveTo(0, 0.6, -0.5, 0.9, -0.5, 0.3)
      s.bezierCurveTo(-0.5, 0.0, 0, -0.2, 0, -0.5)
      s.bezierCurveTo(0, -0.2, 0.5, 0.0, 0.5, 0.3)
      s.bezierCurveTo(0.5, 0.9, 0, 0.6, 0, 0.3)
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 })
      g.center(); g.scale(0.55, 0.55, 0.55)
      return g
    }
    case 'rings':
      return new THREE.TorusGeometry(0.34, 0.12, 14, 40)
    case 'stars': {
      const s = new THREE.Shape()
      const spikes = 5, outer = 0.5, inner = 0.21
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outer : inner
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
        const x = Math.cos(a) * r, y = Math.sin(a) * r
        if (i === 0) s.moveTo(x, y)
        else s.lineTo(x, y)
      }
      s.closePath()
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 1 })
      g.center()
      return g
    }
    case 'petals': {
      const g = new THREE.SphereGeometry(0.4, 18, 14)
      g.scale(1, 0.32, 0.68)
      return g
    }
    case 'confetti':
      return new THREE.BoxGeometry(0.2, 0.02, 0.3)
    case 'diyas':
      return new THREE.SphereGeometry(0.22, 18, 18)
  }
}

interface Particle {
  x: number; y: number; z: number
  scale: number; speed: number; drift: number
  rotX: number; rotY: number; rotZ: number
  spin: number; phase: number; color: THREE.Color
}

const SPREAD_X = 9
const SPREAD_Y = 12
const SPREAD_Z = 5

// ─── Ambient drifting field (background) ──────────────────────────────────────
function Field({ motif, colors, count }: { motif: Motif; colors: string[]; count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geometry = useMemo(() => makeGeometry(motif), [motif])
  const fall = motif === 'petals' || motif === 'confetti'
  const glow = motif === 'diyas' || motif === 'stars'

  const particles = useMemo<Particle[]>(() => {
    const palette = colors.map((c) => new THREE.Color(c))
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * SPREAD_X,
      y: (Math.random() - 0.5) * SPREAD_Y,
      z: (Math.random() - 0.5) * SPREAD_Z - 1,
      scale: 0.45 + Math.random() * 0.8,
      speed: 0.25 + Math.random() * 0.55,
      drift: 0.3 + Math.random() * 0.6,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.8,
      phase: Math.random() * Math.PI * 2,
      color: palette[Math.floor(Math.random() * palette.length)],
    }))
  }, [count, colors])

  useEffect(() => {
    if (!meshRef.current) return
    particles.forEach((p, i) => meshRef.current!.setColorAt(i, p.color))
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  }, [particles])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    const dir = fall ? -1 : 1
    particles.forEach((p, i) => {
      p.y += dir * p.speed * delta
      if (fall && p.y < -SPREAD_Y / 2) p.y = SPREAD_Y / 2
      if (!fall && p.y > SPREAD_Y / 2) p.y = -SPREAD_Y / 2
      dummy.position.set(p.x + Math.sin(t * p.drift + p.phase) * 0.5, p.y, p.z)
      dummy.rotation.set(p.rotX + t * p.spin * 0.3, p.rotY + t * p.spin, p.rotZ)
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      <meshStandardMaterial roughness={glow ? 0.25 : 0.4} metalness={motif === 'rings' ? 0.7 : 0.15} transparent opacity={0.96} />
    </instancedMesh>
  )
}

// ─── Central hero object (tap to open) ────────────────────────────────────────
function Hero({ motif, color, opened }: { motif: Motif; color: string; opened: boolean }) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => makeGeometry(motif), [motif])
  const scaleRef = useRef(0.001)

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const target = opened ? 0.0001 : 2.6 + Math.sin(t * 2) * 0.18 // heartbeat pulse, then vanish
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, target, delta * (opened ? 8 : 4))
    ref.current.scale.setScalar(Math.max(scaleRef.current, 0.0001))
    ref.current.rotation.y = t * 0.6
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.12
  })

  return (
    <mesh ref={ref} geometry={geometry} position={[0, 0, 0]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} roughness={0.25} metalness={motif === 'rings' ? 0.6 : 0.2} />
    </mesh>
  )
}

// ─── Burst system (tap anywhere → shower of motif objects) ────────────────────
interface Burst { active: boolean; x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; max: number; base: number; spin: number }
export interface BurstHandle { fire: (x: number, y: number, big?: boolean) => void }

const POOL = 60
const Bursts = forwardRef<BurstHandle, { motif: Motif; colors: string[] }>(function Bursts({ motif, colors }, ref) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const geometry = useMemo(() => makeGeometry(motif), [motif])
  const palette = useMemo(() => colors.map((c) => new THREE.Color(c)), [colors])
  const items = useRef<Burst[]>(Array.from({ length: POOL }, () => ({ active: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 0, max: 1, base: 0.5, spin: 0 })))

  useImperativeHandle(ref, () => ({
    fire(x: number, y: number, big = false) {
      const n = big ? 26 : 14
      let spawned = 0
      for (const it of items.current) {
        if (spawned >= n) break
        if (it.active) continue
        const ang = Math.random() * Math.PI * 2
        const spd = (big ? 3.2 : 2.2) * (0.5 + Math.random())
        it.active = true
        it.x = x; it.y = y; it.z = 0
        it.vx = Math.cos(ang) * spd
        it.vy = Math.sin(ang) * spd + (big ? 1.5 : 1)
        it.vz = (Math.random() - 0.5) * 1.5
        it.max = 0.9 + Math.random() * 0.7
        it.life = it.max
        it.base = 0.35 + Math.random() * 0.4
        it.spin = (Math.random() - 0.5) * 6
        if (meshRef.current) meshRef.current.setColorAt(spawned, palette[Math.floor(Math.random() * palette.length)])
        spawned++
      }
      if (meshRef.current?.instanceColor) meshRef.current.instanceColor.needsUpdate = true
    },
  }), [palette])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    items.current.forEach((it, i) => {
      if (it.active) {
        it.life -= delta
        if (it.life <= 0) it.active = false
        it.vy -= 4 * delta // gravity
        it.x += it.vx * delta
        it.y += it.vy * delta
        it.z += it.vz * delta
        const s = it.active ? it.base * (it.life / it.max) : 0.0001
        dummy.position.set(it.x, it.y, it.z)
        dummy.rotation.set(t * it.spin, t * it.spin, 0)
        dummy.scale.setScalar(Math.max(s, 0.0001))
      } else {
        dummy.position.set(0, 0, 0)
        dummy.scale.setScalar(0.0001)
      }
      dummy.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, POOL]}>
      <meshStandardMaterial roughness={0.3} metalness={0.2} emissiveIntensity={0.2} />
    </instancedMesh>
  )
})
Bursts.displayName = 'Bursts'

// ─── Interaction rig: parallax tilt + pointer plane + hero + bursts ───────────
function Rig({ motif, colors, count, opened, onOpen }: {
  motif: Motif; colors: string[]; count: number; opened: boolean; onOpen: () => void
}) {
  const group = useRef<THREE.Group>(null)
  const burstRef = useRef<BurstHandle>(null)
  const prevOpened = useRef(opened)

  useFrame((state, delta) => {
    if (!group.current) return
    // Parallax: tilt the whole scene toward the pointer / finger
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.35, delta * 2.5)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.22, delta * 2.5)
    // Fire a celebratory burst the moment it opens
    if (opened && !prevOpened.current) burstRef.current?.fire(0, 0, true)
    prevOpened.current = opened
  })

  const handlePointer = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    if (!opened) { onOpen(); return }
    burstRef.current?.fire(e.point.x, e.point.y, false)
  }

  return (
    <>
      {/* Invisible catcher sits closest to the camera so every tap registers */}
      <mesh position={[0, 0, 4]} onPointerDown={handlePointer}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <group ref={group}>
        <Field motif={motif} colors={colors} count={count} />
        <Hero motif={motif} color={colors[0]} opened={opened} />
        <Bursts ref={burstRef} motif={motif} colors={colors} />
      </group>
    </>
  )
}

export default function GreetingScene3D({
  motif, colors, count = 30, sparkleColor = '#ffe9b0', opened = true, onOpen = () => {},
}: { motif: Motif; colors: string[]; count?: number; sparkleColor?: string; opened?: boolean; onOpen?: () => void }) {
  return (
    <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: true }} camera={{ position: [0, 0, 8], fov: 50 }} style={{ background: 'transparent' }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 6]} intensity={1.3} />
      <pointLight position={[-5, -2, 3]} intensity={0.6} color="#ffd0e0" />
      <pointLight position={[0, 3, -4]} intensity={0.7} color={sparkleColor} />
      <Rig motif={motif} colors={colors} count={count} opened={opened} onOpen={onOpen} />
      <Sparkles count={50} scale={[10, 12, 4]} size={2.4} speed={0.3} color={sparkleColor} opacity={0.7} />
    </Canvas>
  )
}
