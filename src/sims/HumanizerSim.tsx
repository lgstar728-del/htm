import { useMemo, useState, type ReactNode } from 'react'
import { humanizerSamples } from '../data/simulations'
import { aiScore, detect, humanize, patterns } from '../utils/humanizer'
import { ApprovalGate, Card, Field, Pill } from './shared'

function highlight(text: string): ReactNode[] {
  const ranges: [number, number][] = []
  patterns.forEach((p) => {
    const re = new RegExp(p.test.source, 'g')
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      if (m[0].length === 0) {
        re.lastIndex++
        continue
      }
      ranges.push([m.index, m.index + m[0].length])
    }
  })
  ranges.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const r of ranges) {
    const last = merged[merged.length - 1]
    if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1])
    else merged.push([...r] as [number, number])
  }
  const out: ReactNode[] = []
  let cur = 0
  merged.forEach(([s, e], i) => {
    if (s > cur) out.push(text.slice(cur, s))
    out.push(<mark key={i} className="ai-hit">{text.slice(s, e)}</mark>)
    cur = e
  })
  if (cur < text.length) out.push(text.slice(cur))
  return out
}

export default function HumanizerSim() {
  const [text, setText] = useState(humanizerSamples[0].text)
  const findings = useMemo(() => detect(text), [text])
  const score = aiScore(text)
  const fixed = useMemo(() => humanize(text), [text])
  const after = aiScore(fixed)
  return (
    <div className="space-y-3">
      <Field label="샘플 문구">
        <div className="flex flex-wrap gap-2">
          {humanizerSamples.map((s) => (
            <button key={s.id} className={`btn ${text === s.text ? 'btn-cyan' : ''}`} onClick={() => setText(s.text)}>{s.label}</button>
          ))}
        </div>
      </Field>
      <Field label="점검할 문장 (직접 입력·수정)" hint="고객 개인정보나 기밀은 붙여넣지 마세요.">
        <textarea className="field min-h-[110px]" value={text} onChange={(e) => setText(e.target.value)} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Card title="AI 말투 점수 (낮을수록 자연스러움)" tone={score > 40 ? 'red' : 'cyan'}>
          <div className="flex items-end gap-2"><span className="text-3xl font-extrabold text-gold">{score}</span><span className="text-slate-400">/ 100</span></div>
          <div className="mt-1 h-2 overflow-hidden rounded bg-white/10"><div className={`h-full ${score > 40 ? 'bg-rose-400' : score > 15 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${score}%` }} /></div>
        </Card>
        <Card title="수정 후 점수" tone="cyan">
          <div className="flex items-end gap-2"><span className="text-3xl font-extrabold text-emerald-300">{after}</span><span className="text-slate-400">/ 100</span></div>
          <div className="mt-1 text-[12px] text-slate-400">규칙 기반 1차 수정 결과입니다</div>
        </Card>
      </div>
      <Card title="탐지 결과 (노란 표시)"><p className="whitespace-pre-wrap leading-8">{highlight(text)}</p></Card>
      <Card title={`탐지된 패턴 ${findings.length}종`}>
        {findings.length === 0 ? <Pill tone="green">탐지된 패턴 없음</Pill> : (
          <ul className="space-y-1">{findings.map((f) => (<li key={f.pattern.no}><Pill tone="gold">#{f.pattern.no} {f.pattern.name} ×{f.count}</Pill> <span className="text-slate-400">{f.pattern.tip}</span></li>))}</ul>
        )}
      </Card>
      <ApprovalGate simId="humanizer" title="Humanizer 수정본 승인" text={fixed} checks={['의미와 사실(요금·시간·조건)이 바뀌지 않았다', '남은 AI 말투를 직접 다듬었다', '브랜드 톤과 어울린다']} />
    </div>
  )
}
