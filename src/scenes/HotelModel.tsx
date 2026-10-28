import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Hotel } from '../types'
import { STYLE_HEIGHT } from '../data/hotels'
import { glowTexture, labelTexture, windowTexture } from './textures'

export const HOTEL_HEIGHT = STYLE_HEIGHT

function Box({ s, p, color, rough = 0.5, metal = 0.2, emissive, ei = 1, rot }: { s: [number, number, number]; p: [number, number, number]; color: string; rough?: number; metal?: number; emissive?: string; ei?: number; rot?: [number, number, number] }) {
  return (
    <mesh position={p} rotation={rot}>
      <boxGeometry args={s} />
      <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? '#000000'} emissiveIntensity={emissive ? ei : 0} />
    </mesh>
  )
}

/** 창문 텍스처가 입혀진 건물 블록 */
function Tower({ w, h, d, p, seed, theme, dark = '#0b1a38', frame = '#102246', litRatio = 0.55, tint = '#27406e' }: { w: number; h: number; d: number; p: [number, number, number]; seed: number; theme: Hotel['theme']; dark?: string; frame?: string; litRatio?: number; tint?: string }) {
  const mats = useMemo(() => {
    const mk = (cols: number, rows: number, s: number) => {
      const tex = windowTexture({ cols, rows, lit: '#ffe8a8', dark, frame, seed: seed + s, litRatio })
      return new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.85, roughness: 0.35, metalness: 0.45, color: tint })
    }
    const roof = new THREE.MeshStandardMaterial({ color: '#1a2748', roughness: 0.8 })
    const side = mk(Math.max(2, Math.round(d / 1.7)), Math.max(3, Math.round(h / 2.2)), 1)
    const front = mk(Math.max(2, Math.round(w / 1.7)), Math.max(3, Math.round(h / 2.2)), 2)
    return [side, side, roof, roof, front, front]
  }, [w, h, d, seed, dark, frame, litRatio, tint])
  void theme
  return (
    <mesh position={[p[0], p[1] + h / 2, p[2]]} material={mats}>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  )
}

function Glow({ p, color, size = 8 }: { p: [number, number, number]; color: string; size?: number }) {
  const map = useMemo(() => glowTexture(color), [color])
  return (
    <sprite position={p} scale={[size, size, 1]}>
      <spriteMaterial map={map} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

function Sign({ name, color, sub, p, w = 9 }: { name: string; color: string; sub?: string; p: [number, number, number]; w?: number }) {
  const map = useMemo(() => labelTexture(name, color, sub), [name, color, sub])
  const ratio = sub ? 280 / 1024 : 200 / 1024
  return (
    <mesh position={p}>
      <planeGeometry args={[w, w * ratio]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Entrance({ theme, z, wide = 6 }: { theme: Hotel['theme']; z: number; wide?: number }) {
  return (
    <group position={[0, 0, z]}>
      <Box s={[wide + 2, 0.4, 4]} p={[0, 4.4, 1.2]} color="#0a1228" metal={0.6} rough={0.3} />
      <Box s={[wide + 2, 0.12, 4]} p={[0, 4.62, 1.2]} color={theme.primary} emissive={theme.primary} ei={1.2} />
      <Box s={[0.35, 4.4, 0.35]} p={[-wide / 2 - 0.6, 2.2, 3]} color={theme.primary} metal={0.8} rough={0.25} />
      <Box s={[0.35, 4.4, 0.35]} p={[wide / 2 + 0.6, 2.2, 3]} color={theme.primary} metal={0.8} rough={0.25} />
      <mesh position={[0, 2, 0.15]}>
        <planeGeometry args={[wide, 4]} />
        <meshStandardMaterial color="#ffe9b0" emissive="#ffd98a" emissiveIntensity={1.1} />
      </mesh>
      <Box s={[wide + 4, 0.15, 6]} p={[0, 0.08, 3.4]} color="#1b2d57" rough={0.4} metal={0.5} />
    </group>
  )
}

function Palm({ p, s = 1 }: { p: [number, number, number]; s?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 3.2, 6]} />
        <meshStandardMaterial color="#6b4a2b" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} position={[Math.cos((i / 5) * 6.28) * 0.7, 3.2, Math.sin((i / 5) * 6.28) * 0.7]} rotation={[Math.sin((i / 5) * 6.28) * 0.8, 0, -Math.cos((i / 5) * 6.28) * 0.8]}>
          <coneGeometry args={[0.35, 2, 4]} />
          <meshStandardMaterial color="#1f7a4d" />
        </mesh>
      ))}
    </group>
  )
}

