import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { useStore, type CamGoal } from '../utils/store'

/** store.camGoal 로 지정된 위치·목표로 카메라를 부드럽게 이동시킵니다. 사용자가 조작하면 즉시 중단합니다. */
export function CameraRig() {
  const goal = useStore((s) => s.camGoal)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null
  const size = useThree((s) => s.size)
  const active = useRef<CamGoal | null>(null)
  const t = useRef(0)

  // 화면 비율에 따라 시야각 조정 (세로 모바일 화면에서도 5개 호텔이 보이도록)
  useEffect(() => {
    const a = size.width / size.height
    camera.fov = a < 0.8 ? 72 : a < 1.2 ? 56 : 45
    camera.updateProjectionMatrix()
  }, [size, camera])

  useEffect(() => {
    active.current = goal
    t.current = 0
  }, [goal])

  useEffect(() => {
    if (!controls) return
    const stop = () => {
      active.current = null
    }
    controls.addEventListener('start', stop)
    return () => controls.removeEventListener('start', stop)
  }, [controls])

  useFrame((_, dt) => {
    const g = active.current
    if (!g || !controls) return
    t.current += dt
    const lam = 2.6
    const p = camera.position
    p.x = THREE.MathUtils.damp(p.x, g.pos[0], lam, dt)
    p.y = THREE.MathUtils.damp(p.y, g.pos[1], lam, dt)
    p.z = THREE.MathUtils.damp(p.z, g.pos[2], lam, dt)
    const tg = controls.target
    tg.x = THREE.MathUtils.damp(tg.x, g.target[0], lam, dt)
    tg.y = THREE.MathUtils.damp(tg.y, g.target[1], lam, dt)
    tg.z = THREE.MathUtils.damp(tg.z, g.target[2], lam, dt)
    controls.update()
    const done = p.distanceTo(new THREE.Vector3(...g.pos)) < 0.05 && tg.distanceTo(new THREE.Vector3(...g.target)) < 0.05
    if (done || t.current > 6) active.current = null
  })
  return null
}
