import { useEffect, useState } from 'react'
import { hotelById } from '../data/hotels'
import { lessons } from '../data/lessons'
import { lessonCompletion, useStore } from '../utils/store'

export function Header() {
  const screen = useStore((s) => s.screen)
  const hotelId = useStore((s) => s.hotelId)
  const progress = useStore((s) => s.progress)
  const mode3d = useStore((s) => s.mode3d)
  const webgl = useStore((s) => s.webgl)
  const setMode3d = useStore((s) => s.setMode3d)
  const setGraphOpen = useStore((s) => s.setGraphOpen)
  const setDashOpen = useStore((s) => s.setDashOpen)
  const openViewer = useStore((s) => s.openViewer)
  const focusHotel = useStore((s) => s.focusHotel)
  const exitHotel = useStore((s) => s.exitHotel)
  const hotel = hotelById(hotelId ?? '')
  const [full, setFull] = useState(false)
  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])
  const overall = lessons.reduce((a, l) => a + lessonCompletion(progress[l.id]), 0) / lessons.length

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-2 p-2.5 md:p-4">
      <div className="pointer-events-auto glass flex min-w-0 items-center gap-2.5 rounded-2xl px-3 py-2">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-2 text-lg text-navy">🏨</div>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[13px] font-extrabold tracking-wide text-white md:text-[15px]">HOTEL <span className="text-gold">AI</span> TRANSFORMATION</div>
          <nav className="flex items-center gap-1 truncate text-[11px] text-slate-300" aria-label="현재 위치">
            <button className="hover:text-gold" onClick={() => { if (screen === 'interior') exitHotel(!mode3d); focusHotel(null) }}>호텔 광장</button>
            {hotel && <><span>›</span><button className="hover:text-gold" onClick={() => screen === 'interior' && exitHotel(!mode3d)}>{hotel.shortName}</button></>}
            {screen === 'interior' && <><span>›</span><span className="text-cyan-300">로비</span></>}
          </nav>
        </div>
      </div>
      <div className="pointer-events-auto flex flex-wrap justify-end gap-1.5">
        <button className="btn glass" onClick={() => setGraphOpen(true)} title="AI 교육 지식그래프">🕸️<span className="hidden lg:inline">지식그래프</span></button>
        <button className="btn glass" onClick={() => openViewer('ai-engineering')} title="원본 인포그래픽 3종">🖼️<span className="hidden lg:inline">인포그래픽</span></button>
        <button className="btn glass" onClick={() => setDashOpen(true)} title="학습 현황">📊<span className="hidden sm:inline">{Math.round(overall * 100)}%</span></button>
        {webgl && (
          <button className="btn glass" onClick={() => setMode3d(!mode3d)} title="3D / 2D 간편 모드 전환 (저사양 기기용)">{mode3d ? '2D' : '3D'}<span className="hidden lg:inline">{mode3d ? ' 간편모드' : ' 모드'}</span></button>
        )}
        <button className="btn glass hidden sm:inline-flex" onClick={toggleFull} title="전체 화면">{full ? '⤡' : '⛶'}</button>
      </div>
    </header>
  )
}
