import { useMemo, useState } from 'react'
import { ApprovalGate, Card, Field, Pill } from './shared'
import { copyText } from '../utils/env'

const PRESETS = [
  { id: 'review', label: '주간 OTA 리뷰 분석 보고', f: { problem: '마케팅 담당자가 매주 월요일 오전 OTA 리뷰 80~100건을 읽고 엑셀로 분류·요약하는 데 건당 2분씩 약 3시간을 쓴다', goal: '불만 TOP5와 개선안 보고서를 30분 안에 작성, 근거 리뷰 누락 0건', metric: '베이스라인 주 3시간 / 목표 30분, 매월 말 표본 10건 확인', trigger: '매주 월요일 9시', steps: '리뷰 수집 → 주제·감정 분류 → 불만 TOP5 → 개선안 → 보고서', output: '보고서 .docx (새 파일) + 근거 리뷰 표', external: true, repeat: true, rule: true, verify: true } },
  { id: 'rfp', label: '연회 제안요청서(RFP) → 제안서 초안', f: { problem: '연회 담당자가 RFP 1건당 요구사항을 수작업으로 정리해 초안을 쓰는 데 3시간이 걸리고 요구사항 누락이 월 4건 발생', goal: '초안 작성 3시간 → 30분, 요구사항 누락 0건', metric: '베이스라인 건당 3시간·누락 4건 / 목표 30분·0건', trigger: 'RFP 파일 업로드', steps: '요구사항·평가기준·마감일 추출 → 표준 포맷 초안 → 요구사항 반영 검증', output: '제안서 초안 .docx (새 파일) + 요구사항 대조표', external: false, repeat: true, rule: true, verify: true } },
  { id: 'creative', label: '(부적합 예) 매번 다른 창의 캠페인 기획', f: { problem: '매번 주제와 판단 기준이 완전히 다른 브랜드 캠페인을 기획한다', goal: '창의적 아이디어', metric: '', trigger: '수시', steps: '', output: '', external: false, repeat: false, rule: false, verify: false } },
]

