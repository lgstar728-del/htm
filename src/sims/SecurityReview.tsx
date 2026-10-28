import { useState } from 'react'
import { ApprovalGate, Card, Pill } from './shared'

interface Snip {
  id: string
  title: string
  lines: string[]
  vulns: { line: number; name: string; owasp: string; fix: string }[]
}

// 교육용 가상 코드 — 실제 키는 포함하지 않습니다
const SNIPS: Snip[] = [
  {
    id: 's1',
    title: '문의 등록 API (Express)',
    lines: ["app.post('/inquiries', (req, res) => {", '  const text = req.body.text', '  db.query("INSERT INTO inquiries(text) VALUES (\'" + text + "\')")', "  res.send('<div>' + text + '</div>')", '})'],
    vulns: [
      { line: 3, name: 'SQL 인젝션 + 입력 검증 누락', owasp: 'A03 Injection', fix: '매개변수화된 쿼리 사용, 빈 값·길이 제한 검증을 백엔드에서' },
      { line: 4, name: 'XSS (출력 이스케이프 누락)', owasp: 'A03 Injection(XSS)', fix: '입력을 HTML로 그대로 출력하지 말고 이스케이프/텍스트로 처리' },
    ],
  },
  {
    id: 's2',
    title: '설정·에러 처리',
    lines: ['const API_KEY = "EXAMPLE-NOT-A-REAL-KEY"', 'async function callRoomApi() {', '  try { return await fetch(URL + "?key=" + API_KEY) }', '  catch (err) { res.status(500).send(err.stack) }', '}'],
    vulns: [
      { line: 1, name: '시크릿 하드코딩', owasp: 'A02/A05 Cryptographic Failures·Misconfiguration', fix: '.env 환경변수로 분리, .gitignore, 노출 시 즉시 재발급' },
      { line: 4, name: '에러 내부 정보(스택 트레이스) 노출', owasp: 'A05 Security Misconfiguration', fix: '사용자에게는 일반화된 메시지, 상세는 서버 로그에만' },
    ],
  },
  {
    id: 's3',
    title: '관리자 기능',
    lines: ["app.delete('/rooms/:id', (req, res) => {", '  db.rooms.remove(req.params.id)', '  res.sendStatus(204)', '})', '// 패키지: express@3.0.0 (오래된 버전)'],
    vulns: [
      { line: 1, name: '인증·인가(권한 확인) 없음', owasp: 'A01 Broken Access Control', fix: '로그인 + 관리자 권한을 백엔드에서 확인하는 미들웨어 추가' },
      { line: 5, name: '취약한 오래된 의존성', owasp: 'A06 Vulnerable and Outdated Components', fix: 'npm audit, 최신 버전으로 업데이트' },
    ],
  },
]

export default function SecurityReview() {
  const [picked, setPicked] = useState<Record<string, number[]>>({})
  const [rev, setRev] = useState(false)
  const toggle = (sid: string, ln: number) => setPicked((p) => ({ ...p, [sid]: p[sid]?.includes(ln) ? p[sid].filter((x) => x !== ln) : [...(p[sid] ?? []), ln] }))
  const total = SNIPS.reduce((a, s) => a + s.vulns.length, 0)
  const found = SNIPS.reduce((a, s) => a + s.vulns.filter((v) => picked[s.id]?.includes(v.line)).length, 0)
  const falsePos = SNIPS.reduce((a, s) => a + (picked[s.id] ?? []).filter((l) => !s.vulns.some((v) => v.line === l)).length, 0)
  const report = `[보안 리뷰 결과] 직접 발견 ${found}/${total} · 오탐 ${falsePos}\n\n${SNIPS.map((s) => `■ ${s.title}\n${s.vulns.map((v) => `- ${s.lines.length ? `L${v.line}` : ''} ${v.name} (${v.owasp}) → ${v.fix}${picked[s.id]?.includes(v.line) ? ' ✔직접 발견' : ' ✖놓침'}`).join('\n')}`).join('\n\n')}\n\n수정 프롬프트: "위 취약점을 OWASP Top 10 기준으로 수정하되 기능은 바꾸지 말고 diff만 보여줘. 키 값은 출력하지 마."`
  return (
    <div className="space-y-3">
      <Card title="AI가 만든 코드라고 가정합니다. 위험해 보이는 줄을 클릭해 표시하세요.">코드를 모두 이해하지 못해도 "입력을 그대로 쓰는 곳, 키가 보이는 곳, 권한 확인이 없는 곳, 에러를 그대로 보여주는 곳"을 찾는 것이 바이브코딩의 최소 코드 접점입니다.</Card>
      {SNIPS.map((s) => (
        <div key={s.id} className="overflow-hidden rounded-xl border border-white/12">
          <div className="bg-white/5 px-3 py-1.5 text-[13px] font-bold text-white">{s.title}</div>
          <pre className="overflow-x-auto bg-black/40 py-1 text-[12.5px] leading-6">
            {s.lines.map((l, i) => {
              const ln = i + 1
              const on = picked[s.id]?.includes(ln)
              const v = rev ? s.vulns.find((x) => x.line === ln) : undefined
              return (
                <button key={i} type="button" onClick={() => toggle(s.id, ln)} className={`flex w-full gap-3 px-3 text-left font-mono ${v ? 'bg-rose-500/20' : on ? 'bg-amber-400/20' : 'hover:bg-white/5'}`}>
                  <span className="w-5 shrink-0 text-right text-slate-500">{ln}</span><span className={on || v ? 'text-amber-200' : 'text-emerald-200'}>{l}</span>
                  {on && !rev && <span className="ml-auto text-amber-300">⚑</span>}
                </button>
              )
            })}
          </pre>
          {rev && (
            <ul className="space-y-1 border-t border-white/10 p-2.5 text-[12.5px]">
              {s.vulns.map((v) => (
                <li key={v.line}><Pill tone={picked[s.id]?.includes(v.line) ? 'green' : 'red'}>{picked[s.id]?.includes(v.line) ? '발견' : '놓침'}</Pill> L{v.line} <b className="text-white">{v.name}</b> <span className="text-cyan-200">({v.owasp})</span><br /><span className="text-slate-300">수정: {v.fix}</span></li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <button className="btn btn-gold" onClick={() => setRev(true)}>▶ AI 셀프리뷰 실행 (OWASP Top 10 관점, 시뮬레이션)</button>
      {rev && (
        <>
          <Card title="결과" tone={found === total ? 'cyan' : 'gold'}>직접 발견 <b className="text-gold">{found}/{total}</b> · 오탐 {falsePos}건. 놓친 항목은 체크리스트와 CLAUDE.md 규칙으로 남겨 재발을 막으세요.</Card>
          <ApprovalGate simId="security-review" title="보안 리뷰 보고서 승인" text={report} checks={['모든 취약점의 수정 방향을 이해했다', '시크릿이 노출됐다면 재발급 계획이 있다', '수정은 새 브랜치/커밋에서 diff를 확인하며 진행한다']} />
        </>
      )}
    </div>
  )
}
