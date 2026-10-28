import { useEffect, useState } from 'react'
import { ApprovalGate, Card, Field, Pill } from './shared'

const SERVICES = [
  { id: 'pms', label: 'PMS(예약·객실)', risk: '개인정보' },
  { id: 'mail', label: 'Gmail', risk: '외부 발송' },
  { id: 'cal', label: 'Google Calendar', risk: '일정 쓰기' },
  { id: 'slack', label: 'Slack', risk: '외부 발송' },
  { id: 'notion', label: 'Notion', risk: '문서 쓰기' },
  { id: 'drive', label: 'Google Drive', risk: '파일 접근' },
  { id: 'weather', label: '날씨 API(공공데이터)', risk: '읽기 전용' },
]

export default function McpConnect() {
  const [sel, setSel] = useState<string[]>(['pms', 'slack', 'cal'])
  const [mode, setMode] = useState<'api' | 'mcp'>('mcp')
  const [shown, setShown] = useState(0)
  const [running, setRunning] = useState(false)
  const n = sel.length

  // 가정: API 연동은 서비스당 3일, MCP는 서비스당 0.5일 + 클라이언트 1일 (교육용 가정값)
  const apiDays = n * 3
  const mcpDays = n ? n * 0.5 + 1 : 0

  const log: { t: string; d: string; kind: 'sys' | 'tool' | 'wait' }[] = mode === 'mcp'
    ? [
        { t: 'initialize', d: 'Host(Claude) ↔ Client ↔ 각 MCP Server 연결 (로컬 stdio / 원격 OAuth 인증)', kind: 'sys' },
        { t: 'tools/list', d: `서버가 "나 이런 기능 있어"라고 알림(Discovery): ${sel.map((s) => SERVICES.find((x) => x.id === s)!.label).join(', ')}`, kind: 'sys' },
        ...(sel.includes('pms') ? [{ t: 'tools/call → pms.list_arrivals', d: '오늘 VIP 도착 4건 조회(읽기 전용, 가상)', kind: 'tool' as const }] : []),
        ...(sel.includes('weather') ? [{ t: 'tools/call → weather.forecast', d: '오후 비 예보(가상)', kind: 'tool' as const }] : []),
        ...(sel.includes('slack') ? [{ t: 'tools/call → slack.post_message (초안)', d: '#front-desk 채널에 "오늘 VIP 도착 4건" 메시지 초안 작성', kind: 'tool' as const }, { t: '승인 대기', d: '외부 발송은 사람이 승인해야 실행됩니다 (Human-in-the-Loop)', kind: 'wait' as const }] : []),
        ...(sel.includes('cal') ? [{ t: 'tools/call → calendar.create_event (초안)', d: '환영 준비 회의 일정 초안', kind: 'tool' as const }] : []),
      ]
    : [
        { t: '서비스별 코드 작성', d: `${n}개 서비스마다 엔드포인트·인증·요청/응답 형식이 달라 각각 별도 연동 코드를 작성`, kind: 'sys' },
        ...sel.map((s) => ({ t: `API Key/Secret 발급·보관 — ${SERVICES.find((x) => x.id === s)!.label}`, d: '.env에 보관, 코드·GitHub에 올리지 않음', kind: 'sys' as const })),
        { t: '에이전트 연결', d: '각 API를 도구로 직접 정의해 주어야 AI가 사용할 수 있음 (자율 탐색 없음)', kind: 'sys' },
      ]

  useEffect(() => {
    if (!running) return
    if (shown >= log.length) {
      setRunning(false)
      return
    }
    const id = setTimeout(() => setShown((x) => x + 1), 600)
    return () => clearTimeout(id)
  }, [running, shown, log.length])

  const text = `[${mode.toUpperCase()} 연결 점검] 서비스 ${n}개\n- 예상 연동 공수(가정): API ${apiDays}일 vs MCP ${mcpDays}일\n\n${log.map((l, i) => `${i + 1}. ${l.t} — ${l.d}`).join('\n')}\n\n※ 외부 발송·쓰기 도구는 사람 승인 후 실행, 커스텀 커넥터는 신뢰 가능한 제공자만 연결.`

  return (
    <div className="space-y-3">
      <Field label="연결할 호텔 시스템 (복수 선택)">
        <div className="flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <button key={s.id} className={`btn !min-h-9 ${sel.includes(s.id) ? 'btn-cyan' : ''}`} onClick={() => { setSel(sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id]); setShown(0) }}>{s.label}</button>
          ))}
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <button className={`btn ${mode === 'api' ? 'btn-gold' : ''}`} onClick={() => { setMode('api'); setShown(0) }}>API 직접 연동</button>
        <button className={`btn ${mode === 'mcp' ? 'btn-gold' : ''}`} onClick={() => { setMode('mcp'); setShown(0) }}>MCP 표준 연결</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="연동 부담 비교 (교육용 가정값)">
          <div className="space-y-2 text-[13px]">
            <div>API: {n}개 서비스 → <b className="text-rose-300">{n}개의 서로 다른 코드</b> · 약 {apiDays}일<div className="h-2 overflow-hidden rounded bg-white/10"><div className="h-full bg-rose-400" style={{ width: `${Math.min(100, apiDays * 4)}%` }} /></div></div>
            <div>MCP: 표준 클라이언트 1개 + 서버 {n}개 → <b className="text-emerald-300">하나의 통로</b> · 약 {mcpDays}일<div className="h-2 overflow-hidden rounded bg-white/10"><div className="h-full bg-emerald-400" style={{ width: `${Math.min(100, mcpDays * 4)}%` }} /></div></div>
          </div>
        </Card>
        <Card title="서비스별 권한·위험" tone="red">
          <ul className="space-y-1 text-[13px]">{sel.map((s) => { const x = SERVICES.find((y) => y.id === s)!; return <li key={s}><Pill tone={x.risk === '읽기 전용' ? 'green' : 'gold'}>{x.risk}</Pill> {x.label}</li> })}{!n && <li>선택된 서비스 없음</li>}</ul>
        </Card>
      </div>
      <button className="btn btn-gold" disabled={!n || running} onClick={() => { setShown(0); setRunning(true) }}>▶ 요청 실행: "오늘 VIP 도착 목록을 Slack으로 공유해줘" (시뮬레이션)</button>
      {shown > 0 && (
        <ol className="space-y-1.5">
          {log.slice(0, shown).map((l, i) => (
            <li key={i} className={`rounded-lg border px-3 py-2 text-[13px] ${l.kind === 'wait' ? 'border-gold/50 bg-gold/10' : l.kind === 'tool' ? 'border-cyan-300/40 bg-cyan-300/10' : 'border-white/12 bg-white/[0.04]'}`}>
              <b className="text-white">{l.kind === 'tool' ? '🔧 ' : l.kind === 'wait' ? '🧑‍⚖️ ' : '⚙️ '}{l.t}</b><br /><span className="text-slate-300">{l.d}</span>
            </li>
          ))}
        </ol>
      )}
      {shown >= log.length && shown > 0 && <ApprovalGate simId="mcp-connect" title={`${mode.toUpperCase()} 연결안 승인 (${n}개 서비스)`} text={text} editable={false} checks={['읽기 전용과 쓰기 권한을 구분했다', '외부 발송 도구는 승인 단계를 거친다', '인증 정보(키)는 코드·GitHub에 두지 않는다', '신뢰할 수 있는 커넥터만 사용한다']} />}
    </div>
  )
}
