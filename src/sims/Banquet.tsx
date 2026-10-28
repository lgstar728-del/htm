import { useMemo, useState } from 'react'
import { banquetTypes } from '../data/simulations'
import { man, won } from '../utils/calc'
import { ApprovalGate, Card, Field, Pill, Thinking, useRun } from './shared'

const TIERS = [
  { id: 'std', label: '스탠다드', mult: 0.8 },
  { id: 'pre', label: '프리미엄', mult: 1 },
  { id: 'lux', label: '럭셔리', mult: 1.25 },
]

interface Plan {
  tier: string
  decoration: boolean
  items: { name: string; amount: number }[]
  subtotal: number
  service: number
  vat: number
  total: number
  perHead: number
}

function plan(typeId: string, guests: number, tierId: string, decoration: boolean): Plan {
  const t = banquetTypes.find((b) => b.id === typeId)!
  const tier = TIERS.find((x) => x.id === tierId)!
  const items = [
    { name: `메뉴(${tier.label}) ${won(t.perHead * tier.mult)} × ${guests}명`, amount: Math.round(t.perHead * tier.mult) * guests },
    { name: `음료 무제한 ${won(25000)} × ${guests}명`, amount: 25000 * guests },
    { name: '연회장 대관', amount: 1500000 + (guests > 100 ? 800000 : 0) },
    { name: '음향·영상(AV) 장비', amount: 600000 },
    ...(decoration ? [{ name: '플라워·장식', amount: 900000 }] : []),
  ]
  const subtotal = items.reduce((a, b) => a + b.amount, 0)
  const service = Math.round(subtotal * 0.1)
  const vat = Math.round((subtotal + service) * 0.1)
  const total = subtotal + service + vat
  return { tier: tier.label, decoration, items, subtotal, service, vat, total, perHead: Math.round(total / guests) }
}

interface Check { name: string; pass: boolean; detail: string }
function check(p: Plan, budget: number, hasUnknown: boolean): Check[] {
  return [
    { name: '총 견적이 예산 이내', pass: p.total <= budget, detail: `${man(p.total)} / 예산 ${man(budget)}` },
    { name: '1인당 단가 8~25만원 범위', pass: p.perHead >= 80000 && p.perHead <= 250000, detail: `${won(p.perHead)}` },
    { name: '필수 섹션(일정·메뉴·장비·견적) 포함', pass: true, detail: '4개 섹션 모두 포함' },
    { name: '미확인 정보는 "확인 필요" 표시', pass: hasUnknown, detail: hasUnknown ? '표시됨' : '미표시' },
  ]
}

/** 루프 엔지니어링: 기준 미달이면 수정안(등급 하향 → 장식 제외 → …)을 만들어 재점검. 최대 3회 */
function runLoop(typeId: string, guests: number, budget: number, startTier: string) {
  const log: { n: number; plan: Plan; checks: Check[]; action: string }[] = []
  let tier = startTier
  let deco = true
  let action = '초안 작성'
  for (let n = 1; n <= 3; n++) {
    const p = plan(typeId, guests, tier, deco)
    const c = check(p, budget, true)
    log.push({ n, plan: p, checks: c, action })
    if (c.every((x) => x.pass)) return { log, passed: true }
    if (!c[0].pass) {
      if (deco) {
        deco = false
        action = '예산 초과 → 플라워·장식 제외'
      } else if (tier !== 'std') {
        tier = tier === 'lux' ? 'pre' : 'std'
        action = `예산 초과 → 메뉴 등급을 ${TIERS.find((x) => x.id === tier)!.label}로 조정`
      } else action = '조정 여지 없음 → 사람 검토 필요'
    } else action = '단가 범위 이탈 → 구성 재검토'
  }
  return { log, passed: false }
}