function Classic({ theme }: { theme: Hotel['theme'] }) {
  return (
    <group>
      <Tower w={14} h={5} d={11} p={[0, 0, 0]} seed={11} theme={theme} tint="#3a4a78" />
      <Tower w={10} h={24} d={8} p={[0, 5, -0.5]} seed={12} theme={theme} />
      <Tower w={7} h={4} d={6} p={[0, 29, -0.5]} seed={13} theme={theme} tint="#3a4a78" />
      <mesh position={[0, 35.4, -0.5]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.6, 3.6, 4]} />
        <meshStandardMaterial color={theme.primary} metalness={0.9} roughness={0.2} emissive={theme.primary} emissiveIntensity={0.4} />
      </mesh>
      {[-4.2, -2.1, 0, 2.1, 4.2].map((x) => (
        <Box key={x} s={[0.22, 24, 0.5]} p={[x, 17, 3.7]} color={theme.primary} metal={0.9} rough={0.2} emissive={theme.primary} ei={0.35} />
      ))}
      <Box s={[10.6, 0.5, 8.6]} p={[0, 29.1, -0.5]} color={theme.primary} metal={0.9} rough={0.25} emissive={theme.primary} ei={0.6} />
      <Entrance theme={theme} z={5.5} />
      <Sign name="AURORA" sub="GRAND HOTEL" color={theme.primary} p={[0, 7.4, 5.65]} w={9} />
      <Glow p={[0, 36, 0]} color={theme.primary} size={10} />
    </group>
  )
}

function Resort({ theme }: { theme: Hotel['theme'] }) {
  const wing = useMemo(() => {
    const tex = windowTexture({ cols: 26, rows: 5, lit: '#fff1c4', dark: '#0a2540', frame: '#0c2d4f', seed: 31, litRatio: 0.5 })
    return new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.8, roughness: 0.3, metalness: 0.4, side: THREE.DoubleSide, color: '#2f6a9d' })
  }, [])
  return (
    <group>
      {/* 곡면 객실 윙 3단 */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 4.2 + 2.1, -3 - i * 0.2]} material={wing}>
          <cylinderGeometry args={[11 - i * 1.2, 11 - i * 1.2, 4.2, 40, 1, true, -Math.PI * 0.62, Math.PI * 1.24]} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={'r' + i} position={[0, i * 4.2 + 4.3, -3 - i * 0.2]}>
          <cylinderGeometry args={[11.4 - i * 1.2, 11.4 - i * 1.2, 0.25, 40, 1, false, -Math.PI * 0.62, Math.PI * 1.24]} />
          <meshStandardMaterial color="#e8f6ff" roughness={0.5} emissive={theme.primary} emissiveIntensity={0.25} />
        </mesh>
      ))}
      <Box s={[22, 3, 9]} p={[0, 1.5, 1]} color="#0d2a48" metal={0.5} rough={0.35} />
      {/* 수영장 */}
      <mesh position={[0, 0.08, 9.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.9} roughness={0.1} />
      </mesh>
      <Palm p={[-8, 0, 9]} />
      <Palm p={[8.5, 0, 10]} s={1.2} />
      <Palm p={[-5, 0, 13]} s={0.9} />
      <Palm p={[6, 0, 14]} />
      <Entrance theme={theme} z={5.5} wide={7} />
      <Sign name="BLUEWAVE" sub="RESORT" color={theme.primary} p={[0, 6.4, 5.7]} w={9} />
      <Glow p={[0, 5, 9.5]} color="#22d3ee" size={12} />
    </group>
  )
}

