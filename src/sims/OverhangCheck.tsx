import { useState } from 'react'
import { ApprovalGate, Card, Pill } from './shared'
import { useStore } from '../utils/store'

const Q: { id: string; text: string; good: boolean; lesson: string; tip: string }[] = [
  { id: 'q1', text: '주로 챗창에 질문하거나 초안을 쓰는 데 AI를 쓴다', good: false, lesson: 'L02', tip: '챗 인터페이스에만 가둔 사용 — 반복 업무를 워크플로우로' },
  { id: 'q2', text: '같은 요청을 매번 처음부터 다시 설명한다', good: false, lesson: 'L20', tip: '매번 시키는 일은 자동화(파이프라인)할 신호' },
  { id: 'q3', text: '업무 파일·시스템(PMS·메일·캘린더)을 AI에 연결해 쓴다', good: true, lesson: 'L07', tip: 'MCP·커넥터로 도구와 데이터를 연결' },
  { id: 'q4', text: '반복 업무를 에이전트·Skill·명령어로 자동화한 것이 있다', good: true, lesson: 'L20', tip: '트리거-계획-실행-검증 파이프라인' },
  { id: 'q5', text: 'AI 결과를 검증하는 기준(체크리스트)과 승인 단계가 있다', good: true, lesson: 'L04', tip: '단독 결정 금지, Human-in-the-Loop' },
  { id: 'q6', text: '팀이 쓰는 프롬프트·스킬을 공유 자산으로 관리한다', good: true, lesson: 'L09', tip: '잘 작동하는 프롬프트의 전사적 자산화' },
  { id: 'q7', text: 'AI 도입 효과를 시간·품질 지표로 측정한다 (베이스라인 있음)', good: true, lesson: 'L03', tip: '성공지표와 베이스라인 — AX 문제발굴 템플릿' },
  { id: 'q8', text: '업무 프로세스 자체를 AI 기준으로 재설계해 본 적이 있다', good: true, lesson: 'L03', tip: '워크플로우 재설계가 AX의 핵심' },
]

const STAGES = [
  { min: 0, name: '① 챗 인터페이스에 갇힘', color: 'red' as const, next: '반복되는 업무 1개를 골라 프롬프트를 표준화하세요.' },
  { min: 3, name: '② 도구 활용', color: 'gold' as const, next: '파일·시스템을 연결하고 검증 기준을 만드세요.' },
  { min: 5, name: '③ 워크플로우', color: 'cyan' as const, next: '에이전트·파이프라인으로 확장하고 지표를 측정하세요.' },
  { min: 7, name: '④ AX(AI 네이티브)', color: 'green' as const, next: '성과를 전사 표준(템플릿·거버넌스)으로 확산하세요.' },
]

export default function OverhangCheck() {
  const hotelId = useStore((s) => s.hotelId)
  void hotelId
  const [ans, setAns] = useState<Record<string, boolean>>({})
  const done = Object.keys(ans).length === Q.length
  const score = Q.filter((q) => (ans[q.id] ?? false) === q.good && ans[q.id] !== undefined).length
  const stage = [...STAGES].reverse().find((s) => score >= s.min)!
  const gaps = Q.filter((q) => ans[q.id] !== undefined && ans[q.id] !== q.good)
  const plan = `[90일 AX 계획] 현재 단계: ${stage.name} (${score}/${Q.length})\n\n우선 과제\n${gaps.slice(0, 3).map((g, i) => `${i + 1}. ${g.tip} → 관련 강의 ${g.lesson}`).join('\n') || '1. 현행 유지, 성과 지표 공유'}\n\n다음 단계: ${stage.next}\n\n※ 개인정보·고객 데이터가 포함된 업무는 사람 승인 단계를 먼저 설계합니다.`
  return (
    <div className="space-y-3">
      <Card title="우리 팀의 AI 사용 방식에 해당하면 '예', 아니면 '아니오'를 선택하세요">
        <ul className="space-y-2">
          {Q.map((q, i) => (
            <li key={q.id} className="flex flex-wrap items-center gap-2 rounded-lg border border-white/12 px-3 py-2">
              <span className="min-w-0 flex-1 text-[13.5px]">{i + 1}. {q.text}</span>
              {[true, false].map((v) => (
                <button key={String(v)} className={`btn !min-h-8 !px-3 !py-1 ${ans[q.id] === v ? 'btn-cyan' : ''}`} onClick={() => setAns((a) => ({ ...a, [q.id]: v }))}>{v ? '예' : '아니오'}</button>
              ))}
            </li>
          ))}
        </ul>
      </Card>
      {done && (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <Card title="진단 결과"><Pill tone={stage.color}>{stage.name}</Pill><div className="mt-2 text-[22px] font-extrabold text-gold">{score} / {Q.length}</div></Card>
            <Card title="잠재 능력 vs 실제 활용" tone="cyan">
              <div className="h-3 overflow-hidden rounded bg-white/10"><div className="h-full bg-gradient-to-r from-cyan-400 to-gold" style={{ width: `${(score / Q.length) * 100}%` }} /></div>
              <p className="mt-1 text-[12.5px] text-slate-300">남은 격차 {Q.length - score}개 = AI 역량과잉(Capability Overhang)</p>
            </Card>
          </div>
          <Card title="격차를 줄일 과제">
            {gaps.length ? <ul className="list-disc space-y-1 pl-4">{gaps.map((g) => <li key={g.id}>{g.tip} <Pill>{g.lesson}</Pill></li>)}</ul> : '모든 항목이 충족되었습니다.'}
          </Card>
          <ApprovalGate simId="overhang-check" title="90일 AX 계획 승인" text={plan} checks={['현재 수준 진단에 동의한다', '과제의 담당자와 기한을 정했다', '성공 지표와 베이스라인을 기록했다']} />
        </>
      )}
      {!done && <p className="text-[12.5px] text-slate-400">{Object.keys(ans).length}/{Q.length} 문항 응답</p>}
    </div>
  )
}
