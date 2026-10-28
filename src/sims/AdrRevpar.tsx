import { useMemo, useState } from 'react'
import { hotelById, hotels } from '../data/hotels'
import { useStore } from '../utils/store'
import { pct, priceScenario, roomMetrics, won } from '../utils/calc'
import { ApprovalGate, Card, Field, Pill } from './shared'

function Num({ label, value, set, step = 1, hint }: { label: string; value: number; set: (n: number) => void; step?: number; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input type="number" className="field" value={value} step={step} min={0} onChange={(e) => set(Math.max(0, Number(e.target.value) || 0))} />
    </Field>
  )
}

export default function AdrRevpar() {
  const hotelId = useStore((s) => s.hotelId)
  const hotel = hotelById(hotelId ?? '') ?? hotels[3]
  const [avail, setAvail] = useState(hotel.facts.rooms)
  const [sold, setSold] = useState(Math.round(hotel.facts.rooms * hotel.facts.occ))
  const [rev, setRev] = useState(Math.round(hotel.facts.rooms * hotel.facts.occ) * hotel.facts.adr)
  const [price, setPrice] = useState(5)
  const [elastic, setElastic] = useState(1.2)

  const m = roomMetrics(avail, sold, rev)
  const sc = priceScenario({ roomsAvail: avail, roomsSold: sold, adr: m.adr }, price, elastic)
  const curve = useMemo(() => Array.from({ length: 41 }, (_, i) => i - 20).map((p) => ({ p, ...priceScenario({ roomsAvail: avail, roomsSold: sold, adr: m.adr }, p, elastic) })), [avail, sold, m.adr, elastic])
  const best = curve.reduce((a, b) => (b.revpar > a.revpar ? b : a))
  const W = 540
  const H = 180
  const pad = 30
  const vals = curve.map((c) => c.revpar)
  const lo = Math.min(...vals) * 0.98
  const hi = Math.max(...vals) * 1.02
  const x = (p: number) => pad + ((p + 20) / 40) * (W - pad * 2)
  const y = (v: number) => H - pad - ((v - lo) / (hi - lo || 1)) * (H - pad * 2)
  const path = curve.map((c, i) => `${i ? 'L' : 'M'}${x(c.p)},${y(c.revpar)}`).join(' ')
  const diff = sc.revpar - m.revpar

  const summary = `[${hotel.name}] 객실 지표 요약\n- 판매 가능 ${avail}실 / 판매 ${sold}실 / 객실 매출 ${won(rev)}\n- OCC ${pct(m.occ)} · ADR ${won(m.adr)} · RevPAR ${won(m.revpar)}\n\n[요금 시나리오] 요금 ${price >= 0 ? '+' : ''}${price}% (탄력성 ${elastic})\n- 예상 판매 ${sc.sold}실 (OCC ${pct(sc.occ)}), ADR ${won(sc.adr)}, RevPAR ${won(sc.revpar)} (${diff >= 0 ? '+' : ''}${won(diff)})\n- 가정상 RevPAR 최대 지점: 요금 ${best.p >= 0 ? '+' : ''}${best.p}% (${won(best.revpar)})\n\n※ 탄력성은 가정값입니다. 시장 상황·경쟁사 요금 확인 후 RM 팀장이 최종 결정합니다.`

  return (
    <div className="space-y-3">
      <Card title="공식">OCC = 판매 객실 ÷ 판매 가능 객실 · ADR = 객실 매출 ÷ 판매 객실 · <b className="text-gold">RevPAR = ADR × OCC</b> = 객실 매출 ÷ 판매 가능 객실</Card>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Num label="판매 가능 객실(실)" value={avail} set={(n) => { setAvail(n); setSold((s) => Math.min(s, n)) }} />
        <Num label="판매 객실(실)" value={sold} set={(n) => setSold(Math.min(n, avail))} />
        <Num label="객실 매출(원)" value={rev} set={setRev} step={100000} />
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        {[['OCC 점유율', pct(m.occ)], ['ADR 평균요금', won(m.adr)], ['RevPAR', won(m.revpar)]].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-gold/40 bg-gold/10 p-3">
            <div className="text-[12px] text-slate-300">{k}</div>
            <div className="text-lg font-extrabold text-gold md:text-xl">{v}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={`요금 변경: ${price >= 0 ? '+' : ''}${price}%`}>
          <input type="range" min={-20} max={20} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full accent-yellow-500" />
        </Field>
        <Field label={`수요 탄력성(가정): ${elastic.toFixed(1)}`} hint="요금이 1% 오를 때 판매 객실이 줄어드는 %">
          <input type="range" min={0.3} max={2.5} step={0.1} value={elastic} onChange={(e) => setElastic(Number(e.target.value))} className="w-full accent-cyan-400" />
        </Field>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl bg-navy/60" role="img" aria-label="요금 변경률별 RevPAR 곡선">
        <path d={path} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <line x1={x(0)} x2={x(0)} y1={pad / 2} y2={H - pad} stroke="#ffffff33" strokeDasharray="3 3" />
        <circle cx={x(best.p)} cy={y(best.revpar)} r="6" fill="#d4af37" />
        <text x={x(best.p) + 8} y={y(best.revpar) - 8} fontSize="11" fill="#d4af37">최대 RevPAR ({best.p >= 0 ? '+' : ''}{best.p}%)</text>
        <circle cx={x(price)} cy={y(sc.revpar)} r="6" fill="#22d3ee" />
        <text x={x(price) + 8} y={y(sc.revpar) + 16} fontSize="11" fill="#22d3ee">현재 선택</text>
        <text x={pad} y={H - 8} fontSize="10" fill="#94a3b8">요금 −20% … +20%</text>
      </svg>
      <Card tone="cyan" title="AI 해석(시뮬레이션)">
        요금을 {price >= 0 ? '+' : ''}{price}% 조정하면 판매 객실은 {sold}→{sc.sold}실, ADR은 {won(m.adr)}→{won(sc.adr)}, RevPAR은 <b>{diff >= 0 ? '증가' : '감소'}</b>({diff >= 0 ? '+' : ''}{won(diff)})합니다. {Math.abs(price) > 12 && <Pill tone="red">변동폭 큼 — 경쟁사·이벤트 확인 필수</Pill>}
      </Card>
      <ApprovalGate simId="adr-revpar" title={`${hotel.shortName} 요금 변경안(${price >= 0 ? '+' : ''}${price}%) 승인`} text={summary} checks={['공식과 입력 수치를 확인했다', '탄력성 가정이 현실과 크게 다르지 않다', '경쟁사 요금·이벤트 일정을 함께 검토했다']} />
    </div>
  )
}
