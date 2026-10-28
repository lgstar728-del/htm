import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Department, DeptKind, Hotel } from '../types'
import { lessonById } from '../data/lessons'

function B({ s, p, c, e, ei = 1, m = 0.2, r = 0.5 }: { s: [number, number, number]; p: [number, number, number]; c: string; e?: string; ei?: number; m?: number; r?: number }) {
  return (
    <mesh position={p}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={c} metalness={m} roughness={r} emissive={e ?? '#000'} emissiveIntensity={e ? ei : 0} />
    </mesh>
  )
}
function Cyl({ a, p, c, e, ei = 1, seg = 20 }: { a: [number, number, number]; p: [number, number, number]; c: string; e?: string; ei?: number; seg?: number }) {
  return (
    <mesh position={p}>
      <cylinderGeometry args={[a[0], a[1], a[2], seg]} />
      <meshStandardMaterial color={c} metalness={0.3} roughness={0.5} emissive={e ?? '#000'} emissiveIntensity={e ? ei : 0} />
    </mesh>
  )
}

function Desk({ t }: { t: Hotel['theme'] }) {
  return (
    <group>
      <B s={[5, 1.2, 1.6]} p={[0, 0.6, 0]} c="#10203f" m={0.5} r={0.35} />
      <B s={[5.2, 0.14, 1.8]} p={[0, 1.27, 0]} c={t.primary} m={0.9} r={0.2} e={t.primary} ei={0.25} />
      <B s={[1.3, 0.8, 0.08]} p={[-1.2, 1.9, -0.2]} c="#0b1530" e="#22d3ee" ei={0.9} />
      <B s={[1.3, 0.8, 0.08]} p={[1.2, 1.9, -0.2]} c="#0b1530" e="#22d3ee" ei={0.9} />
      <Cyl a={[0.16, 0.2, 0.12]} p={[0, 1.4, 0.4]} c="#ffd98a" e="#ffd98a" ei={0.6} />
    </group>
  )
}
function Room({ t }: { t: Hotel['theme'] }) {
  return (
    <group>
      <B s={[3.6, 0.5, 4.4]} p={[0, 0.25, 0]} c="#1a2748" />
      <B s={[3.3, 0.4, 4.1]} p={[0, 0.7, 0.05]} c="#f2f5ff" r={0.9} m={0} />
      <B s={[1.2, 0.25, 0.7]} p={[-0.8, 1.05, -1.5]} c="#ffffff" r={0.9} m={0} />
      <B s={[1.2, 0.25, 0.7]} p={[0.8, 1.05, -1.5]} c="#ffffff" r={0.9} m={0} />
      <B s={[3.8, 2, 0.25]} p={[0, 1.4, -2.3]} c={t.primary} m={0.6} r={0.35} e={t.primary} ei={0.15} />
      <B s={[0.7, 0.7, 0.7]} p={[-2.4, 0.35, -1.8]} c="#10203f" />
      <B s={[0.7, 0.7, 0.7]} p={[2.4, 0.35, -1.8]} c="#10203f" />
      <mesh position={[-2.4, 1.1, -1.8]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#fff2c8" emissive="#ffd98a" emissiveIntensity={1.4} />
      </mesh>
      <mesh position={[2.4, 1.1, -1.8]}>
        <sphereGeometry args={[0.28, 12, 12]} />
        <meshStandardMaterial color="#fff2c8" emissive="#ffd98a" emissiveIntensity={1.4} />
      </mesh>
      <B s={[3.6, 0.1, 1.2]} p={[0, 0.9, 1.6]} c={t.accent} e={t.primary} ei={0.3} />
    </group>
  )
}
function Meeting({ t }: { t: Hotel['theme'] }) {
  return (
    <group>
      <Cyl a={[1.9, 1.9, 0.14]} p={[0, 1.1, 0]} c="#12224a" seg={40} />
      <Cyl a={[1.92, 1.92, 0.05]} p={[0, 1.19, 0]} c={t.primary} e={t.primary} ei={0.3} seg={40} />
      <Cyl a={[0.25, 0.4, 1.1]} p={[0, 0.55, 0]} c="#0b1530" />
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2
        return (
          <group key={i} position={[Math.cos(a) * 2.5, 0, Math.sin(a) * 2.5]} rotation={[0, -a + Math.PI / 2, 0]}>
            <B s={[0.8, 0.12, 0.8]} p={[0, 0.7, 0]} c="#e8ecff" />
            <B s={[0.8, 0.8, 0.1]} p={[0, 1.1, 0.4]} c="#e8ecff" />
            <Cyl a={[0.06, 0.06, 0.7]} p={[0, 0.35, 0]} c="#1b2a52" seg={8} />
          </group>
        )
      })}
      <B s={[4.6, 2.2, 0.1]} p={[0, 2.2, -3.9]} c="#06122c" e="#22d3ee" ei={0.6} />
    </group>
  )
}
function Kitchen({ t }: { t: Hotel['theme'] }) {
  const flame = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (flame.current) flame.current.scale.setScalar(0.8 + Math.sin(s.clock.elapsedTime * 9) * 0.2)
  })
  return (
    <group>
      <B s={[5, 1.1, 1.6]} p={[0, 0.55, 0]} c="#b9c4d8" m={0.85} r={0.25} />
      <B s={[5.2, 0.12, 1.8]} p={[0, 1.16, 0]} c="#dfe6f4" m={0.9} r={0.2} />
      <B s={[3.4, 0.7, 1.4]} p={[0, 3.2, -0.2]} c="#8d99b0" m={0.8} r={0.3} />
      <Cyl a={[0.35, 0.4, 0.4]} p={[-1.2, 1.4, 0]} c="#2a2f3c" />
      <Cyl a={[0.35, 0.4, 0.4]} p={[0, 1.4, 0]} c="#2a2f3c" />
      <Cyl a={[0.35, 0.4, 0.4]} p={[1.2, 1.4, 0]} c="#2a2f3c" />
      <mesh ref={flame} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.18, 10, 10]} />
        <meshStandardMaterial color="#ff9a3c" emissive="#ff7a1a" emissiveIntensity={2} />
      </mesh>
      <B s={[5, 0.08, 0.2]} p={[0, 1.2, 0.85]} c={t.primary} e={t.primary} ei={0.8} />
    </group>
  )
}
function Ops({ t }: { t: Hotel['theme'] }) {
  return (
    <group>
      <B s={[2.2, 0.12, 1.1]} p={[0, 0.5, 0]} c="#c9d3ea" m={0.8} />
      <B s={[2.2, 0.12, 1.1]} p={[0, 1.2, 0]} c="#c9d3ea" m={0.8} />
      <B s={[2.2, 0.12, 1.1]} p={[0, 1.9, 0]} c="#c9d3ea" m={0.8} />
      {[-0.9, 0.9].map((x) => (
        <B key={x} s={[0.08, 1.5, 1.1]} p={[x, 1.2, 0]} c="#9aa7c4" m={0.8} />
      ))}
      {[0.7, 1.4].map((y) => (
        <B key={y} s={[1.8, 0.35, 0.9]} p={[0, y, 0]} c="#ffffff" r={0.95} m={0} />
      ))}
      <B s={[0.9, 0.5, 0.8]} p={[0, 2.2, 0]} c={t.primary} e={t.primary} ei={0.3} />
      <B s={[2.6, 0.5, 0.06]} p={[0, 2.9, -2]} c="#06122c" e="#22d3ee" ei={0.7} />
      <B s={[3, 3, 0.1]} p={[0, 2, -2.4]} c="#0b1a38" e={t.primary} ei={0.2} />
    </group>
  )
}
function Server({ t }: { t: Hotel['theme'] }) {
  const leds = useRef<THREE.Group>(null)
  useFrame((s) => {
    leds.current?.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.4 + (Math.sin(s.clock.elapsedTime * 4 + i * 1.7) > 0.2 ? 1.6 : 0)
    })
  })
  return (
    <group>
      {[-1.4, 0, 1.4].map((x) => (
        <B key={x} s={[1.1, 3.4, 1.1]} p={[x, 1.7, 0]} c="#0a1228" m={0.6} r={0.3} />
      ))}
      <group ref={leds}>
        {[-1.4, 0, 1.4].flatMap((x) =>
          [0.6, 1.2, 1.8, 2.4, 3].map((y) => (
            <mesh key={`${x}${y}`} position={[x, y, 0.57]}>
              <boxGeometry args={[0.8, 0.07, 0.02]} />
              <meshStandardMaterial color={t.primary} emissive={t.primary} emissiveIntensity={1} />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}
function Lounge({ t }: { t: Hotel['theme'] }) {
  return (
    <group>
      <B s={[3.4, 0.55, 1.3]} p={[0, 0.5, 0]} c="#2b2150" r={0.8} m={0.05} />
      <B s={[3.4, 0.9, 0.35]} p={[0, 1.1, -0.55]} c="#2b2150" r={0.8} m={0.05} />
      <B s={[0.3, 0.8, 1.3]} p={[-1.55, 0.85, 0]} c="#2b2150" r={0.8} m={0.05} />
      <B s={[0.3, 0.8, 1.3]} p={[1.55, 0.85, 0]} c="#2b2150" r={0.8} m={0.05} />
      <Cyl a={[0.7, 0.7, 0.08]} p={[0, 0.5, 1.6]} c={t.primary} e={t.primary} ei={0.25} />
      <Cyl a={[0.07, 0.07, 0.5]} p={[0, 0.25, 1.6]} c="#0b1530" seg={8} />
      <Cyl a={[0.28, 0.22, 0.5]} p={[2.5, 0.25, -0.2]} c="#6b3f22" />
      <mesh position={[2.5, 1, -0.2]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#1f7a4d" emissive="#0d3b24" emissiveIntensity={0.6} />
      </mesh>
    </group>
  )
}

const PROPS: Record<DeptKind, (p: { t: Hotel['theme'] }) => JSX.Element> = {
  desk: Desk,
  room: Room,
  meeting: Meeting,
  kitchen: Kitchen,
  ops: Ops,
  server: Server,
  lounge: Lounge,
}

const KIND_ICON: Record<DeptKind, string> = { desk: '🛎️', room: '🛏️', meeting: '🧑‍💼', kitchen: '🍽️', ops: '🧹', server: '🖥️', lounge: '🛋️' }

export function Station({ dept, pos, theme, onOpen }: { dept: Department; pos: [number, number]; theme: Hotel['theme']; onOpen: (d: Department, p: [number, number]) => void }) {
  const [hov, setHov] = useState(false)
  const ring = useRef<THREE.Mesh>(null)
  const Prop = PROPS[dept.kind]
  const yaw = useMemo(() => Math.atan2(-pos[0], 4 - pos[1]), [pos])
  const lesson = lessonById(dept.lessonId)
  useFrame((s) => {
    if (!ring.current) return
    const m = ring.current.material as THREE.MeshBasicMaterial
    m.opacity = hov ? 0.9 : 0.35 + Math.sin(s.clock.elapsedTime * 2.4 + pos[0]) * 0.15
    ring.current.scale.setScalar(hov ? 1.08 : 1)
  })
  return (
    <group
      position={[pos[0], 0, pos[1]]}
      rotation={[0, yaw, 0]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHov(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHov(false)
        document.body.style.cursor = ''
      }}
      onClick={(e) => {
        if (e.delta > 6) return
        e.stopPropagation()
        onOpen(dept, pos)
      }}
    >
      <Prop t={theme} />
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <ringGeometry args={[3.3, 3.6, 48]} />
        <meshBasicMaterial color={theme.primary} transparent opacity={0.4} toneMapped={false} depthWrite={false} />
      </mesh>
      <Html position={[0, 4.4, 0]} center zIndexRange={[20, 0]} distanceFactor={13}>
        <button
          type="button"
          onClick={() => onOpen(dept, pos)}
          onPointerEnter={() => setHov(true)}
          onPointerLeave={() => setHov(false)}
          className="group flex min-w-[250px] max-w-[300px] items-center gap-3 rounded-2xl border border-white/25 bg-navy/85 px-4 py-3 text-left shadow-xl backdrop-blur transition hover:border-gold hover:bg-navy"
          style={{ boxShadow: `0 0 26px ${theme.primary}55` }}
          aria-label={`${dept.name} 교육 열기`}
        >
          <span className="text-3xl">{KIND_ICON[dept.kind]}</span>
          <span>
            <span className="block text-[26px] font-bold leading-tight text-white">{dept.name}</span>
            <span className="block text-[17px] leading-snug text-cyan-200">{lesson ? `L${String(lesson.no).padStart(2, '0')} ${lesson.title}` : dept.en}</span>
            <span className="mt-1 block text-[15px] font-semibold text-gold group-hover:underline">클릭하여 학습 시작 ▶</span>
          </span>
        </button>
      </Html>
    </group>
  )
}