function Palace({ theme }: { theme: Hotel['theme'] }) {
  return (
    <group>
      <Tower w={18} h={10} d={10} p={[0, 0, 0]} seed={41} theme={theme} tint="#52407a" frame="#2a1b4d" dark="#150d2c" />
      <Tower w={7} h={8} d={9} p={[-11.5, 0, -0.5]} seed={42} theme={theme} tint="#52407a" frame="#2a1b4d" dark="#150d2c" />
      <Tower w={7} h={8} d={9} p={[11.5, 0, -0.5]} seed={43} theme={theme} tint="#52407a" frame="#2a1b4d" dark="#150d2c" />
      <Tower w={9} h={7} d={8} p={[0, 10, -0.5]} seed={44} theme={theme} tint="#52407a" frame="#2a1b4d" dark="#150d2c" />
      {/* 기둥열 */}
      {[-6.6, -4.4, -2.2, 0, 2.2, 4.4, 6.6].map((x) => (
        <mesh key={x} position={[x, 4.5, 5.6]}>
          <cylinderGeometry args={[0.45, 0.5, 9, 12]} />
          <meshStandardMaterial color="#f3ecff" roughness={0.35} metalness={0.2} emissive={theme.primary} emissiveIntensity={0.12} />
        </mesh>
      ))}
      <Box s={[16, 0.6, 2]} p={[0, 9.3, 5.6]} color="#f3ecff" />
      {/* 박공 */}
      <mesh position={[0, 11, 5.6]} rotation={[0, 0, 0]}>
        <coneGeometry args={[8.4, 3.4, 3]} />
        <meshStandardMaterial color="#e5d9ff" roughness={0.4} emissive={theme.primary} emissiveIntensity={0.2} />
      </mesh>
      {/* 돔 */}
      <mesh position={[0, 17, -0.5]}>
        <sphereGeometry args={[3.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={theme.primary} metalness={0.9} roughness={0.2} emissive={theme.primary} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 21.2, -0.5]}>
        <coneGeometry args={[0.25, 2.6, 6]} />
        <meshStandardMaterial color="#ffe08a" emissive="#ffe08a" emissiveIntensity={1} />
      </mesh>
      <Entrance theme={theme} z={6} wide={6} />
      <Sign name="THE LUMEN PALACE" color={theme.accent} p={[0, 12.6, 7.1]} w={10} />
      <Glow p={[0, 18, 0]} color={theme.primary} size={14} />
    </group>
  )
}

function Business({ theme }: { theme: Hotel['theme'] }) {
  return (
    <group>
      <Tower w={9} h={26} d={7} p={[-2.2, 0, 0]} seed={51} theme={theme} tint="#2e5f95" frame="#0d2b4f" dark="#08203d" />
      <Tower w={7} h={19} d={6} p={[5, 0, 1.2]} seed={52} theme={theme} tint="#2e5f95" frame="#0d2b4f" dark="#08203d" />
      {[6, 11, 16, 21].map((y) => (
        <Box key={y} s={[9.4, 0.18, 7.4]} p={[-2.2, y, 0]} color={theme.primary} emissive={theme.primary} ei={1.3} />
      ))}
      {[5, 10, 15].map((y) => (
        <Box key={'b' + y} s={[7.4, 0.18, 6.4]} p={[5, y, 1.2]} color={theme.accent} emissive={theme.accent} ei={1.1} />
      ))}
      <Box s={[0.35, 26, 0.35]} p={[-6.8, 13, 3.4]} color={theme.primary} emissive={theme.primary} ei={1.4} />
      <Box s={[0.35, 26, 0.35]} p={[2.4, 13, 3.4]} color={theme.primary} emissive={theme.primary} ei={1.4} />
      <Box s={[6, 1.6, 0.5]} p={[-2.2, 27.1, 0]} color="#08203d" emissive={theme.primary} ei={0.6} />
      <Box s={[16, 2.6, 8]} p={[0, 1.3, 1.5]} color="#0d2a48" metal={0.5} />
      <group position={[-1, 0, 0]}>
        <Entrance theme={theme} z={5.2} wide={5.5} />
      </group>
      <Sign name="NEXUS" sub="BUSINESS HOTEL" color={theme.primary} p={[-1, 6.6, 5.4]} w={8} />
      <Glow p={[-2.2, 28, 0]} color={theme.primary} size={10} />
    </group>
  )
}

