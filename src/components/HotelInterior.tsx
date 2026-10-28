import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { hotelById, hotels } from '../data/hotels'
import { Station } from '../scenes/Stations'
import { floorTexture, labelTexture } from '../scenes/textures'
import { useStore } from '../utils/store'
import { roomMetrics, pct } from '../utils/calc'
import type { Department } from '../types'

const LAYOUT: Record<number, [number, number][]> = {
  1: [[0, -8]],
  2: [[-9, -7], [9, -7]],
  3: [[-12, -4], [0, -9.5], [12, -4]],
  4: [[-13, -3], [-5, -9], [5, -9], [13, -3]],
}

const STATUS_COLORS = { occupied: '#38bdf8', vacant: '#1d3557', cleaning: '#facc15', vip: '#f472b6' }
type Status = keyof typeof STATUS_COLORS

/** 디지털 트윈: 호텔 객실 점유 상태를 실시간처럼 시각화(가상 데이터) */
function DigitalTwin({ occ, adr, rooms, primary }: { occ: number; adr: number; rooms: number; primary: string }) {
  const FLOORS = 9
  const PER = 5
  const make = () =>
    Array.from({ length: FLOORS * PER }, (): Status => {
      const r = Math.random()
      if (r < 0.06) return 'vip'
      if (r < 0.1) return 'cleaning'
      return r < 0.1 + occ * 0.9 ? 'occupied' : 'vacant'
    })
  const [cells, setCells] = useState<Status[]>(make)
  useEffect(() => {
    const id = setInterval(() => {
      setCells((prev) => {
        const next = prev.slice()
        for (let k = 0; k < 4; k++) {
          const i = Math.floor(Math.random() * next.length)
          const r = Math.random()
          next[i] = r < 0.05 ? 'vip' : r < 0.1 ? 'cleaning' : r < 0.1 + occ * 0.9 ? 'occupied' : 'vacant'
        }
        return next
      })
    }, 1600)
    return () => clearInterval(id)
  }, [occ])
  const grp = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (grp.current) grp.current.rotation.y += dt * 0.25
  })
  const sold = cells.filter((c) => c === 'occupied' || c === 'vip').length
  const m = roomMetrics(cells.length, sold, sold * adr)
  const cleaning = cells.filter((c) => c === 'cleaning').length
  const vip = cells.filter((c) => c === 'vip').length
  void rooms
  return (
    <group position={[0, 0, 1]}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[3, 3.3, 0.3, 40]} />
        <meshStandardMaterial color="#0a1530" metalness={0.8} roughness={0.25} emissive={primary} emissiveIntensity={0.18} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.32, 0]}>
        <ringGeometry args={[2.6, 2.8, 48]} />
        <meshBasicMaterial color={primary} toneMapped={false} />
      </mesh>
      <group ref={grp}>
        {Array.from({ length: FLOORS }).map((_, f) =>
          Array.from({ length: PER }).map((__, i) => {
            const st = cells[f * PER + i]
            const a = (i / PER) * Math.PI * 2
            return (
              <mesh key={`${f}-${i}`} position={[Math.cos(a) * 1.05, 0.7 + f * 0.36, Math.sin(a) * 1.05]} rotation={[0, -a, 0]}>
                <boxGeometry args={[0.7, 0.28, 0.5]} />
                <meshStandardMaterial color={STATUS_COLORS[st]} emissive={STATUS_COLORS[st]} emissiveIntensity={st === 'vacant' ? 0.15 : 0.9} />
              </mesh>
            )
          }),
        )}
      </group>
      <Html position={[0, 5.2, 0]} center distanceFactor={12} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <div className="w-[300px] rounded-2xl border border-cyan-300/40 bg-navy/85 p-4 text-white shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between text-[13px] font-semibold tracking-widest text-cyan-300">
            <span>DIGITAL TWIN</span>
            <span className="flex items-center gap-1 text-emerald-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />LIVE(가상)</span>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div><div className="text-[12px] text-slate-300">OCC</div><div className="text-[22px] font-bold text-gold">{pct(m.occ, 0)}</div></div>
            <div><div className="text-[12px] text-slate-300">ADR</div><div className="text-[20px] font-bold text-gold">{Math.round(adr / 1000)}천원</div></div>
            <div><div className="text-[12px] text-slate-300">RevPAR</div><div className="text-[20px] font-bold text-gold">{Math.round((m.occ * adr) / 1000)}천원</div></div>
          </div>
          <div className="mt-3 flex justify-between text-[12px] text-slate-200">
            <Legend c={STATUS_COLORS.occupied} t="투숙" />
            <Legend c={STATUS_COLORS.vacant} t="공실" />
            <Legend c={STATUS_COLORS.cleaning} t={`청소 ${cleaning}`} />
            <Legend c={STATUS_COLORS.vip} t={`VIP ${vip}`} />
          </div>
        </div>
      </Html>
    </group>
  )
}
function Legend({ c, t }: { c: string; t: string }) {
  return (
    <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: c }} />{t}</span>
  )
}

