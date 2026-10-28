import { AnimatePresence, motion } from 'framer-motion'
import { hotels, hotelById, topicShort } from '../data/hotels'
import { lessonById } from '../data/lessons'
import { useStore } from '../utils/store'
import { man, pct } from '../utils/calc'

/** 3D 화면 위에 올라가는 HUD — 호텔 선택, 호텔 정보, 부서 바로가기 */
export function HotelSelector() {
  const screen = useStore((s) => s.screen)
  const hotelId = useStore((s) => s.hotelId)
  const hovered = useStore((s) => s.hoveredHotel)
  const lessonId = useStore((s) => s.lessonId)
  const focusHotel = useStore((s) => s.focusHotel)
  const enterHotel = useStore((s) => s.enterHotel)
  const exitHotel = useStore((s) => s.exitHotel)
  const openDept = useStore((s) => s.openDept)
  const flyTo = useStore((s) => s.flyTo)
  const mode3d = useStore((s) => s.mode3d)
  const hotel = hotelById(hotelId ?? '')
  const hint = hotelById(hovered ?? '')

  if (screen === 'interior' && hotel) {
    return (
      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 p-3 md:inset-y-0 md:left-0 md:right-auto md:flex md:w-[340px] md:items-end md:p-5 ${lessonId ? 'hidden md:flex' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass pointer-events-auto w-full rounded-2xl p-3.5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-cyan-300">🎓 {hotel.topic}</div>
              <div className="text-base font-extrabold text-white">{hotel.name}</div>
            </div>
            <button className="btn !min-h-9 !px-3" onClick={() => exitHotel()}>← 외관</button>
          </div>
          <p className="mt-1 text-[12px] text-slate-300">3D 공간의 부서 표지판을 클릭하거나 아래 목록에서 선택하세요.</p>
          <ul className="mt-2 grid gap-1.5">
            {hotel.departments.map((d) => {
              const l = lessonById(d.lessonId)
              return (
                <li key={d.id}>
                  <button onClick={() => { if (mode3d) flyTo([0, 9.5, 25], [0, 2.2, -4]); openDept(d.id) }} className="flex w-full items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-left transition hover:border-gold hover:bg-white/10">
                    <span className="text-xl">{l?.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold text-white">{d.name}{d.extraLessonIds?.length ? <span className="ml-1.5 rounded bg-gold/20 px-1.5 text-[11px] text-gold">+{d.extraLessonIds.length}강</span> : null}</span>
                      <span className="block truncate text-[11.5px] text-slate-300">{d.blurb}</span>
                    </span>
                    <span className="text-gold">▶</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 p-3 md:p-5">
      <AnimatePresence>
        {!hotel && (
          <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="glass pointer-events-auto max-w-xl rounded-2xl px-4 py-3 text-center">
            <div className="text-[11px] font-bold tracking-[0.25em] text-cyan-300">HOTEL AI TRANSFORMATION</div>
            <div className="mt-0.5 text-lg font-extrabold text-white md:text-xl">가상 호텔을 선택해 AI 교육을 시작하세요</div>
            <p className="mt-1 text-[12.5px] text-slate-300">{mode3d ? '드래그: 회전 · 휠/핀치: 확대·축소 · 호텔 이름표나 건물을 클릭하면 카메라가 이동합니다.' : '2D 간편 모드입니다. 호텔을 선택하세요.'}</p>
            {hint && <p className="mt-1 text-[12.5px] font-semibold text-gold">{hint.name} — {hint.focus.join(' · ')}</p>}
          </motion.div>
        )}
        {hotel && (
          <motion.div key={hotel.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="glass pointer-events-auto w-full max-w-2xl rounded-2xl p-3.5" style={{ borderColor: hotel.theme.primary + '88' }}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold tracking-widest" style={{ color: hotel.theme.primary }}>🎓 {hotel.topic}</div>
                <div className="text-lg font-extrabold text-white md:text-xl">{hotel.name}</div>
                <p className="text-[12.5px] text-slate-300">{hotel.tagline}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">{hotel.focus.map((f) => <span key={f} className="rounded-full border px-2 py-0.5 text-[11.5px] font-semibold" style={{ borderColor: hotel.theme.primary + '88', color: hotel.theme.accent }}>{f}</span>)}</div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <div className="text-right text-[12px] text-slate-300">객실 {hotel.facts.rooms}실 · OCC {pct(hotel.facts.occ, 0)} · ADR {man(hotel.facts.adr)}</div>
                <button className="btn btn-gold pulse-ring" onClick={() => enterHotel(!mode3d)}>🚪 로비로 입장</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="pointer-events-auto flex max-w-full gap-1.5 overflow-x-auto rounded-2xl p-1 scroll-thin" role="tablist" aria-label="가상 호텔 선택">
        <button className={`btn shrink-0 ${!hotel ? 'btn-cyan' : ''}`} onClick={() => focusHotel(null)}>🌐 전체</button>
        {hotels.map((h) => (
          <button key={h.id} role="tab" aria-selected={hotelId === h.id} className={`btn shrink-0 ${hotelId === h.id ? 'btn-gold' : 'glass'}`} onClick={() => focusHotel(h.id)} style={hotelId === h.id ? undefined : { borderColor: h.theme.primary + '66' }}>
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: h.theme.primary }} />{h.shortName}<span className="hidden text-[11px] font-medium opacity-80 sm:inline">· {topicShort(h)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
