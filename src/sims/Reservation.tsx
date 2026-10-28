import { useMemo, useState } from 'react'
import { rateTable, sampleInquiries } from '../data/simulations'
import { won } from '../utils/calc'
import { ApprovalGate, Card, Field, Pill, Thinking, useRun, useTypewriter } from './shared'

interface Result {
  reply: string
  facts: string[]
  unknown: string[]
}

export function generateReply(inquiry: string, tone: 'formal' | 'friendly'): Result {
  const q = inquiry
  const facts: string[] = []
  const unknown: string[] = []
  const lines: string[] = []
  const weekend = /토요일|일요일|주말|금요일/.test(q)
  const breakfast = /조식|아침/.test(q)
  const rate = weekend ? rateTable.deluxeWeekend : rateTable.deluxeWeekday
  const hi = tone === 'formal' ? '안녕하세요, AURORA GRAND HOTEL 예약팀입니다. 문의해 주셔서 감사합니다.' : '안녕하세요! AURORA GRAND HOTEL 예약팀이에요. 문의 주셔서 고맙습니다 :)'
  lines.push(hi)

  if (/가격|요금|얼마|디럭스|조식|객실/.test(q)) {
    const total = rate + (breakfast ? rateTable.breakfastAdd : 0)
    facts.push(`디럭스 더블 ${weekend ? '주말' : '평일'} 요금 ${won(rate)} (요금표)`)
    let s = `디럭스 더블 ${weekend ? '주말' : '평일'} 1박 요금은 ${won(rate)}입니다.`
    if (breakfast) {
      facts.push(`조식 2인 포함 시 +${won(rateTable.breakfastAdd)} (요금표)`)
      s += ` 조식(2인)을 포함하시면 ${won(total)}이며,`
    }
    if (/아이|어린이|유아/.test(q)) {
      facts.push(`엑스트라 베드 ${won(rateTable.extraBed)} (요금표)`)
      s += ` 아이 동반 시 엑스트라 베드(${won(rateTable.extraBed)})를 추가하실 수 있습니다.`
    }
    s += ' 객실 재고는 예약 시점에 확정됩니다.'
    lines.push(s)
  }
  if (/주차/.test(q)) {
    facts.push(`주차: ${rateTable.parking}`)
    lines.push(`주차는 ${rateTable.parking}입니다.`)
  }
  if (/취소|위약|환불/.test(q)) {
    facts.push(`취소: ${rateTable.cancel}`)
    lines.push(`취소 정책은 ${rateTable.cancel}입니다.`)
  }
  if (/변경/.test(q)) {
    unknown.push('날짜 변경 가능 여부(해당 일자 재고 확인 필요)')
    lines.push('날짜 변경은 해당 일자 객실 재고 확인 후 안내드리겠습니다.')
  }
  if (/체크인|늦|밤|시 /.test(q)) {
    facts.push(`체크인: ${rateTable.checkin}`)
    lines.push(`체크인은 ${rateTable.checkin}`)
  }
  if (/반려|강아지|고양이|애견|펫/.test(q)) {
    unknown.push('반려동물 동반 정책 (요금표·정책 자료에 없음)')
    lines.push('반려동물 동반 투숙은 운영 정책 확인 후 안내드리겠습니다. (정확한 정보를 위해 담당자가 확인합니다.)')
  }
  if (lines.length === 1) {
    unknown.push('문의 내용이 자료의 어떤 항목과도 일치하지 않음')
    lines.push('문의하신 내용은 담당자가 확인 후 안내드리겠습니다.')
  }
  lines.push(tone === 'formal' ? '예약 확정은 담당자 확인 후 안내됩니다. 감사합니다.' : '예약 확정은 담당자가 한 번 더 확인하고 알려드릴게요. 감사합니다!')
  return { reply: lines.join('\n\n'), facts, unknown }
}

export default function Reservation() {
  const [sel, setSel] = useState(sampleInquiries[0].id)
  const [text, setText] = useState(sampleInquiries[0].text)
  const [tone, setTone] = useState<'formal' | 'friendly'>('formal')
  const { phase, run, reset } = useRun()
  const result = useMemo(() => generateReply(text, tone), [text, tone, phase === 'done'])
  const { out, done } = useTypewriter(result.reply, phase === 'done', 10)

  return (
    <div className="space-y-3">
      <Field label="가상 예약 문의 선택">
        <div className="flex flex-wrap gap-2">
          {sampleInquiries.map((q) => (
            <button key={q.id} className={`btn ${sel === q.id ? 'btn-cyan' : ''}`} onClick={() => { setSel(q.id); setText(q.text); reset() }}>
              {q.label}
            </button>
          ))}
        </div>
      </Field>
      <Field label="고객 문의 (직접 수정 가능)">
        <textarea className="field min-h-[84px]" value={text} onChange={(e) => { setText(e.target.value); reset() }} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="응답 톤">
          <select className="field" value={tone} onChange={(e) => { setTone(e.target.value as 'formal' | 'friendly'); reset() }}>
            <option value="formal">정중</option>
            <option value="friendly">친근</option>
          </select>
        </Field>
        <Field label="참조 자료(RAG)">
          <div className="field !py-2 text-[12px] text-slate-300">요금표 · 주차/취소/체크인 정책 (가상)</div>
        </Field>
      </div>
      <button className="btn btn-gold" onClick={() => run()} disabled={!text.trim() || phase === 'thinking'}>▶ AI 응답 초안 생성 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="문의 의도 분석 → 자료 검색 → 초안 작성 중…" />}
      {phase === 'done' && (
        <>
          <Card title="AI 응답 초안">
            <pre className="whitespace-pre-wrap font-sans">{out}{!done && <span className="animate-pulse">▍</span>}</pre>
          </Card>
          {done && (
            <div className="grid gap-3 md:grid-cols-2">
              <Card title="근거로 사용한 자료" tone="cyan">
                {result.facts.length ? <ul className="list-disc pl-4">{result.facts.map((f) => <li key={f}>{f}</li>)}</ul> : '없음'}
              </Card>
              <Card title="⚠ 사람 확인 필요 (환각 방지: 자료에 없는 내용은 추측하지 않음)" tone="red">
                {result.unknown.length ? <ul className="list-disc pl-4">{result.unknown.map((f) => <li key={f}>{f}</li>)}</ul> : <Pill tone="green">없음</Pill>}
              </Card>
            </div>
          )}
          {done && <ApprovalGate simId="reservation-reply" title={`예약 문의 응답 승인: ${sampleInquiries.find((s) => s.id === sel)?.label ?? '직접 입력'}`} text={result.reply} onReject={reset} />}
        </>
      )}
    </div>
  )
}