export default function Banquet() {
  const [type, setType] = useState('corp')
  const [guests, setGuests] = useState(120)
  const [budget, setBudget] = useState(2600)
  const [tier, setTier] = useState('lux')
  const { phase, run, reset } = useRun()
  const res = useMemo(() => runLoop(type, guests, budget * 10000, tier), [type, guests, budget, tier])
  const final = res.log[res.log.length - 1]
  const t = banquetTypes.find((b) => b.id === type)!
  const doc = `[연회 제안서 — ${t.label}] (AI 초안 · 사람 승인 필요)\n\n1. 개요\n- 행사: ${t.label} / 인원 ${guests}명 / 예산 ${budget}만원\n\n2. 일정(안)\n- 17:30 입장·리셉션\n- 18:30 개회·환영사\n- 19:00 디너\n- 20:30 프로그램(시상·공연)\n- 21:30 폐회\n\n3. 메뉴\n- ${final.plan.tier} 코스 (알레르기·채식 옵션: 사전 확인 필요)\n\n4. 장비\n- 음향·영상(AV) 장비, ${final.plan.decoration ? '플라워·장식 포함' : '장식 제외'}\n\n5. 견적\n${final.plan.items.map((i) => `- ${i.name}: ${won(i.amount)}`).join('\n')}\n- 봉사료 10%: ${won(final.plan.service)}\n- 부가세 10%: ${won(final.plan.vat)}\n= 합계 ${won(final.plan.total)} (1인당 ${won(final.plan.perHead)})\n\n※ 대관 가능일·메뉴 단가·계약 조건은 확인 필요. 계약은 영업 담당 승인 후 진행.\n※ 루프 점검 결과: ${res.passed ? `${res.log.length}회 만에 기준 충족` : '3회 반복 후에도 미충족 → 사람 검토 필요'}`

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Field label="행사 유형"><select className="field" value={type} onChange={(e) => { setType(e.target.value); reset() }}>{banquetTypes.map((b) => <option key={b.id} value={b.id}>{b.label}</option>)}</select></Field>
        <Field label="인원(명)"><input type="number" className="field" min={10} max={500} value={guests} onChange={(e) => { setGuests(Math.max(10, Number(e.target.value) || 10)); reset() }} /></Field>
        <Field label="총 예산(만원)"><input type="number" className="field" min={100} step={50} value={budget} onChange={(e) => { setBudget(Math.max(100, Number(e.target.value) || 100)); reset() }} /></Field>
        <Field label="희망 메뉴 등급"><select className="field" value={tier} onChange={(e) => { setTier(e.target.value); reset() }}>{TIERS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select></Field>
      </div>
      <button className="btn btn-gold" onClick={() => run(900)} disabled={phase === 'thinking'}>▶ 제안서 작성 + 루프 점검 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="초안 작성 → 검사기준 점검 → 미달 시 수정·재시도…" />}
      {phase === 'done' && (
        <>
          <Card title="🔁 루프 점검 로그 — 실행 → 결과 확인 → 기준 충족? → (예) 완료 / (아니오) 수정 후 재시도">
            <div className="space-y-2">
              {res.log.map((l) => (
                <div key={l.n} className="rounded-lg border border-white/12 p-2">
                  <div className="flex flex-wrap items-center gap-2 text-[13px]">
                    <Pill tone="gold">{l.n}회차</Pill> <span className="text-slate-300">{l.action}</span> <span className="ml-auto font-bold">{man(l.plan.total)}</span>
                  </div>
                  <div className="mt-1.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {l.checks.map((c) => (
                      <div key={c.name} className={`rounded px-2 py-1 text-[12.5px] ${c.pass ? 'bg-emerald-400/10 text-emerald-200' : 'bg-rose-400/15 text-rose-200'}`}>
                        {c.pass ? '✅ PASS' : '❌ FAIL'} · {c.name} <span className="opacity-70">({c.detail})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2">{res.passed ? <Pill tone="green">종료 조건 충족: {res.log.length}회 만에 통과</Pill> : <Pill tone="red">최대 반복(3회) 도달 — 사람 검토 필요</Pill>}</div>
          </Card>
          <ApprovalGate simId="banquet" title={`연회 제안서 승인: ${t.label} ${guests}명`} text={doc} checks={['견적 항목·금액이 최신 단가표와 일치한다', '대관 가능일과 알레르기/식이 옵션을 확인했다', '계약·결제 조건은 영업 담당자가 별도 확정한다']} onReject={reset} />
        </>
      )}
    </div>
  )
}
