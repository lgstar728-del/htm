import { useMemo, useState } from 'react'
import { housekeepingData } from '../data/simulations'
import { ApprovalGate, Card, Pill, Thinking, useRun } from './shared'

const CTX = [
  { id: 'rooms', label: '① 객실 상태 (체크아웃/연박)', why: '청소 대상을 알 수 있다' },
  { id: 'vip', label: '② VIP 도착 시간·메모', why: '우선순위를 정할 수 있다' },
  { id: 'staff', label: '③ 근무 인력·숙련도', why: '난이도에 맞게 배분할 수 있다' },
  { id: 'rules', label: '④ 청소 기준 (연박·청소 거부 정책)', why: '방문하면 안 되는 객실을 지킬 수 있다' },
] as const

interface Row { room: string; staff: string; order: number; flag?: string }

function assign(on: Record<string, boolean>): { rows: Row[]; warnings: string[]; score: number; blocked?: string } {
  if (!on.rooms) return { rows: [], warnings: [], score: 0, blocked: '객실 상태 정보가 없어 배정표를 만들 수 없습니다. → "추가 정보 필요: 오늘 청소 대상 객실 목록" (누락 정보 보완)' }
  const { rooms, staff } = housekeepingData
  const warnings: string[] = []
  let score = 100
  let targets = rooms.slice()
  if (on.rules) targets = targets.filter((r) => !(r.status === '연박' && /거부/.test(r.note)))
  else {
    const bad = targets.find((r) => /거부/.test(r.note))
    if (bad) {
      warnings.push(`객실 ${bad.no}: 고객이 청소를 거부했는데 배정됨 → 컴플레인 위험`)
      score -= 25
    }
  }
  const ordered = on.vip ? [...targets].sort((a, b) => Number(b.vip) - Number(a.vip)) : targets
  if (!on.vip) {
    const vipRooms = rooms.filter((r) => r.vip).map((r) => r.no)
    warnings.push(`VIP 객실(${vipRooms.join(', ')})의 도착 시간을 몰라 우선 배정하지 못함 → 14시 이전 완료 미보장`)
    score -= 30
  }
  const pool = on.staff ? staff : [{ name: '직원 A', skill: '?' }, { name: '직원 B', skill: '?' }]
  if (!on.staff) {
    warnings.push('인력·숙련도 정보가 없어 신입에게 VIP 객실이 배정될 수 있음')
    score -= 20
  }
  const rows: Row[] = ordered.map((r, i) => {
    let who = pool[i % pool.length]
    if (on.staff && r.vip) who = pool.find((p) => p.skill === '숙련') ?? who
    const flag = !on.staff && r.vip && i % pool.length === 1 ? '신입/미확인 직원 배정 위험' : undefined
    return { room: r.no + (r.vip ? ' ⭐VIP' : '') + (r.note ? ` (${r.note})` : ''), staff: who.name + (on.staff ? ` · ${who.skill}` : ''), order: i + 1, flag }
  })
  return { rows, warnings, score: Math.max(0, score) }
}

export default function Housekeeping() {
  const [on, setOn] = useState<Record<string, boolean>>({ rooms: true, vip: true, staff: true, rules: true })
  const { phase, run, reset } = useRun()
  const res = useMemo(() => assign(on), [on])
  const toggle = (id: string) => { setOn({ ...on, [id]: !on[id] }); reset() }
  const text = res.blocked ?? `하우스키핑 배정표 (컨텍스트 ${Object.values(on).filter(Boolean).length}/4, 품질 점수 ${res.score})\n${res.rows.map((r) => `${r.order}. ${r.room} → ${r.staff}${r.flag ? ` ⚠${r.flag}` : ''}`).join('\n')}${res.warnings.length ? '\n\n⚠ 경고\n' + res.warnings.map((w) => '- ' + w).join('\n') : ''}`
  return (
    <div className="space-y-3">
      <Card title="컨텍스트 믹서 — AI에게 줄 정보를 선택하세요 (Context Engineering)">
        <div className="grid gap-1.5 sm:grid-cols-2">
          {CTX.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-start gap-2 rounded-lg border border-white/12 px-2.5 py-2 text-[13px]">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-cyan-400" checked={on[c.id]} onChange={() => toggle(c.id)} />
              <span><b className="text-white">{c.label}</b><br /><span className="text-slate-400">{c.why}</span></span>
            </label>
          ))}
        </div>
      </Card>
      <details className="rounded-xl border border-white/12 p-3 text-[13px]">
        <summary className="cursor-pointer font-semibold text-cyan-200">오늘의 가상 데이터 보기</summary>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <ul className="list-disc pl-4 text-slate-300">{housekeepingData.rooms.map((r) => <li key={r.no}>{r.no} · {r.status}{r.vip ? ' · VIP' : ''}{r.note ? ` · ${r.note}` : ''}</li>)}</ul>
          <ul className="list-disc pl-4 text-slate-300">{housekeepingData.staff.map((s) => <li key={s.name}>{s.name} ({s.skill})</li>)}</ul>
        </div>
      </details>
      <button className="btn btn-gold" onClick={() => run(600)} disabled={phase === 'thinking'}>▶ 청소 배정표 생성 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="컨텍스트 조합 → 배정 계산…" />}
      {phase === 'done' && (
        <>
          {res.blocked ? (
            <Card tone="red" title="AI 응답">{res.blocked}</Card>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-300">결과 품질 점수</div>
                <div className="h-3 flex-1 overflow-hidden rounded bg-white/10"><div className={`h-full ${res.score >= 80 ? 'bg-emerald-400' : res.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${res.score}%` }} /></div>
                <Pill tone={res.score >= 80 ? 'green' : res.score >= 50 ? 'gold' : 'red'}>{res.score}점</Pill>
              </div>
              <div className="overflow-x-auto"><table className="w-full text-[13px]"><thead><tr className="text-left text-slate-300"><th className="p-1.5">순서</th><th>객실</th><th>담당</th><th>비고</th></tr></thead><tbody>{res.rows.map((r) => (<tr key={r.order} className="border-t border-white/10"><td className="p-1.5">{r.order}</td><td>{r.room}</td><td>{r.staff}</td><td className="text-rose-300">{r.flag}</td></tr>))}</tbody></table></div>
              {res.warnings.map((w) => <Card key={w} tone="red">⚠ {w}</Card>)}
              {!res.warnings.length && <Card tone="cyan">모든 컨텍스트가 제공되어 VIP 우선·숙련자 배치·청소 거부 객실 제외가 지켜졌습니다.</Card>}
            </>
          )}
          <ApprovalGate simId="housekeeping" title="하우스키핑 배정표 승인" text={text} checks={['VIP 객실이 도착 시간 전에 완료되도록 배정되었다', '청소 거부·방해금지 객실이 제외되었다', '인력 숙련도와 업무량이 균형 잡혀 있다']} onReject={reset} />
        </>
      )}
    </div>
  )
}
