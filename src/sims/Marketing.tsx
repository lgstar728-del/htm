import { useMemo, useState } from 'react'
import { segments } from '../data/simulations'
import { hotelById, hotels } from '../data/hotels'
import { useStore } from '../utils/store'
import { aiScore, detect, humanize } from '../utils/humanizer'
import { ApprovalGate, Card, Field, Pill, Thinking, useRun } from './shared'

const GOALS = ['예약 전환', '재방문 유도', '객단가 상승']
const SEASONS = ['이번 주말', '연휴', '여름 성수기', '비수기 평일']

// 의도적으로 AI 말투가 섞인 1차 초안 → Humanizer 규칙으로 점검·정리하는 흐름을 보여줍니다.
function draft(seg: (typeof segments)[number], hotelName: string, season: string, goal: string) {
  const offer: Record<string, string> = {
    family: '키즈 풀 이용과 조식 2인이 포함된 패키지',
    couple: '와인 한 병과 늦은 체크아웃이 포함된 기념일 패키지',
    business: '평일 연박 할인과 라운지 이용이 포함된 비즈니스 패키지',
    foreign: '공항 픽업과 도심 투어 안내가 포함된 패키지',
  }
  return [
    `${hotelName}의 ${season} ${offer[seg.id]}는 단순한 숙박이 아니라, 특별한 경험을 선사합니다. 또한, ${seg.traits.split(',')[0]}에 맞춰 준비했습니다.`,
    `결과적으로, 단순히 편안함을 넘어서 ${goal === '재방문 유도' ? '다시 찾고 싶은 이유를' : '잊지 못할 순간을'} 만들어 드립니다. **지금 확인해 보시겠어요?**`,
    `첫째, ${offer[seg.id]}. 둘째, 예약이 간편합니다. 셋째, 혁신적인 서비스가 놀라운 변화를 가져올 것입니다.`,
  ]
}

export default function Marketing() {
  const hotelId = useStore((s) => s.hotelId)
  const hotel = hotelById(hotelId ?? '') ?? hotels[3]
  const [seg, setSeg] = useState(segments[0].id)
  const [season, setSeason] = useState(SEASONS[0])
  const [goal, setGoal] = useState(GOALS[0])
  const { phase, run, reset } = useRun()
  const s = segments.find((x) => x.id === seg)!
  const raw = useMemo(() => draft(s, hotel.name, season, goal), [s, hotel.name, season, goal])
  const fixed = useMemo(() => raw.map(humanize), [raw])
  const before = raw.map(aiScore)
  const after = fixed.map(aiScore)
  const hits = useMemo(() => detect(raw.join(' ')), [raw])
  const final = `[${hotel.shortName} · ${s.label} · ${season}]\n채널: ${s.channel}\n목표 KPI: ${s.kpi}\n\n${fixed.map((m, i) => `메시지 ${i + 1}) ${m}`).join('\n\n')}`

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="고객 세그먼트">
          <select className="field" value={seg} onChange={(e) => { setSeg(e.target.value); reset() }}>{segments.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}</select>
        </Field>
        <Field label="시즌/시점">
          <select className="field" value={season} onChange={(e) => { setSeason(e.target.value); reset() }}>{SEASONS.map((x) => <option key={x}>{x}</option>)}</select>
        </Field>
        <Field label="캠페인 목표">
          <select className="field" value={goal} onChange={(e) => { setGoal(e.target.value); reset() }}>{GOALS.map((x) => <option key={x}>{x}</option>)}</select>
        </Field>
      </div>
      <Card title={`세그먼트 특성: ${s.label}`}>{s.traits} · 추천 채널: {s.channel} · KPI: {s.kpi}</Card>
      <button className="btn btn-gold" onClick={() => run(900)} disabled={phase === 'thinking'}>▶ 맞춤 메시지 생성 + AI 말투 점검 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="세그먼트 분석 → 메시지 초안 → Humanizer 10패턴 점검…" />}
      {phase === 'done' && (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <Card title="① AI 1차 초안 (AI 말투 포함)" tone="red">
              {raw.map((m, i) => (
                <p key={i} className="mb-2 text-[13px]">{m}<span className="ml-1"><Pill tone="red">AI 점수 {before[i]}</Pill></span></p>
              ))}
            </Card>
            <Card title="② Humanizer 적용 후" tone="cyan">
              {fixed.map((m, i) => (
                <p key={i} className="mb-2 text-[13px]">{m}<span className="ml-1"><Pill tone="green">AI 점수 {after[i]}</Pill></span></p>
              ))}
            </Card>
          </div>
          <Card title="탐지된 AI 말투 패턴">{hits.map((h) => <span key={h.pattern.no} className="mr-1.5 inline-block"><Pill tone="gold">#{h.pattern.no} {h.pattern.name} ×{h.count}</Pill></span>)}</Card>
          <ApprovalGate simId="marketing" title={`${hotel.shortName} ${s.label} 캠페인 승인`} text={final} checks={['혜택·요금·기간이 실제 정책과 일치한다', '과장·허위 표현이 없다 (광고 표시 기준 준수)', '개인정보 수집·활용 동의 범위 안에서 발송한다']} onReject={reset} />
        </>
      )}
    </div>
  )
}