function Smart({ theme }: { theme: Hotel['theme'] }) {
  const ring = useRef<THREE.Group>(null)
  const orbs = useRef<THREE.Group>(null)
  useFrame((s, dt) => {
    if (ring.current) ring.current.rotation.y += dt * 0.6
    if (orbs.current) {
      orbs.current.rotation.y -= dt * 0.35
      orbs.current.children.forEach((c, i) => (c.position.y = 33 + Math.sin(s.clock.elapsedTime * 1.2 + i) * 0.8))
    }
  })
  const mats = useMemo(() => {
    const tex = windowTexture({ cols: 14, rows: 9, lit: '#b6fff0', dark: '#06232b', frame: '#073039', seed: 61, litRatio: 0.5 })
    return new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.9, roughness: 0.25, metalness: 0.6, color: '#1c7f8a' })
  }, [])
  return (
    <group>
      <mesh position={[0, 11, 0]} material={mats}>
        <cylinderGeometry args={[5.4, 6.4, 22, 36, 1, false]} />
      </mesh>
      <mesh position={[0, 25, 0]} material={mats}>
        <cylinderGeometry args={[4.2, 5.4, 6, 36]} />
      </mesh>
      {[4, 9, 14, 19, 24].map((y, i) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[5.9 - i * 0.18, 0.1, 8, 48]} />
          <meshStandardMaterial color={theme.primary} emissive={theme.primary} emissiveIntensity={1.6} />
        </mesh>
      ))}
      <group ref={ring} position={[0, 29.5, 0]}>
        <mesh rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[7, 0.25, 12, 64]} />
          <meshStandardMaterial color={theme.accent} emissive={theme.primary} emissiveIntensity={1.4} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      <group ref={orbs}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i / 3) * 6.28) * 4.2, 33, Math.sin((i / 3) * 6.28) * 4.2]}>
            <sphereGeometry args={[0.55, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive={theme.primary} emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
      <Box s={[14, 3, 10]} p={[0, 1.5, 1]} color="#07303a" metal={0.6} rough={0.3} />
      <Box s={[12, 0.3, 9]} p={[0, 3.1, 1]} color="#0c4a57" emissive={theme.primary} ei={0.4} />
      <Entrance theme={theme} z={5.8} wide={6} />
      <Sign name="HORIZON" sub="SMART HOTEL" color={theme.primary} p={[0, 7, 6.2]} w={9} />
      <Glow p={[0, 31, 0]} color={theme.primary} size={14} />
    </group>
  )
}

export function HotelModel({ hotel, active }: { hotel: Hotel; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null)
  useFrame((s) => {
    if (ringRef.current) {
      const m = ringRef.current.material as THREE.MeshBasicMaterial
      m.opacity = active ? 0.55 + Math.sin(s.clock.elapsedTime * 3) * 0.25 : 0.18
      ringRef.current.scale.setScalar(1 + (active ? Math.sin(s.clock.elapsedTime * 3) * 0.03 : 0))
    }
  })
  const style = {
    classic: <Classic theme={hotel.theme} />,
    resort: <Resort theme={hotel.theme} />,
    palace: <Palace theme={hotel.theme} />,
    business: <Business theme={hotel.theme} />,
    smart: <Smart theme={hotel.theme} />,
  }[hotel.style]
  return (
    <group>
      {style}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 4]}>
        <ringGeometry args={[14, 15, 64]} />
        <meshBasicMaterial color={hotel.theme.primary} transparent opacity={0.2} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}
