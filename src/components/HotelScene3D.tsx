import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { hotels } from '../data/hotels'
import { HotelModel, HOTEL_HEIGHT } from '../scenes/HotelModel'
import { CameraRig } from '../scenes/CameraRig'
import { HotelInterior } from './HotelInterior'
import { OVERVIEW_CAM, useStore } from '../utils/store'
import { isMobile } from '../utils/env'

function Tree({ p, s = 1 }: { p: [number, number, number]; s?: number }) {
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.6, 6]} />
        <meshStandardMaterial color="#4a3320" />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <coneGeometry args={[1.1, 2.6, 7]} />
        <meshStandardMaterial color="#14532d" emissive="#0a2a18" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

function Plaza() {
  const trees = useMemo(() => {
    const out: { p: [number, number, number]; s: number }[] = []
    let seed = 7
    const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let i = 0; i < 46; i++) {
      const a = r() * Math.PI * 2
      const rad = 56 + r() * 18
      out.push({ p: [Math.cos(a) * rad * 1.1, 0, Math.sin(a) * rad * 0.7 - 12], s: 0.8 + r() * 0.9 })
    }
    for (let i = 0; i < 14; i++) out.push({ p: [-50 + i * 7.6, 0, 18 + (i % 2) * 2], s: 0.7 })
    return out
  }, [])
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -8]}>
        <circleGeometry args={[110, 64]} />
        <meshStandardMaterial color="#071127" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 2]}>
        <planeGeometry args={[110, 8]} />
        <meshStandardMaterial color="#0c1a3a" roughness={0.6} metalness={0.3} />
      </mesh>
      <gridHelper args={[160, 40, '#1d4e89', '#0f2a52']} position={[0, 0.03, -8]} />
      {[-38, -19, 0, 19, 38].map((x, i) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.04, [2, -8, -15, -8, 2][i] + 9]}>
          <ringGeometry args={[3.2, 3.5, 40]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} toneMapped={false} />
        </mesh>
      ))}
      {trees.map((t, i) => (
        <Tree key={i} p={t.p} s={t.s} />
      ))}
    </group>
  )
}

function HotelTag({ id }: { id: string }) {
  const h = hotels.find((x) => x.id === id)!
  const focused = useStore((s) => s.hotelId === id)
  const focusHotel = useStore((s) => s.focusHotel)
  const hover = useStore((s) => s.hover)
  return (
    <Html position={[0, HOTEL_HEIGHT[h.style] + 4, 0]} center zIndexRange={[20, 0]} distanceFactor={46}>
      <button
        type="button"
        onClick={() => focusHotel(id)}
        onPointerEnter={() => hover(id)}
        onPointerLeave={() => hover(null)}
        className={`whitespace-nowrap rounded-full border px-5 py-2 text-[26px] font-bold tracking-wide backdrop-blur transition ${focused ? 'scale-110 border-gold bg-gold/90 text-navy' : 'border-white/30 bg-navy/70 text-white hover:border-gold'}`}
        style={{ boxShadow: `0 0 28px ${h.theme.primary}66` }}
        aria-label={`${h.name} 선택`}
      >
        {h.shortName}
      </button>
    </Html>
  )
}

function World() {
  const focusId = useStore((s) => s.hotelId)
  const hovered = useStore((s) => s.hoveredHotel)
  const focusHotel = useStore((s) => s.focusHotel)
  const hover = useStore((s) => s.hover)
  const { camera, controls } = useThree() as unknown as { camera: THREE.PerspectiveCamera; controls: { target: THREE.Vector3; update: () => void } | null }

  // 장면 진입 시 카메라를 광장 전경으로 초기화
  useEffect(() => {
    camera.position.set(...OVERVIEW_CAM.pos)
    controls?.target.set(...OVERVIEW_CAM.target)
    controls?.update()
    const id = useStore.getState().hotelId
    if (id) useStore.getState().focusHotel(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controls])

  return (
    <>
      <color attach="background" args={['#050a1c']} />
      <fog attach="fog" args={['#050a1c', 90, 260]} />
      <hemisphereLight args={['#6f8fd6', '#0a1230', 0.9]} />
      <directionalLight position={[-30, 50, 40]} intensity={0.8} color="#bcd0ff" />
      <pointLight position={[0, 40, 20]} intensity={0.6} color="#ffd9a0" distance={160} />
      <Stars radius={180} depth={60} count={2500} factor={5} saturation={0} fade speed={0.6} />
      {/* 달 */}
      <mesh position={[-70, 70, -150]}>
        <sphereGeometry args={[7, 24, 24]} />
        <meshBasicMaterial color="#f4f1e0" toneMapped={false} />
      </mesh>
      <Plaza />
      {hotels.map((h) => (
        <group
          key={h.id}
          position={[h.position[0], 0, h.position[1]]}
          rotation={[0, h.facing, 0]}
          onClick={(e) => {
            if (e.delta > 6) return
            e.stopPropagation()
            focusHotel(h.id)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            hover(h.id)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            hover(null)
            document.body.style.cursor = ''
          }}
        >
          <HotelModel hotel={h} active={focusId === h.id || hovered === h.id} />
          <group rotation={[0, -h.facing, 0]}>
            <HotelTag id={h.id} />
          </group>
        </group>
      ))}
      <Sparkles count={isMobile() ? 40 : 110} scale={[110, 36, 70]} size={3} speed={0.3} color="#7dd3fc" position={[0, 16, -8]} />
    </>
  )
}

/** 단일 Canvas — 광장(외부)과 호텔 로비(내부) 장면을 전환합니다. */
export function HotelScene3D() {
  const screen = useStore((s) => s.screen)
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, isMobile() ? 1.4 : 1.8]}
      camera={{ position: OVERVIEW_CAM.pos, fov: 45, near: 0.5, far: 600 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
    >
      <Suspense fallback={null}>
        {screen === 'world' ? <World /> : <HotelInterior />}
      </Suspense>
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={screen === 'world' ? Math.PI / 2.05 : Math.PI / 2.1}
        minAzimuthAngle={screen === 'world' ? -Infinity : -1.15}
        maxAzimuthAngle={screen === 'world' ? Infinity : 1.15}
        minDistance={screen === 'world' ? 8 : 5}
        maxDistance={screen === 'world' ? 140 : 30}
      />
      <CameraRig />
    </Canvas>
  )
}
