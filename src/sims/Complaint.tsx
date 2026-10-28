import { useMemo, useState } from 'react'
import { sampleComplaints } from '../data/simulations'
import { ApprovalGate, Card, Field, Pill, Thinking, useRun } from './shared'

const CATS: { name: string; words: RegExp; cause: string; action: string }[] = [
  { name: '소음', words: /소음|소리|시끄|파티|쿵쿵/, cause: '인접 객실 투숙객 소음, 야간 순찰·응대 지연', action: '객실 변경 제안, 야간 보안 순찰 강화, 소음 민원 20분 내 대응 기준 확인' },
  { name: '청결', words: /머리카락|냄새|더러|얼룩|청소|청결|벌레/, cause: '하우스키핑 점검(인스펙션) 누락', action: '즉시 객실 교체 또는 재청소, 해당 층 인스펙션 강화' },
  { name: '서비스', words: /직원|불친절|늦|지나서|응대|대기|기다/, cause: '인력 배치·응대 매뉴얼 미준수', action: '담당 부서 면담, 응대 SLA 점검, 사과 연락' },
  { name: '요금', words: /청구|요금|금액|환불|추가|결제/, cause: '예약 시 안내와 청구 내역 불일치(옵션·세금 설명 부족)', action: '청구 내역 재확인 후 오류 시 정정, 안내 프로세스 개선' },
  { name: '시설', words: /고장|에어컨|온수|와이파이|엘리베이터|누수|냉장고/, cause: '시설 정비 이력 누락', action: '시설팀 긴급 점검 요청, 대체 객실 안내' },
]

export interface Analysis {
  categories: string[]
  anger: number // 1~5
  urgency: '높음' | '중간' | '낮음'
  needsCompensation: boolean
  causes: string[]
  actions: string[]
  reply: string
}

export function analyze(text: string): Analysis {
  const cats = CATS.filter((c) => c.words.test(text))
  const neg = (text.match(/실망|불쾌|최악|화가|정말|너무|못 잤|환불|불만|짜증|황당/g) ?? []).length
  const anger = Math.min(5, 1 + neg + (/!|\?\?/.test(text) ? 1 : 0))
  const needsCompensation = /환불|보상|배상|방을 바꿔|바꿔 주세요/.test(text)
  const urgency: Analysis['urgency'] = anger >= 4 || /환불|바꿔|법|신고|소송|리뷰/.test(text) ? '높음' : anger >= 3 ? '중간' : '낮음'
  const names = cats.map((c) => c.name)
  const reply = [
    '고객님, 이번 투숙에서 불편을 드려 진심으로 죄송합니다.',
    cats.length ? `말씀해 주신 ${names.join('·')} 관련 내용은 담당 부서와 즉시 확인하겠습니다.` : '말씀해 주신 내용은 담당 부서와 즉시 확인하겠습니다.',
    /방을 바꿔/.test(text) ? '객실 변경이 가능한지 지금 확인하여 바로 연락드리겠습니다.' : '가능한 조치를 확인하는 대로 신속히 안내드리겠습니다.',
    needsCompensation ? '요청하신 보상(환불·포인트 등)은 담당 매니저의 확인과 승인 후 안내드리겠습니다.' : '',
    '다시 한번 불편을 드린 점 사과드립니다.',
  ].filter(Boolean).join('\n\n')
  return { categories: names.length ? names : ['기타'], anger, urgency, needsCompensation, causes: cats.map((c) => c.cause), actions: cats.map((c) => c.action), reply }
}

export default function Complaint() {
  const [sel, setSel] = useState(sampleComplaints[0].id)
  const [text, setText] = useState(sampleComplaints[0].text)
  const { phase, run, reset } = useRun()
  const a = useMemo(() => analyze(text), [text])
  return (
    <div className="space-y-3">
      <Field label="가상 고객 불만 선택">
        <div className="flex flex-wrap gap-2">
          {sampleComplaints.map((c) => (
            <button key={c.id} className={`btn ${sel === c.id ? 'btn-cyan' : ''}`} onClick={() => { setSel(c.id); setText(c.text); reset() }}>{c.label}</button>
          ))}
        </div>
      </Field>
      <Field label="고객 불만 내용 (수정 가능)" hint="실제 고객 개인정보(이름·연락처·카드번호)는 입력하지 마세요.">
        <textarea className="field min-h-[84px]" value={text} onChange={(e) => { setText(e.target.value); reset() }} />
      </Field>
      <button className="btn btn-gold" onClick={() => run()} disabled={phase === 'thinking' || !text.trim()}>▶ 분석 및 대응안 생성 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="분류 → 감정 분석 → 원인 추정 → 대응안 작성…" />}
      {phase === 'done' && (
        <>
          <div className="grid gap-3 md:grid-cols-3">
            <Card title="분류">{a.categories.map((c) => <Pill key={c}>{c}</Pill>)}</Card>
            <Card title="불만 강도 (1~5)">
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map((n) => <span key={n} className={`h-3 flex-1 rounded ${n <= a.anger ? 'bg-rose-400' : 'bg-white/10'}`} />)}</div>
              <div className="mt-1">{a.anger}/5</div>
            </Card>
            <Card title="긴급도"><Pill tone={a.urgency === '높음' ? 'red' : a.urgency === '중간' ? 'gold' : 'green'}>{a.urgency}</Pill> {a.needsCompensation && <Pill tone="red">보상 요청 포함</Pill>}</Card>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Card title="추정 원인 (가설 — 사실 확인 필요)">{a.causes.length ? <ul className="list-disc pl-4">{a.causes.map((c) => <li key={c}>{c}</li>)}</ul> : '원인을 특정할 수 없습니다. 담당자 확인이 필요합니다.'}</Card>
            <Card title="서비스 회복 조치 제안">{a.actions.length ? <ul className="list-disc pl-4">{a.actions.map((c) => <li key={c}>{c}</li>)}</ul> : '담당 매니저가 직접 연락합니다.'}</Card>
          </div>
          {a.needsCompensation && <Card tone="red" title="⚠ 금전·보상 실행은 AI 단독 금지">환불·포인트 지급은 되돌리기 어려운 실행입니다. 아래 응답 초안에는 보상 내용을 확정하지 않았고, 매니저 승인 후 진행합니다.</Card>}
          <ApprovalGate simId="complaint" title={`불만 대응 승인: ${a.categories.join('·')}`} text={a.reply} checks={['사과·공감 표현이 진정성 있다', '확정되지 않은 보상·약속이 없다', '개인정보가 포함되지 않았다', a.needsCompensation ? '보상은 매니저 권한으로 별도 승인했다' : '필요한 후속 조치 담당자를 지정했다']} onReject={reset} />
        </>
      )}
    </div>
  )
}
