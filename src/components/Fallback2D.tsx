import { motion } from 'framer-motion'
import { hotels, hotelById } from '../data/hotels'
import { lessonById } from '../data/lessons'
import { useStore } from '../utils/store'
import { man, pct } from '../utils/calc'

const STYLE_ICON = { classic: '🏛️', resort: '🏝️', palace: '🏰', business: '🏢', smart: '🛰️' }

/** 모바일·저사양·WebGL 미지원 환경용 2D 대체 화면 — 3D와 동일한 데이터·동작을 제공 */
export function Fallback2D() {
  const screen = useStore((s) => s.screen)
  const hotelId = useStore((s) => s.hotelId)
  const focusHotel = useStore((s) => s.focusHotel)
  const enterHotel = useStore((s) => s.enterHotel)
  const exitHotel = useStore((s) => s.exitHotel)
  const openDept = useStore((s) => s.openDept)
  const hotel = hotelById(hotelId ?? '')

  return (
    <div className="absolute inset-0 overflow-y-auto bg-gradient-to-b from-[#050a1c] via-[#0a1530] to-[#0f1f45] px-3 pb-24 pt-20 scroll-thin md:px-8">
      <div className="mx-auto max-w-5xl">
        {screen === 'world' || !hotel ? (
          <>
            <h1 className="text-2xl font-extrabold text-white md:text-3xl">가상 호텔 선택</h1>
            <p className="mb-4 text-sm text-slate-300">2D 간편 모드입니다. 호텔을 선택하고 로비로 입장해 부서별 AI 교육을 시작하세요.</p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {hotels.map((h, i) => (
                <motion.button key={h.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} onClick={() => { focusHotel(h.id); enterHotel(true) }} className="glass group rounded-2xl p-4 text-left transition hover:-translate-y-0.5" style={{ borderColor: h.theme.primary + '77' }}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl text-3xl" style={{ background: `linear-gradient(135deg, ${h.theme.primary}55, transparent)` }}>{STYLE_ICON[h.style]}</span>
                    <div>
                      <div className="text-[11px] font-bold tracking-widest" style={{ color: h.theme.primary }}>{h.facts.grade}</div>
                      <div className="text-[17px] font-extrabold text-white">{h.name}</div>
                    </div>
                  </div>
                  <p className="mt-2 text-[13px] text-slate-300">{h.tagline}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">{h.focus.map((f) => <span key={f} className="rounded-full border border-white/20 px-2 py-0.5 text-[11.5px] text-slate-200">{f}</span>)}</div>
                  <div className="mt-3 text-[12px] text-slate-400">객실 {h.facts.rooms}실 · OCC {pct(h.facts.occ, 0)} · ADR {man(h.facts.adr)}</div>
                  <div className="mt-2 text-sm font-bold text-gold group-hover:underline">로비로 입장 ▶</div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            <button className="btn mb-3" onClick={() => exitHotel(true)}>← 호텔 목록</button>
            <div className="glass rounded-2xl p-4" style={{ borderColor: hotel.theme.primary + '88' }}>
              <div className="text-[11px] font-bold tracking-widest" style={{ color: hotel.theme.primary }}>LOBBY</div>
              <h1 className="text-2xl font-extrabold text-white">{hotel.name}</h1>
              <p className="text-sm text-slate-300">{hotel.tagline}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[['객실', `${hotel.facts.rooms}실`], ['OCC', pct(hotel.facts.occ, 0)], ['ADR', man(hotel.facts.adr)]].map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-white/5 p-2"><div className="text-[11px] text-slate-400">{k}</div><div className="font-bold text-gold">{v}</div></div>
                ))}
              </div>
            </div>
            <h2 className="mb-2 mt-5 text-lg font-bold text-white">부서 선택 → AI 교육</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {hotel.departments.map((d, i) => {
                const l = lessonById(d.lessonId)
                return (
                  <motion.button key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => openDept(d.id)} className="glass rounded-2xl p-4 text-left transition hover:border-gold">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-2xl">{l?.icon}</span>
                      <div>
                        <div className="text-[16px] font-extrabold text-white">{d.name}</div>
                        <div className="text-[12px] text-cyan-200">{d.en} · L{String(l?.no).padStart(2, '0')} {l?.title}</div>
                      </div>
                    </div>
                    <p className="mt-2 text-[13px] text-slate-300">{d.blurb}</p>
                    <div className="mt-2 text-sm font-bold text-gold">학습 시작 ▶</div>
                  </motion.button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