export default function PipelineDesigner() {
  const [f, setF] = useState({ ...PRESETS[0].f })
  const [copied, setCopied] = useState(false)
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF({ ...f, [k]: v })
  const value = [f.repeat, f.rule, f.verify].filter(Boolean).length

  const parts = useMemo(() => {
    const steps = f.steps.split(/→|->|>|\n/).map((s) => s.trim()).filter(Boolean)
    const has = (re: RegExp) => steps.some((s) => re.test(s))
    const comps: string[] = []
    if (has(/수집|조사|검색|리서치/)) comps.push('서브에이전트: 수집·조사 담당 (웹/OTA 읽기 전용)')
    if (has(/분류|분석|추출|요약/)) comps.push('서브에이전트 또는 Skill: 분석·분류 절차')
    if (has(/보고서|초안|작성|문서/)) comps.push('Skill: 문서 생성(docx/pptx) — 새 파일로 저장')
    comps.push(`커스텀 명령어: /${f.trigger.includes('주') ? '주간파이프라인' : '실행'} (트리거를 재현 가능하게)`)
    comps.push('Hook: 저장/발송 직전 필수 검증(시크릿·개인정보 검사)')
    const warn: string[] = []
    if (!f.metric.trim()) warn.push('성공지표·베이스라인이 없습니다 — 효과를 증명할 수 없습니다.')
    if (!f.steps.trim()) warn.push('단계가 비어 있습니다 — 계획 단계를 정의하세요.')
    if (f.external) warn.push('외부 발송·공유가 포함됩니다 → 반드시 "사람 승인 후에만 실행"으로 지정하세요.')
    if (!f.output.includes('새 파일') && f.output) warn.push('산출물 저장 시 기존 파일 덮어쓰기 금지(새 파일·새 버전) 조건을 추가하세요.')
    if (value < 3) warn.push(`자동화 가치 ${value}/3 — 반복성·규칙성·검증 가능성을 모두 만족하지 않으면 파이프라인보다 사람 주도 + AI 보조가 적합합니다.`)
    return { steps, comps, warn }
  }, [f, value])

  const request = `${f.goal}을(를) 위해 ${f.trigger} 이(가) 생기면 ${parts.steps.join(' → ')} 순서로 처리하고, ${f.metric || '[판단 기준 입력]'}을(를) 만족하는지 검증하는 파이프라인을 만들어줘.\n외부 발송·삭제는 자동 실행하지 말고 사람 승인을 거치고, 산출물은 기존 파일을 덮어쓰지 말고 새 파일로 저장해줘.\n서브에이전트·Skill·커스텀 명령어·Hook 중 어떻게 나눌지 먼저 표로 제안하고, 빠진 정보 있으면 만들기 전에 먼저 물어봐줘.`
  const spec = `[에이전틱 파이프라인 설계서]\n문제정의(As-Is): ${f.problem}\n해결문제: ${f.goal}\n성공지표: ${f.metric || '(미정)'}\n\n① 트리거: ${f.trigger}\n② 계획: ${parts.steps.join(' → ') || '(미정)'}\n③ 실행: ${parts.comps.join(' / ')}\n④ 검증: 요구사항·수치·출처 누락 점검, 미충족 시 멈추고 알림 (최대 3회 재시도)\n\n권한 범위: 읽기·초안 작성 중심, ${f.external ? '외부 발송은 사람 승인 후에만' : '외부 발송 없음'}, 기존 파일 수정 금지\n산출물: ${f.output || '(미정)'}\n자동화 가치: ${value}/3 (반복성 ${f.repeat ? 'O' : 'X'} · 규칙성 ${f.rule ? 'O' : 'X'} · 검증 가능성 ${f.verify ? 'O' : 'X'})\n\n경고:\n${parts.warn.map((w) => '- ' + w).join('\n') || '- 없음'}\n\n[Claude 요청 템플릿]\n${request}`

  const text = (label: string, k: 'problem' | 'goal' | 'metric' | 'trigger' | 'steps' | 'output', rows = 2) => (
    <Field label={label}><textarea className="field" rows={rows} value={f[k]} onChange={(e) => set(k, e.target.value)} /></Field>
  )
  return (
    <div className="space-y-3">
      <Field label="예시 불러오기"><div className="flex flex-wrap gap-2">{PRESETS.map((p) => <button key={p.id} className="btn !min-h-9" onClick={() => setF({ ...p.f })}>{p.label}</button>)}</div></Field>
      <div className="grid gap-3 md:grid-cols-2">{text('문제정의 (As-Is, 관찰 사실·수치)', 'problem', 3)}{text('해결문제 (SMART 단일 목표)', 'goal', 3)}{text('성공지표·베이스라인 ★', 'metric')}{text('트리거(시작 신호·주기)', 'trigger')}{text('단계 (→로 구분)', 'steps')}{text('산출물 (형식·저장 규칙)', 'output')}</div>
      <Card title="자동화 가치 판단 — 세 가지를 동시에 만족해야 합니다">
        <div className="flex flex-wrap gap-4">
          {([['repeat', '반복성(주기적으로 발생)'], ['rule', '규칙성(절차를 말로 설명 가능)'], ['verify', '검증 가능성(맞는지 확인 기준)']] as const).map(([k, l]) => (
            <label key={k} className="flex items-center gap-2 text-[13.5px]"><input type="checkbox" className="h-4 w-4 accent-yellow-500" checked={f[k]} onChange={() => set(k, !f[k])} />{l}</label>
          ))}
          <label className="flex items-center gap-2 text-[13.5px]"><input type="checkbox" className="h-4 w-4 accent-rose-400" checked={f.external} onChange={() => set('external', !f.external)} />외부 발송·공유 포함</label>
        </div>
        <div className="mt-2"><Pill tone={value === 3 ? 'green' : value === 2 ? 'gold' : 'red'}>자동화 가치 {value}/3</Pill></div>
      </Card>
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="파이프라인 4단계">
          <ol className="space-y-1"><li><b className="text-gold">① 트리거</b> {f.trigger || '—'}</li><li><b className="text-gold">② 계획</b> {parts.steps.join(' → ') || '—'}</li><li><b className="text-gold">③ 실행</b> 서브에이전트·Skill·도구</li><li><b className="text-gold">④ 검증</b> 기준 미충족 시 멈춤·재시도(최대 3회)</li></ol>
        </Card>
        <Card title="추천 구성요소">{parts.comps.map((c) => <div key={c}>• {c}</div>)}</Card>
      </div>
      {parts.warn.length > 0 && <Card tone="red" title="⚠ 설계 점검 결과">{parts.warn.map((w) => <div key={w}>• {w}</div>)}</Card>}
      <Card title="Claude에 붙여 넣을 요청 템플릿">
        <pre className="whitespace-pre-wrap font-sans text-[13px]">{request}</pre>
        <button className="btn mt-2" onClick={async () => { setCopied(await copyText(request)); setTimeout(() => setCopied(false), 1500) }}>{copied ? '복사됨 ✓' : '📋 요청 복사'}</button>
      </Card>
      <ApprovalGate simId="pipeline-designer" title="파이프라인 설계서 승인" text={spec} checks={['문제정의가 관찰 사실과 수치로 적혀 있다', '성공지표에 도입 전 베이스라인이 있다', '되돌리기 어려운 행동은 사람 승인 단계로 지정했다', '산출물은 새 파일로 저장하고 담당자가 최종 확인한다']} />
    </div>
  )
}
