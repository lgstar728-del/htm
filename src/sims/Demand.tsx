import { useMemo, useState } from 'react'
import { eventOptions, occupancyHistory } from '../data/simulations'
import { hotelById, hotels } from '../data/hotels'
import { useStore } from '../utils/store'
import { forecastOccupancy, pct, won } from '../utils/calc'
import { ApprovalGate, Card, Field, Pill, Thinking, useRun } from './shared'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

function Chart({ history, forecast }: { history: number[]; forecast: number[] }) {
  const W = 560
  const H = 200
  const pad = 28
  const all = [...history, ...forecast]
  const n = all.length
  const x = (i: number) => pad + (i / (n - 1)) * (W - pad * 2)
  const y = (v: number) => H - pad - ((v - 0.5) / 0.5) * (H - pad * 2)
  const hist = history.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const fc = [history[history.length - 1], ...forecast].map((v, i) => `${i ? 'L' : 'M'}${x(history.length - 1 + i)},${y(v)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl bg-navy/60" role="img" aria-label="점유율 이력과 7일 예측 차트">
      {[0.6, 0.7, 0.8, 0.9, 1].map((g) => (
        <g key={g}>
          <line x1={pad} x2={W - pad} y1={y(g)} y2={y(g)} stroke="#ffffff22" />
          <text x={4} y={y(g) + 4} fontSize="10" fill="#94a3b8">{Math.round(g * 100)}%</text>
        </g>
      ))}
      <path d={hist} fill="none" stroke="#38bdf8" strokeWidth="2.5" />
      <path d={fc} fill="none" stroke="#d4af37" strokeWidth="2.5" strokeDasharray="6 4" />
      {forecast.map((v, i) => (
        <rect key={i} x={x(history.length + i) - 9} y={y(v)} width="18" height={H - pad - y(v)} fill="#d4af3755" stroke="#d4af37" />
      ))}
      <line x1={x(history.length - 0.5)} x2={x(history.length - 0.5)} y1={pad / 2} y2={H - pad} stroke="#22d3ee" strokeDasharray="3 3" />
      <text x={x(history.length - 0.5) + 6} y={pad} fontSize="11" fill="#22d3ee">예측 구간 →</text>
      <text x={pad} y={H - 6} fontSize="10" fill="#94a3b8">최근 14일(실적)</text>
    </svg>
  )
}

export default function Demand() {
  const hotelId = useStore((s) => s.hotelId)
  const hotel = hotelById(hotelId ?? '') ?? hotels[1]
  const [hist, setHist] = useState(occupancyHistory.map((v) => Math.round(v * 100)))
  const [events, setEvents] = useState<string[]>(['none', 'none', 'none', 'none', 'concert', 'concert', 'none'])
  const { phase, run, reset } = useRun()
  const uplifts = events.map((e) => eventOptions.find((o) => o.id === e)?.uplift ?? 0)
  const { forecast, mape } = useMemo(() => forecastOccupancy(hist.map((v) => v / 100), uplifts), [hist, events])
  const baseline = useMemo(() => forecastOccupancy(hist.map((v) => v / 100), [0, 0, 0, 0, 0, 0, 0]).forecast, [hist])
  const summary = forecast.map((f, i) => `${DAYS[i]}요일(D+${i + 1}) 예측 OCC ${pct(f, 0)} · 판매가능 ${hotel.facts.rooms}실 중 약 ${Math.round(f * hotel.facts.rooms)}실 판매 → ${f >= 0.9 ? '요금 +8~10% 인상 검토' : f < 0.7 ? '패키지·프로모션으로 수요 방어' : '현행 요금 유지'}`).join('\n')

  return (
    <div className="space-y-3">
      <Card title={`${hotel.name} · 객실 ${hotel.facts.rooms}실 (가상 데이터)`}>최근 14일 점유율(%)을 수정하고, 향후 7일의 이벤트를 지정하면 AI가 수요를 예측합니다.</Card>
      <details className="rounded-xl border border-white/12 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-cyan-200">최근 14일 점유율 데이터 편집</summary>
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {hist.map((v, i) => (
            <input key={i} type="number" min={30} max={100} className="field !px-1 !py-1 text-center text-[13px]" value={v} onChange={(e) => { const c = [...hist]; c[i] = Math.min(100, Math.max(30, Number(e.target.value) || 0)); setHist(c); reset() }} aria-label={`D-${14 - i} 점유율`} />
          ))}
        </div>
      </details>
      <Field label="향후 7일 이벤트">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {events.map((e, i) => (
            <label key={i} className="text-[12px] text-slate-300">
              D+{i + 1} ({DAYS[i]})
              <select className="field !py-1.5" value={e} onChange={(ev) => { const c = [...events]; c[i] = ev.target.value; setEvents(c); reset() }}>
                {eventOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </label>
          ))}
        </div>
      </Field>
      <button className="btn btn-gold" onClick={() => run()} disabled={phase === 'thinking'}>▶ 7일 수요 예측 실행 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="이동평균 + 요일 계절성 + 이벤트 가중 계산 중…" />}
      {phase === 'done' && (
        <>
          <Chart history={hist.map((v) => v / 100)} forecast={forecast} />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-slate-300"><th className="p-1.5">일자</th><th>이벤트</th><th>이벤트 전</th><th>이벤트 반영</th><th>예상 판매</th><th>권고</th></tr></thead>
              <tbody>
                {forecast.map((f, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="p-1.5">D+{i + 1} ({DAYS[i]})</td>
                    <td>{eventOptions.find((o) => o.id === events[i])?.label.split(' (')[0]}</td>
                    <td>{pct(baseline[i], 0)}</td>
                    <td className="font-bold text-gold">{pct(f, 0)}</td>
                    <td>{Math.round(f * hotel.facts.rooms)}실 ({won((f * hotel.facts.rooms * hotel.facts.adr) / 10000)}만)</td>
                    <td>{f >= 0.9 ? <Pill tone="gold">요금 인상 검토</Pill> : f < 0.7 ? <Pill tone="red">프로모션</Pill> : <Pill tone="green">유지</Pill>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Card tone="cyan" title="모델 신뢰도(백테스트)">최근 7일을 직전 7일 기준으로 되짚은 평균 오차(MAPE)는 {(mape * 100).toFixed(1)}% 입니다. 이벤트 가중치는 가정값이므로 실제 판매 추세를 보며 수정해야 합니다.</Card>
          <ApprovalGate simId="demand" title={`${hotel.shortName} 7일 수요예측 승인`} text={summary} checks={['예측 근거(이동평균·계절성·이벤트)를 이해했다', '이벤트 가중치가 현실과 맞는지 확인했다', '요금 변경은 RM 팀장 최종 승인 후 반영한다']} onReject={reset} />
        </>
      )}
    </div>
  )
}
