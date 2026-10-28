import { useMemo, useState } from 'react'
import { ApprovalGate, Card, Field, Pill } from './shared'
import { pct, won } from '../utils/calc'

type Tech = 'zero' | 'cot' | 'sc' | 'tot' | 'react'
const TECHS: { id: Tech; label: string }[] = [
  { id: 'zero', label: 'Zero-shot' },
  { id: 'cot', label: 'CoT' },
  { id: 'sc', label: 'Self-Consistency' },
  { id: 'tot', label: 'ToT' },
  { id: 'react', label: 'ReAct' },
]

export default function ReasoningLab() {
  const [rooms, setRooms] = useState(120)
  const [occ, setOcc] = useState(75)
  const [adr, setAdr] = useState(200000)
  const [up, setUp] = useState(10)
  const [drop, setDrop] = useState(5)
  const [tech, setTech] = useState<Tech>('cot')

  const calc = useMemo(() => {
    const o0 = occ / 100
    const rev0 = o0 * adr
    const adr1 = adr * (1 + up / 100)
    const o1 = (occ - drop) / 100
    const rev1 = o1 * adr1
    const truth = rev1 / rev0 - 1
    const naive = up / 100 // 점유율 하락을 무시: ADR 상승률을 그대로 RevPAR 변화로
    const rel = (1 + up / 100) * (1 - drop / 100) - 1 // 점유율 하락을 %p가 아닌 상대 %로 오해
    const paths = [truth, truth, naive, truth, rel]
    const votes = paths.reduce<Record<string, number>>((m, p) => ((m[p.toFixed(4)] = (m[p.toFixed(4)] ?? 0) + 1), m), {})
    const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]
    const alts = [up - 5, up, up + 5].map((u) => {
      const a = adr * (1 + u / 100)
      const oo = (occ - drop * (u / Math.max(up, 1))) / 100
      return { u, rev: Math.max(0, oo) * a, o: oo, a }
    })
    return { rev0, rev1, adr1, o0, o1, truth, naive, rel, paths, votes, winner, alts }
  }, [occ, adr, up, drop])

  const ok = (v: number) => Math.abs(v - calc.truth) < 1e-9
  const fmt = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`
  const result = {
    zero: { ans: calc.naive, why: '풀이 과정 없이 바로 답: "요금이 오른 만큼 RevPAR도 오른다" — 점유율 하락을 놓침' },
    cot: { ans: calc.truth, why: '단계별 풀이로 ①현재 RevPAR ②변경 후 ADR·점유율 ③변경 후 RevPAR ④변화율을 차례로 계산' },
    sc: { ans: calc.paths.find((p) => p.toFixed(4) === calc.winner[0]) ?? calc.truth, why: `5개 추론 경로의 다수결: ${calc.winner[1]}/5표` },
    tot: { ans: calc.truth, why: '요금 인상안 3가지를 각각 전개해 비교한 뒤 최적안을 선택' },
    react: { ans: calc.truth, why: '추론(필요한 수치 파악) → 행동(계산 도구 호출) → 관찰(결과 확인)을 반복' },
  }[tech]

  const summary = `[추론 기법 비교] ${TECHS.find((t) => t.id === tech)!.label}\n문제: 객실 ${rooms}실, 점유율 ${occ}%, ADR ${won(adr)} → 요금 ${up}% 인상, 점유율 ${drop}%p 하락\n정답(계산기): RevPAR ${won(calc.rev0)} → ${won(calc.rev1)} (${fmt(calc.truth)})\n이 기법의 답: ${fmt(result.ans)} → ${ok(result.ans) ? '정답' : '오답'}\n근거: ${result.why}`

  const num = (label: string, v: number, set: (n: number) => void, step = 1) => (
    <Field label={label}><input type="number" className="field" value={v} step={step} onChange={(e) => set(Number(e.target.value) || 0)} /></Field>
  )
  return (
    <div className="space-y-3">
      <Card title="문제 (숫자를 바꿔 보세요)">객실 {rooms}실, 점유율 {occ}%, ADR {won(adr)}. 요금을 {up}% 올리면 점유율이 {drop}%p 떨어집니다. RevPAR 변화율은?</Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {num('객실 수', rooms, setRooms)}{num('점유율(%)', occ, setOcc)}{num('ADR(원)', adr, setAdr, 10000)}{num('요금 인상(%)', up, setUp)}{num('점유율 하락(%p)', drop, setDrop)}
      </div>
      <div className="flex flex-wrap gap-2" role="tablist">
        {TECHS.map((t) => <button key={t.id} role="tab" aria-selected={tech === t.id} className={`btn ${tech === t.id ? 'btn-gold' : ''}`} onClick={() => setTech(t.id)}>{t.label}</button>)}
      </div>
      <Card title="이 기법의 답" tone={ok(result.ans) ? 'cyan' : 'red'}>
        <div className="flex items-center gap-3"><span className="text-3xl font-extrabold text-gold">{fmt(result.ans)}</span><Pill tone={ok(result.ans) ? 'green' : 'red'}>{ok(result.ans) ? '정답' : '오답'}</Pill></div>
        <p className="mt-1 text-slate-300">{result.why}</p>
      </Card>
      {tech === 'cot' && (
        <Card title="CoT 풀이 과정">
          <ol className="list-decimal space-y-1 pl-5">
            <li>현재 RevPAR = {pct(calc.o0, 0)} × {won(adr)} = {won(calc.rev0)}</li>
            <li>변경 후 ADR = {won(adr)} × {1 + up / 100} = {won(calc.adr1)}, 점유율 = {occ}% − {drop}%p = {pct(calc.o1, 0)}</li>
            <li>변경 후 RevPAR = {pct(calc.o1, 0)} × {won(calc.adr1)} = {won(calc.rev1)}</li>
            <li>변화율 = {won(calc.rev1)} ÷ {won(calc.rev0)} − 1 = <b className="text-gold">{fmt(calc.truth)}</b></li>
          </ol>
        </Card>
      )}
      {tech === 'sc' && (
        <Card title="5개 추론 경로 → 다수결">
          <ul className="space-y-1">
            {calc.paths.map((p, i) => <li key={i} className="flex items-center gap-2">경로 {i + 1}: <b>{fmt(p)}</b> {ok(p) ? <Pill tone="green">일치</Pill> : <Pill tone="red">{p === calc.naive ? '점유율 하락 누락' : '%p를 %로 오해'}</Pill>}</li>)}
          </ul>
          <p className="mt-1 text-[12.5px] text-slate-300">서로 다른 방식으로 추론해도 정답 경로는 같은 결론에 수렴하는 경향이 있어 다수결이 오답을 걸러냅니다(고위험 판단에 적합).</p>
        </Card>
      )}
      {tech === 'tot' && (
        <Card title="ToT — 대안 3가지를 전개해 비교">
          <table className="w-full text-[13px]"><thead><tr className="text-left text-slate-300"><th>대안</th><th>ADR</th><th>점유율</th><th>RevPAR</th></tr></thead><tbody>
            {calc.alts.map((a) => <tr key={a.u} className={`border-t border-white/10 ${a.rev === Math.max(...calc.alts.map((x) => x.rev)) ? 'text-gold' : ''}`}><td className="py-1">요금 {a.u >= 0 ? '+' : ''}{a.u}%</td><td>{won(a.a)}</td><td>{pct(a.o, 0)}</td><td>{won(a.rev)}</td></tr>)}
          </tbody></table>
          <p className="mt-1 text-[12.5px] text-slate-300">※ 점유율 하락폭은 인상률에 비례한다는 가정입니다.</p>
        </Card>
      )}
      {tech === 'react' && (
        <Card title="ReAct — 추론과 행동의 반복">
          <ul className="space-y-1 text-[13px]">
            <li>🧠 Thought: RevPAR = 점유율 × ADR 이므로 두 값이 모두 필요하다.</li>
            <li>🔧 Action: calculator(점유율={occ/100}, ADR={adr}) → Observation: {won(calc.rev0)}</li>
            <li>🧠 Thought: 인상 후 ADR과 점유율로 다시 계산한다.</li>
            <li>🔧 Action: calculator(점유율={calc.o1.toFixed(2)}, ADR={Math.round(calc.adr1)}) → Observation: {won(calc.rev1)}</li>
            <li>🧠 Final: 변화율 {fmt(calc.truth)}</li>
          </ul>
        </Card>
      )}
      <ApprovalGate simId="reasoning-lab" title={`추론 기법 비교 결론 승인 (${TECHS.find((t) => t.id === tech)!.label})`} text={summary} checks={['정답을 계산기·원자료로 검증했다', '이 업무에 맞는 기법(고위험=Self-Consistency, 대안 비교=ToT, 도구 필요=ReAct)을 선택했다', '요금 변경 결정은 RM 팀장이 최종 승인한다']} />
    </div>
  )
}
