import * as THREE from 'three'

// 외부 이미지·폰트 없이 캔버스로 텍스처를 생성합니다 (오프라인·저대역폭 환경에서도 동작)
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

interface WinOpts {
  cols: number
  rows: number
  lit: string
  dark: string
  frame: string
  seed: number
  litRatio?: number
}

const cache = new Map<string, THREE.CanvasTexture>()

export function windowTexture(o: WinOpts): THREE.CanvasTexture {
  const key = JSON.stringify(o)
  const hit = cache.get(key)
  if (hit) return hit
  const cw = 28
  const ch = 36
  const c = document.createElement('canvas')
  c.width = Math.max(1, o.cols) * cw
  c.height = Math.max(1, o.rows) * ch
  const g = c.getContext('2d')!
  g.fillStyle = o.frame
  g.fillRect(0, 0, c.width, c.height)
  const r = rng(o.seed)
  for (let y = 0; y < o.rows; y++) {
    for (let x = 0; x < o.cols; x++) {
      const lit = r() < (o.litRatio ?? 0.6)
      g.fillStyle = lit ? o.lit : o.dark
      g.globalAlpha = lit ? 0.75 + r() * 0.25 : 1
      g.fillRect(x * cw + 4, y * ch + 5, cw - 8, ch - 10)
    }
  }
  g.globalAlpha = 1
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  t.needsUpdate = true
  cache.set(key, t)
  return t
}

export function labelTexture(text: string, color: string, sub?: string): THREE.CanvasTexture {
  const key = `label:${text}:${color}:${sub}`
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = sub ? 280 : 200
  const g = c.getContext('2d')!
  g.clearRect(0, 0, c.width, c.height)
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  g.shadowColor = color
  g.shadowBlur = 24
  g.fillStyle = color
  g.font = '700 92px "Pretendard", "Segoe UI", sans-serif'
  g.fillText(text, c.width / 2, sub ? 100 : c.height / 2)
  if (sub) {
    g.shadowBlur = 8
    g.font = '500 44px "Pretendard", "Segoe UI", sans-serif'
    g.fillStyle = 'rgba(255,255,255,0.85)'
    g.fillText(sub, c.width / 2, 200)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  cache.set(key, t)
  return t
}

export function glowTexture(color: string): THREE.CanvasTexture {
  const key = `glow:${color}`
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, color)
  grad.addColorStop(0.4, color + '66')
  grad.addColorStop(1, color + '00')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c)
  cache.set(key, t)
  return t
}

export function floorTexture(a: string, b: string, line: string): THREE.CanvasTexture {
  const key = `floor:${a}${b}${line}`
  const hit = cache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  const n = 8
  const s = 512 / n
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      g.fillStyle = (x + y) % 2 ? a : b
      g.fillRect(x * s, y * s, s, s)
    }
  g.strokeStyle = line
  g.lineWidth = 3
  g.strokeRect(0, 0, 512, 512)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(8, 6)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  t.needsUpdate = true
  cache.set(key, t)
  return t
}