function Shell({ hotelId }: { hotelId: string }) {
  const h = hotelById(hotelId) ?? hotels[0]
  const floor = useMemo(() => floorTexture('#0d1a38', '#12224a', h.theme.primary + '55'), [h.theme.primary])
  const sign = useMemo(() => labelTexture(h.name, h.theme.primary, h.tagline.length > 28 ? undefined : h.tagline), [h])
  const city = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 1024
    c.height = 256
    const g = c.getContext('2d')!
    const grad = g.createLinearGradient(0, 0, 0, 256)
    grad.addColorStop(0, '#0b1d4a')
    grad.addColorStop(1, '#16335f')
    g.fillStyle = grad
    g.fillRect(0, 0, 1024, 256)
    let seed = 5
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 40; i++) {
      const w = 20 + r() * 40
      const hh = 40 + r() * 160
      const x = r() * 1024
      g.fillStyle = '#0a1738'
      g.fillRect(x, 256 - hh, w, hh)
      for (let y = 256 - hh + 6; y < 250; y += 12)
        for (let xx = x + 4; xx < x + w - 4; xx += 9) {
          if (r() < 0.45) {
            g.fillStyle = r() < 0.8 ? '#ffe7a0' : h.theme.accent
            g.fillRect(xx, y, 4, 6)
          }
        }
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [h.theme.accent])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <planeGeometry args={[42, 30]} />
        <meshStandardMaterial map={floor} metalness={0.55} roughness={0.28} />
      </mesh>
      {/* 러그 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 1]}>
        <circleGeometry args={[6.5, 48]} />
        <meshStandardMaterial color="#0a1530" emissive={h.theme.primary} emissiveIntensity={0.08} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 1]}>
        <ringGeometry args={[6.3, 6.5, 64]} />
        <meshBasicMaterial color={h.theme.primary} toneMapped={false} />
      </mesh>
      {/* 벽 */}
      <mesh position={[0, 6, -16]}>
        <planeGeometry args={[42, 12]} />
        <meshStandardMaterial color="#0b1530" roughness={0.7} />
      </mesh>
      <mesh position={[0, 6.2, -15.9]}>
        <planeGeometry args={[30, 4.5]} />
        <meshBasicMaterial map={city} toneMapped={false} />
      </mesh>
      <mesh position={[0, 10.6, -15.8]}>
        <planeGeometry args={[13, 13 * (h.tagline.length > 28 ? 200 / 1024 : 280 / 1024)]} />
        <meshBasicMaterial map={sign} transparent toneMapped={false} />
      </mesh>
      {[-21, 21].map((x) => (
        <mesh key={x} position={[x, 6, -2]} rotation={[0, x > 0 ? -Math.PI / 2 : Math.PI / 2, 0]}>
          <planeGeometry args={[30, 12]} />
          <meshStandardMaterial color="#0b1530" roughness={0.7} />
        </mesh>
      ))}
      <mesh position={[0, 12, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[42, 30]} />
        <meshStandardMaterial color="#070e22" />
      </mesh>
      {/* 기둥 + 조명 띠 */}
      {[-19, -9.5, 9.5, 19].map((x) => (
        <group key={x} position={[x, 0, -14]}>
          <mesh position={[0, 5, 0]}>
            <cylinderGeometry args={[0.6, 0.7, 10, 16]} />
            <meshStandardMaterial color="#e9edf8" metalness={0.3} roughness={0.35} emissive={h.theme.primary} emissiveIntensity={0.08} />
          </mesh>
          <mesh position={[0, 9.6, 0]}>
            <boxGeometry args={[1.6, 0.5, 1.6]} />
            <meshStandardMaterial color={h.theme.primary} metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}
      {[-6, 0, 6].map((x) => (
        <mesh key={x} position={[x, 11.8, -2]}>
          <boxGeometry args={[0.3, 0.1, 26]} />
          <meshBasicMaterial color={h.theme.accent} toneMapped={false} />
        </mesh>
      ))}
      {/* 샹들리에 */}
      <group position={[0, 8.2, 3]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.08, 8, 40]} />
          <meshStandardMaterial color={h.theme.primary} metalness={1} roughness={0.15} emissive={h.theme.primary} emissiveIntensity={0.6} />
        </mesh>
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} position={[Math.cos((i / 16) * 6.28) * 1.8, -0.2, Math.sin((i / 16) * 6.28) * 1.8]}>
            <sphereGeometry args={[0.16, 8, 8]} />
            <meshStandardMaterial color="#fff6d6" emissive="#ffe6a0" emissiveIntensity={2} />
          </mesh>
        ))}
        <pointLight color="#ffe6b8" intensity={45} distance={30} />
      </group>
    </group>
  )
}

