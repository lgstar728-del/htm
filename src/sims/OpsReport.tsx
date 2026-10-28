import { useState } from 'react'
import { opsSample } from '../data/simulations'
import { hotelById, hotels } from '../data/hotels'
import { useStore } from '../utils/store'
import { man, pct, roomMetrics, won } from '../utils/calc'
import { ApprovalGate, Card, Field, Pill, Thinking, useRun } from './shared'

export default function OpsReport() {
  const hotelId = useStore((s) => s.hotelId)
  const hotel = hotelById(hotelId ?? '') ?? hotels[0]
  const [d, setD] = useState({ ...opsSample, roomsAvail: hotel.facts.rooms, roomsSold: Math.round(hotel.facts.rooms * opsSample.occ), adr: hotel.facts.adr })
  const { phase, run, reset } = useRun()
  const set = (k: keyof typeof d, v: number) => { setD({ ...d, [k]: v }); reset() }
  const m = roomMetrics(d.roomsAvail, d.roomsSold, d.roomsSold * d.adr)
  const fnbGap = (d.fnbRevenue - d.fnbTarget) / d.fnbTarget
  const energyGap = (d.energyKwh - d.energyAvg) / d.energyAvg
  const hkGap = d.hkMinPerRoom - d.hkTarget

  const anomalies: { level: 'red' | 'gold' | 'green'; text: string; action: string; owner: string }[] = []
  if (fnbGap < -0.05) anomalies.push({ level: 'gold', text: `F&B 매출이 목표 대비 ${pct(Math.abs(fnbGap))} 미달 (${man(d.fnbRevenue)} / ${man(d.fnbTarget)})`, action: '석식 프로모션·예약 연계 패키지 검토', owner: 'F&B 매니저' })
  if (energyGap > 0.07) anomalies.push({ level: 'red', text: `에너지 사용량이 평균 대비 ${pct(energyGap)} 증가 (${d.energyKwh.toLocaleString()}kWh)`, action: '공조·조명 스케줄 점검, 누설·설비 이상 확인', owner: '시설팀장' })
  if (hkGap > 2) anomalies.push({ level: 'gold', text: `객실당 청소 시간이 목표보다 ${hkGap}분 길어짐 (${d.hkMinPerRoom}분)`, action: '동선·카트 구성 점검, 신입 지원 인력 배치', owner: '하우스키핑 슈퍼바이저' })
  if (d.complaints >= 6) anomalies.push({ level: 'red', text: `고객 불만 ${d.complaints}건 접수 (평균 심각도 ${d.complaintAvg}/5)`, action: '유형별 원인 분석 후 재발 방지 회의', owner: 'CX 매니저' })
  if (d.noShow >= 5) anomalies.push({ level: 'gold', text: `노쇼 ${d.noShow}건`, action: '보증금·사전 확인 메시지 강화', owner: '예약 매니저' })
  if (!anomalies.length) anomalies.push({ level: 'green', text: '목표 대비 특이 징후 없음', action: '현행 유지', owner: '-' })

  const report = `[${hotel.name}] 일일 운영 보고서 (AI 초안 · 가상 데이터)\n\n■ 요약\n- OCC ${pct(m.occ)} · ADR ${won(m.adr)} · RevPAR ${won(m.revpar)}\n- F&B 매출 ${man(d.fnbRevenue)} (목표 대비 ${(fnbGap * 100).toFixed(1)}%)\n- 고객 불만 ${d.complaints}건 · NPS ${d.nps}\n\n■ 이상 징후 및 조치\n${anomalies.map((a, i) => `${i + 1}. ${a.text}\n   → 조치: ${a.action} (담당: ${a.owner})`).join('\n')}\n\n※ 수치 원본은 PMS/POS 리포트로 대조 필요. 본 보고서는 담당자 승인 후 배포합니다.`

  const num = (label: string, k: keyof typeof d, step = 1) => (
    <Field label={label}><input type="number" className="field" step={step} value={d[k]} onChange={(e) => set(k, Number(e.target.value) || 0)} /></Field>
  )
  return (
    <div className="space-y-3">
      <Card title={`${hotel.name} — 오늘의 입력 데이터 (읽기 전용 권한 가정 · 가상)`}>수치를 바꿔 보며 AI가 이상 징후를 어떻게 판단하는지 확인하세요.</Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {num('판매 객실', 'roomsSold')}
        {num('ADR(원)', 'adr', 1000)}
        {num('F&B 매출(원)', 'fnbRevenue', 100000)}
        {num('F&B 목표(원)', 'fnbTarget', 100000)}
        {num('고객 불만(건)', 'complaints')}
        {num('NPS', 'nps')}
        {num('청소 분/객실', 'hkMinPerRoom')}
        {num('에너지(kWh)', 'energyKwh', 100)}
      </div>
      <button className="btn btn-gold" onClick={() => run(900)} disabled={phase === 'thinking'}>▶ 운영 보고서 자동 생성 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="데이터 읽기 → 지표 계산 → 목표 대비 비교 → 이상 징후 탐지…" />}
      {phase === 'done' && (
        <>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[['OCC', pct(m.occ)], ['ADR', won(m.adr)], ['RevPAR', won(m.revpar)]].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-gold/40 bg-gold/10 p-3"><div className="text-[12px] text-slate-300">{k}</div><div className="text-lg font-extrabold text-gold">{v}</div></div>
            ))}
          </div>
          <Card title="이상 징후 · 조치 항목">
            <ul className="space-y-1.5">
              {anomalies.map((a, i) => (
                <li key={i} className="flex flex-wrap items-center gap-2"><Pill tone={a.level}>{a.level === 'red' ? '주의' : a.level === 'gold' ? '확인' : '정상'}</Pill>{a.text} <span className="text-slate-400">→ {a.action} ({a.owner})</span></li>
              ))}
            </ul>
          </Card>
          <ApprovalGate simId="ops-report" title={`${hotel.shortName} 일일 운영 보고서 승인`} text={report} checks={['수치를 PMS/POS 원본과 대조했다', '조치 담당자·기한을 지정했다', '외부 공유 시 민감 정보가 없다']} onReject={reset} />
        </>
      )}
    </div>
  )
}
