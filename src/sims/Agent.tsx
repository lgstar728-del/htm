import { useEffect, useRef, useState } from 'react'
import { conciergeRequests } from '../data/simulations'
import { ApprovalGate, Card, Field, Pill } from './shared'

const TOOLS = [
  { id: 'pms', label: 'PMS 예약 조회 (읽기)', risk: 'low', on: true },
  { id: 'mail', label: '이메일 초안 작성 (쓰기: 초안만)', risk: 'low', on: true },
  { id: 'calendar', label: '캘린더 등록 (쓰기)', risk: 'mid', on: true },
  { id: 'refund', label: '환불·포인트 지급 실행 (금전)', risk: 'high', on: false },
] as const

interface Step {
  title: string
  detail: string
  kind: 'think' | 'tool' | 'check' | 'wait' | 'block' | 'done'
}

function buildSteps(reqId: string, perms: Record<string, boolean>): Step[] {
  const s: Step[] = [
    { title: '요청 수신', detail: conciergeRequests.find((r) => r.id === reqId)!.text, kind: 'think' },
    { title: '의도 분류·목표 분해', detail: reqId === 'r1' ? '예약 변경 + 공항 픽업 조정 (2개 하위 작업)' : reqId === 'r2' ? '불만 접수 + 보상 요청 (금전 포함 → 고위험)' : '룸 세팅 + 케이크 + 늦은 체크아웃 (3개 하위 작업)', kind: 'think' },
    { title: '계획 수립', detail: '조회 → 가능 여부 판단 → 안내 메일 초안 → (필요 시) 일정 등록 → 사람 승인', kind: 'think' },
  ]
  if (perms.pms) s.push({ title: '도구 호출: PMS 예약 조회', detail: reqId === 'r2' ? '지난 투숙 이력 조회: 소음 민원 1건 확인(가상)' : '대상 예약 확인: 디럭스 더블 1박, 변경 가능 재고 있음(가상)', kind: 'tool' })
  else s.push({ title: '도구 호출 불가: PMS 예약 조회', detail: '권한 없음 → 사람에게 조회 요청', kind: 'block' })
  if (reqId === 'r2') {
    if (perms.refund) s.push({ title: '⚠ 금전 도구 활성화됨', detail: '환불 실행은 승인 이후에만 가능하도록 이중 잠금', kind: 'check' })
    else s.push({ title: '권한 확인: 환불·포인트 지급', detail: '권한 없음(안전 기본값) → 추천 보상안만 작성하고 담당 매니저에게 에스컬레이션', kind: 'block' })
  }
  if (perms.mail) s.push({ title: '도구 호출: 이메일 초안 작성', detail: '고객 안내 메일 초안을 임시보관함에 저장 (자동 발송 안 함)', kind: 'tool' })
  else s.push({ title: '도구 호출 불가: 이메일 초안', detail: '권한 없음 → 결과 텍스트로만 제공', kind: 'block' })
  if (reqId !== 'r2') {
    if (perms.calendar) s.push({ title: '도구 호출: 캘린더 등록', detail: '변경된 일정으로 일정 등록(가상)', kind: 'tool' })
    else s.push({ title: '도구 호출 불가: 캘린더', detail: '권한 없음 → 일정 등록은 담당자가 수동 처리', kind: 'block' })
  }
  s.push({ title: '자가 검증 (루프)', detail: '날짜·금액·이름 일치 여부 점검 → 모두 일치(가상)', kind: 'check' })
  s.push({ title: '승인 대기 (Human-in-the-Loop)', detail: '고객 발송·일정 확정·보상 실행은 담당자 승인 후 진행', kind: 'wait' })
  return s
}

const ICON: Record<Step['kind'], string> = { think: '🧠', tool: '🔧', check: '🔁', wait: '🧑‍⚖️', block: '⛔', done: '✅' }

export default function Agent() {
  const [req, setReq] = useState(conciergeRequests[0].id)
  const [perms, setPerms] = useState<Record<string, boolean>>(Object.fromEntries(TOOLS.map((t) => [t.id, t.on])))
  const [steps, setSteps] = useState<Step[]>([])
  const [shown, setShown] = useState(0)
  const [running, setRunning] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const start = () => {
    const st = buildSteps(req, perms)
    setSteps(st)
    setShown(0)
    setRunning(true)
  }
  useEffect(() => {
    if (!running) return
    if (shown >= steps.length) {
      setRunning(false)
      return
    }
    timer.current = window.setTimeout(() => setShown((n) => n + 1), 650)
    return () => window.clearTimeout(timer.current)
  }, [running, shown, steps.length])

  const finished = steps.length > 0 && shown >= steps.length
  const log = steps.map((s, i) => `${i + 1}. [${s.kind.toUpperCase()}] ${s.title} — ${s.detail}`).join('\n')

  return (
    <div className="space-y-3">
      <Card title="하네스 설정 — 에이전트가 쓸 수 있는 도구와 권한 (Harness Engineering)">
        <div className="grid gap-1.5 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <label key={t.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/12 px-2.5 py-2 text-[13px]">
              <input type="checkbox" className="h-4 w-4 accent-yellow-500" checked={perms[t.id]} onChange={() => { setPerms({ ...perms, [t.id]: !perms[t.id] }); setSteps([]); setShown(0) }} />
              <span className="flex-1">{t.label}</span>
              <Pill tone={t.risk === 'high' ? 'red' : t.risk === 'mid' ? 'gold' : 'green'}>{t.risk === 'high' ? '고위험' : t.risk === 'mid' ? '중간' : '낮음'}</Pill>
            </label>
          ))}
        </div>
      </Card>
      <Field label="컨시어지 요청 (가상)">
        <div className="flex flex-wrap gap-2">
          {conciergeRequests.map((r) => (
            <button key={r.id} className={`btn ${req === r.id ? 'btn-cyan' : ''}`} onClick={() => { setReq(r.id); setSteps([]); setShown(0) }}>{r.label}</button>
          ))}
        </div>
      </Field>
      <button className="btn btn-gold" onClick={start} disabled={running}>▶ 에이전트 실행 (시뮬레이션)</button>
      {steps.length > 0 && (
        <ol className="space-y-1.5">
          {steps.slice(0, shown).map((s, i) => (
            <li key={i} className={`flex gap-2 rounded-lg border px-3 py-2 text-[13px] ${s.kind === 'block' ? 'border-rose-400/40 bg-rose-400/10' : s.kind === 'wait' ? 'border-gold/50 bg-gold/10' : s.kind === 'tool' ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/12 bg-white/[0.04]'}`}>
              <span>{ICON[s.kind]}</span>
              <span><b className="text-white">{s.title}</b><br /><span className="text-slate-300">{s.detail}</span></span>
            </li>
          ))}
          {running && <li className="px-3 text-sm text-cyan-200">처리 중…</li>}
        </ol>
      )}
      {finished && (
        <ApprovalGate
          simId="agent-automation"
          title={`에이전트 작업 승인: ${conciergeRequests.find((r) => r.id === req)!.label}`}
          text={log}
          editable={false}
          checks={['에이전트가 호출한 도구와 권한이 적절했다', '고객에게 나갈 내용(날짜·금액·약속)을 확인했다', '고위험(금전·계약) 작업은 별도 권한자가 처리한다']}
          onReject={() => { setSteps([]); setShown(0) }}
        >
          <p className="text-[12.5px] text-slate-300">승인하면 감사 로그(Audit Log)가 기록됩니다. 에이전트는 승인 전에는 어떤 외부 실행도 하지 않았습니다.</p>
        </ApprovalGate>
      )}
    </div>
  )
}
