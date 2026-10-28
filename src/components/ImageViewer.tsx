import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { infographics } from '../data/infographics'
import { useStore } from '../utils/store'

interface View {
  s: number
  x: number
  y: number
}

/** 원본 인포그래픽 뷰어 — 휠/핀치 확대·축소, 드래그 이동, 더블클릭, 전체 화면 */
export function ImageViewer() {
  const id = useStore((s) => s.viewerId)
  const open = useStore((s) => s.openViewer)
  const info = infographics.find((i) => i.id === id)
  return (
    <AnimatePresence>
      {info && (
        <motion.div key="viewer" className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Viewer key={info.id} infoId={info.id} onClose={() => open(null)} onSwitch={(i) => open(i)} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Viewer({ infoId, onClose, onSwitch }: { infoId: string; onClose: () => void; onSwitch: (id: string) => void }) {
  const info = infographics.find((i) => i.id === infoId)!
  const box = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>({ s: 1, x: 0, y: 0 })
  const [fit, setFit] = useState(1)
  const [full, setFull] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ptrs = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ d: number; s: number } | null>(null)
  const idx = infographics.findIndex((i) => i.id === infoId)

  const computeFit = useCallback(() => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return 1
    return Math.min((r.width - 24) / info.width, (r.height - 24) / info.height, 1.4)
  }, [info.width, info.height])

  const reset = useCallback(() => {
    const f = computeFit()
    setFit(f)
    setView({ s: f, x: 0, y: 0 })
  }, [computeFit])

  useEffect(() => {
    reset()
    const ro = new ResizeObserver(reset)
    if (box.current) ro.observe(box.current)
    return () => ro.disconnect()
  }, [reset])

  const zoomAt = useCallback((factor: number, cx = 0, cy = 0) => {
    setView((v) => {
      const s2 = Math.min(8, Math.max(0.2, v.s * factor))
      const k = s2 / v.s
      return { s: s2, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k }
    })
  }, [])

  const rel = (e: { clientX: number; clientY: number }) => {
    const r = box.current!.getBoundingClientRect()
    return { x: e.clientX - r.left - r.width / 2, y: e.clientY - r.top - r.height / 2 }
  }

  // wheel 은 passive:false 로 직접 등록해야 페이지 스크롤을 막을 수 있음
  useEffect(() => {
    const el = box.current
    if (!el) return
    const h = (e: WheelEvent) => {
      e.preventDefault()
      const p = rel(e)
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, p.x, p.y)
    }
    el.addEventListener('wheel', h, { passive: false })
    return () => el.removeEventListener('wheel', h)
  }, [zoomAt])

  useEffect(() => {
    const onFs = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) onClose()
      else if (e.key === '+' || e.key === '=') zoomAt(1.25)
      else if (e.key === '-') zoomAt(1 / 1.25)
      else if (e.key === '0') reset()
      else if (e.key === 'f' || e.key === 'F') toggleFull()
      else if (e.key === 'ArrowRight') onSwitch(infographics[(idx + 1) % infographics.length].id)
      else if (e.key === 'ArrowLeft') onSwitch(infographics[(idx - 1 + infographics.length) % infographics.length].id)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, reset, zoomAt])

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void wrap.current?.requestFullscreen?.().catch(() => undefined)
  }

  const onDown = (e: React.PointerEvent) => {
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()]
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), s: view.s }
    }
  }
  const onMove = (e: React.PointerEvent) => {
    const prev = ptrs.current.get(e.pointerId)
    if (!prev) return
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (ptrs.current.size === 2 && pinch.current) {
      const [a, b] = [...ptrs.current.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      const target = pinch.current.s * (d / pinch.current.d)
      const mid = rel({ clientX: (a.x + b.x) / 2, clientY: (a.y + b.y) / 2 })
      zoomAt(target / view.s, mid.x, mid.y)
    } else if (ptrs.current.size === 1) {
      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }))
    }
  }
  const onUp = (e: React.PointerEvent) => {
    ptrs.current.delete(e.pointerId)
    if (ptrs.current.size < 2) pinch.current = null
  }

  const pctText = `${Math.round((view.s / fit) * 100)}%`

  return (
    <div ref={wrap} className="flex h-full w-full flex-col bg-[#030714]/95 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-3 py-2 md:px-5">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-bold text-gold md:text-base">{info.title}</div>
          <div className="hidden truncate text-xs text-slate-300 md:block">{info.caption}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="btn" onClick={() => zoomAt(1 / 1.25)} aria-label="축소" title="축소 (-)">−</button>
          <span className="w-14 text-center text-sm tabular-nums text-cyan-200">{pctText}</span>
          <button className="btn" onClick={() => zoomAt(1.25)} aria-label="확대" title="확대 (+)">＋</button>
          <button className="btn hidden sm:inline-flex" onClick={reset} title="화면에 맞춤 (0)">맞춤</button>
          <button className="btn hidden sm:inline-flex" onClick={() => setView({ s: 1, x: 0, y: 0 })} title="원본 크기">100%</button>
          <button className="btn" onClick={toggleFull} title="전체 화면 (F)">{full ? '⤡' : '⛶'}<span className="hidden sm:inline">{full ? ' 종료' : ' 전체화면'}</span></button>
          <a className="btn hidden md:inline-flex" href={info.src} download title="원본 다운로드">⬇</a>
          <button className="btn btn-gold" onClick={onClose} aria-label="닫기">✕</button>
        </div>
      </div>
      <div
        ref={box}
        className="relative flex-1 touch-none select-none overflow-hidden"
        style={{ cursor: 'grab' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onDoubleClick={(e) => {
          const p = rel(e)
          if (view.s > fit * 1.3) reset()
          else zoomAt(2.5, p.x, p.y)
        }}
      >
        {!loaded && <div className="absolute inset-0 grid place-items-center text-slate-300">원본 이미지를 불러오는 중…</div>}
        <img
          src={info.src}
          alt={info.title}
          width={info.width}
          height={info.height}
          draggable={false}
          onLoad={() => setLoaded(true)}
          className="pointer-events-none absolute left-1/2 top-1/2 max-w-none rounded-lg shadow-2xl"
          style={{ width: info.width, height: info.height, transform: `translate(-50%, -50%) translate(${view.x}px, ${view.y}px) scale(${view.s})`, transformOrigin: 'center center', willChange: 'transform' }}
        />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-2 text-xs text-slate-300 md:px-5">
        <div className="hidden md:block">휠/핀치: 확대·축소 · 드래그: 이동 · 더블클릭: 확대/맞춤 · ←→: 다른 인포그래픽 · F: 전체화면</div>
        <div className="flex flex-1 justify-end gap-1.5 md:flex-none">
          {infographics.map((i) => (
            <button key={i.id} onClick={() => onSwitch(i.id)} className={`rounded-lg border px-2.5 py-1.5 ${i.id === infoId ? 'border-gold bg-gold/20 text-gold' : 'border-white/15 hover:border-white/40'}`}>
              {i.short}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