export function HotelInterior() {
  const hotelId = useStore((s) => s.hotelId) ?? hotels[0].id
  const h = hotelById(hotelId) ?? hotels[0]
  const flyTo = useStore((s) => s.flyTo)
  const openDept = useStore((s) => s.openDept)
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null }

  // 입장 연출: 로비 입구에서 중앙으로 걸어 들어오는 카메라
  useEffect(() => {
    camera.position.set(0, 6, 44)
    controls?.target.set(0, 2.4, -3)
    controls?.update()
    flyTo([0, 9.5, 25], [0, 2.2, -4])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls, hotelId])

  const slots = LAYOUT[Math.min(4, h.departments.length)]

  const onOpen = (d: Department, p: [number, number]) => {
    flyTo([p[0] * 0.5, 5.2, p[1] * 0.5 + 12], [p[0], 1.8, p[1]])
    setTimeout(() => openDept(d.id), 550)
  }

  return (
    <>
      <color attach="background" args={['#050b1d']} />
      <fog attach="fog" args={['#050b1d', 36, 90]} />
      <hemisphereLight args={['#9fb4e8', '#0b1230', 0.75]} />
      <pointLight position={[0, 8, 12]} intensity={30} color="#ffd9a0" distance={40} />
      <pointLight position={[-14, 6, -4]} intensity={18} color={h.theme.primary} distance={26} />
      <pointLight position={[14, 6, -4]} intensity={18} color={h.theme.accent} distance={26} />
      <Shell hotelId={hotelId} />
      <DigitalTwin occ={h.facts.occ} adr={h.facts.adr} rooms={h.facts.rooms} primary={h.theme.primary} />
      {h.departments.map((d, i) => (
        <Station key={d.id} dept={d} pos={slots[i]} theme={h.theme} onOpen={onOpen} />
      ))}
      <Sparkles count={50} scale={[34, 8, 24]} size={2.4} speed={0.25} color={h.theme.accent} position={[0, 5, -2]} />
    </>
  )
}
