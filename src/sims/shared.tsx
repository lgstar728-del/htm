import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useStore } from '../utils/store'
import { copyText } from '../utils/env'

export function SimBanner() {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-300/40 bg-amber-300/10 px-3 py-2 text-[13px] text-amber-100">
      <span className="rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-bold text-navy">SIMULATION</span>
      실제 AI API는 연결되어 있지 않습니다. 가상 데이터와 규칙 기반 로직으로 동작하며, 결과는 사람이 검토·승인해야 합니다.
    </div>
  )
}

/** 글자가 하나씩 생성되는 효과 (AI 응답 시뮬레이션) */
export function useTypewriter(text: string, run: boolean, speed = 14) {
  const [out, setOut] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!run) {
      setOut('')
      setDone(false)
      return
    }
    setOut('')
    setDone(false)
    let i = 0
    const step = Math.max(1, Math.round(text.length / 160))
    const id = setInterval(() => {
      i += step
      if (i >= text.length) {
        setOut(text)
        setDone(true)
        clearInterval(id)
      } else setOut(text.slice(0, i))
    }, speed)
    return () => clearInterval(id)
  }, [text, run, speed])
  return { out, done }
}

export function Thinking({ label = 'AI가 분석 중입니다…' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-cyan-200">
      <span className="inline-flex gap-1">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-cyan-300" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </span>
      {label}
    </div>
  )
}

/** "AI 실행" 버튼 → 짧은 처리 지연 → 결과 표시를 관리하는 훅 */
export function useRun() {
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'done'>('idle')
  const timer = useRef<number | undefined>(undefined)
  const run = (ms = 700) => {
    setPhase('thinking')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setPhase('done'), ms)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])
  return { phase, run, reset: () => setPhase('idle') }
}

const DEFAULT_CHECKS = ['사실관계(요금·정책·수치)를 원본 자료와 대조했다', '개인정보·기밀이 포함되지 않았다', '톤·표현과 브랜드 기준에 맞다']

/** 사람 검토·승인 게이트 — 모든 실습 결과는 이 단계를 거칩니다 */
export function ApprovalGate({ simId, title, text, editable = true, checks = DEFAULT_CHECKS, onReject, children }: { simId: string; title: string; text: string; editable?: boolean; checks?: string[]; onReject?: () => void; children?: ReactNode }) {
  const approve = useStore((s) => s.approve)
  const hotelId = useStore((s) => s.hotelId)
  const [value, setValue] = useState(text)
  const [ticks, setTicks] = useState<boolean[]>(() => checks.map(() => false))
  const [state, setState] = useState<'review' | 'approved' | 'rejected'>('review')
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    setValue(text)
    setTicks(checks.map(() => false))
    setState('review')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])
  const all = ticks.every(Boolean)
  return (
    <div className="mt-4 rounded-2xl border border-gold/40 bg-gold/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-gold">
        <span>🧑‍⚖️</span> 사람 검토 · 승인 (Human-in-the-Loop)
      </div>
      {children}
      {editable && (
        <textarea className="field mt-2 min-h-[140px] font-mono text-[13px] leading-relaxed" value={value} onChange={(e) => setValue(e.target.value)} aria-label="검토할 AI 결과 (수정 가능)" disabled={state !== 'review'} />
      )}
      <ul className="mt-3 space-y-1.5">
        {checks.map((c, i) => (
          <li key={c}>
            <label className="flex cursor-pointer items-start gap-2 text-[13px] text-slate-200">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-yellow-500" checked={ticks[i]} disabled={state !== 'review'} onChange={() => setTicks(ticks.map((t, k) => (k === i ? !t : t)))} />
              {c}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          className="btn btn-gold"
          disabled={!all || state !== 'review'}
          onClick={() => {
            approve({ simId, hotelId, title })
            setState('approved')
          }}
        >
          ✅ 승인하고 기록
        </button>
        <button
          className="btn"
          disabled={state !== 'review'}
          onClick={() => {
            setState('rejected')
            onReject?.()
          }}
        >
          ↩ 반려(재생성)
        </button>
        <button
          className="btn"
          onClick={async () => {
            setCopied(await copyText(value))
            setTimeout(() => setCopied(false), 1500)
          }}
        >
          {copied ? '복사됨 ✓' : '📋 결과 복사'}
        </button>
        {state === 'approved' && <span className="text-sm font-semibold text-emerald-300">승인 이력에 기록되었습니다 (학습현황에서 확인)</span>}
        {state === 'rejected' && <span className="text-sm font-semibold text-rose-300">반려되었습니다. 입력을 조정해 다시 실행하세요.</span>}
        {!all && state === 'review' && <span className="text-xs text-slate-400">모든 검토 항목을 확인해야 승인할 수 있습니다.</span>}
      </div>
    </div>
  )
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[13px] font-semibold text-slate-200">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[12px] text-slate-400">{hint}</span>}
    </label>
  )
}

export function Card({ title, children, tone }: { title?: string; children: ReactNode; tone?: 'cyan' | 'red' | 'gold' }) {
  const t = tone === 'red' ? 'border-rose-400/40 bg-rose-400/10' : tone === 'gold' ? 'border-gold/40 bg-gold/10' : tone === 'cyan' ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/12 bg-white/[0.04]'
  return (
    <div className={`rounded-xl border p-3 ${t}`}>
      {title && <div className="mb-1.5 text-[13px] font-bold text-white">{title}</div>}
      <div className="text-[13.5px] leading-relaxed text-slate-200">{children}</div>
    </div>
  )
}

export function Pill({ children, tone = 'cyan' }: { children: ReactNode; tone?: 'cyan' | 'gold' | 'red' | 'green' }) {
  const c = { cyan: 'bg-cyan-400/15 text-cyan-200 border-cyan-300/40', gold: 'bg-gold/15 text-gold border-gold/40', red: 'bg-rose-400/15 text-rose-200 border-rose-300/40', green: 'bg-emerald-400/15 text-emerald-200 border-emerald-300/40' }[tone]
  return <span className={`inline-block rounded-full border px-2 py-0.5 text-[12px] font-semibold ${c}`}>{children}</span>
}
