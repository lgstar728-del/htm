import { Fragment, useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { VisualKind } from '../types'
import { HotelGraph } from './KnowledgeGraph'
import { useStore } from '../utils/store'

const Box = ({ title, children }: { title?: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-navy-3/70 to-navy/80 p-3 md:p-4">
    {title && <div className="mb-3 text-[13px] font-semibold text-cyan-200">{title}</div>}
    {children}
  </div>
)

function Tabs<T extends string>({ items, value, onChange }: { items: { id: T; label: string; sub?: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5" role="tablist">
      {items.map((i) => (
        <button key={i.id} role="tab" aria-selected={value === i.id} onClick={() => onChange(i.id)} className={`rounded-xl border px-3 py-2 text-left text-[13px] font-semibold transition ${value === i.id ? 'border-gold bg-gold/20 text-gold' : 'border-white/15 bg-white/5 text-slate-200 hover:border-white/40'}`}>
          {i.label}
          {i.sub && <span className="block text-[11px] font-normal opacity-75">{i.sub}</span>}
        </button>
      ))}
    </div>
  )
}

function Detail({ k, id, children }: { k: string; id: string; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div key={id + k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} className="mt-3 rounded-xl border border-white/12 bg-black/25 p-3 text-[13.5px] leading-relaxed">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ---------- 1. 모델 진화 5단계 ---------- */
const EVO = [
  { id: 'e1', label: '① 텍스트', sub: '글을 써주는 AI', ability: '언어 생성·요약', change: '대형 언어모델(LLM) 등장', hotel: '예약 문의 응답 초안 자동 작성' },
  { id: 'e2', label: '② 멀티모달', sub: '보고 듣는 AI', ability: '이미지·음성·영상 이해/생성', change: '이미지 입력, 음성 대화', hotel: '객실·시설 사진으로 컨디션 점검 보조' },
  { id: 'e3', label: '③ 추론', sub: '풀이 과정을 거치는 AI', ability: '단계적 사고, 문제 분해', change: 'OpenAI o1·o3, DeepSeek-R1', hotel: '고객 컴플레인 원인 분석 및 대응안 추천' },
  { id: 'e4', label: '④ 에이전트', sub: '대신 일하는 AI', ability: '도구 사용·다단계 작업 자동 수행', change: 'MCP, Computer Use', hotel: '예약 변경 + 확인 메일 + 캘린더 반영을 한 번에 처리' },
  { id: 'e5', label: '⑤ AGI/피지컬', sub: '스스로 목표를 달성하는 AI', ability: '범용·자율적 문제 해결', change: '자율적 의사결정, 물리적 노동 대체', hotel: '(미래) 자동 체크인·로봇 컨시어지' },
]
function Evolution() {
  const [id, setId] = useState('e1')
  const idx = EVO.findIndex((e) => e.id === id)
  const e = EVO[idx]
  return (
    <Box title="AI 모델 진화 5단계">
      <div className="mb-3 flex items-center gap-1">
        {EVO.map((x, i) => (
          <div key={x.id} className="flex flex-1 items-center">
            <div className={`h-2 flex-1 rounded-full ${i <= idx ? 'bg-gradient-to-r from-cyan-400 to-gold' : 'bg-white/10'}`} />
          </div>
        ))}
      </div>
      <Tabs items={EVO} value={id} onChange={setId} />
      <Detail k="evo" id={id}>
        <div><b className="text-gold">핵심 능력</b> {e.ability}</div>
        <div><b className="text-gold">대표적 변화</b> {e.change}</div>
        <div className="mt-1 rounded-lg bg-gold/10 p-2"><b className="text-gold">🏨 호텔 적용</b> {e.hotel}</div>
      </Detail>
    </Box>
  )
}

/* ---------- 2. 자동화 4단계 ---------- */
const LV = [
  { id: 'l1', label: '① Co-pilot', human: '주도·결정', ai: '제안·초안', ex: '글 초안, 코드 자동완성', hotel: '고객 응대 이메일 초안 작성 보조', auto: 25 },
  { id: 'l2', label: '② 부분 자동화', human: '검토·승인', ai: '정해진 하위작업 수행', ex: '회의록 요약, 데이터 분류', hotel: '고객 리뷰·후기 자동 분류', auto: 50 },
  { id: 'l3', label: '③ 완전 자동화', human: '목표 설정·예외 처리', ai: '전체 작업 수행', ex: '정형 보고서 생성, 청구 처리', hotel: '정기 매출·객실점유율 보고서 자동 생성', auto: 75 },
  { id: 'l4', label: '④ 자율 에이전트', human: '위임·감독(Human-in-the-Loop)', ai: '목표 분해·실행·자가수정', ex: '멀티스텝 리서치, 자동 워크플로우', hotel: '컨시어지 요청 전체 처리(예약변경+안내메일+캘린더 등록)', auto: 100 },
]
function Levels() {
  const [id, setId] = useState('l1')
  const l = LV.find((x) => x.id === id)!
  return (
    <Box title="자동화 4단계 — 자율주행 Level처럼 AI 협업도 자율성 수준으로 구분">
      <Tabs items={LV} value={id} onChange={setId} />
      <div className="mt-3 grid grid-cols-[auto_1fr_auto] items-center gap-2 text-[12px]">
        <span>👤 사람 주도</span>
        <div className="h-3 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-cyan-400 to-gold" animate={{ width: `${l.auto}%` }} /></div>
        <span>🤖 AI 주도</span>
      </div>
      <Detail k="lv" id={id}>
        <div><b className="text-gold">인간의 역할</b> {l.human}</div>
        <div><b className="text-gold">AI의 역할</b> {l.ai}</div>
        <div><b className="text-gold">예시</b> {l.ex}</div>
        <div className="mt-1 rounded-lg bg-gold/10 p-2"><b className="text-gold">🏨 호텔 적용</b> {l.hotel}</div>
        <div className="mt-1 text-[12px] text-slate-400">단계가 올라갈수록 사람은 “실행자”에서 “감독자·설계자”로 이동합니다. 한 직무 안에서도 작업별로 단계가 다릅니다.</div>
      </Detail>
    </Box>
  )
}

/* ---------- 3. DX vs AX ---------- */
const DXAX = [
  { id: 'gen', label: '일반 카페/호텔', cafe: '직원이 주문·매출 계산', hotel: '프런트 직원이 수기로 객실 배정·장부 정리', mc: '' },
  { id: 'dx', label: 'DX', cafe: '키오스크·컴퓨터로 매출 관리', hotel: 'PMS로 예약·객실 현황을 디지털로 관리', mc: '키오스크 주문 처리 (주문의 편리성)' },
  { id: 'ax', label: 'AX', cafe: 'AI가 매출분석·재고·인력운영', hotel: '날씨·이벤트·과거 매출로 수요 예측 → 인력 배치·재료 준비 추천', mc: '날씨/시간/과거 매출 분석으로 직원 배치·재료 준비 추천' },
  { id: 'nat', label: 'AI Native', cafe: '처음부터 AI가 주문예측·재고관리·고객맞춤 추천', hotel: '처음부터 AI가 예약·객실·고객 경험을 설계하는 호텔', mc: '' },
]
function DxAx() {
  const [id, setId] = useState('dx')
  const d = DXAX.find((x) => x.id === id)!
  return (
    <Box title="일하는 방식의 진화 — 디지털화(DX)에서 AI 중심 재설계(AX)로">
      <Tabs items={DXAX} value={id} onChange={setId} />
      <Detail k="dx" id={id}>
        <div><b className="text-gold">☕ 카페 비유</b> {d.cafe}</div>
        <div className="mt-1 rounded-lg bg-gold/10 p-2"><b className="text-gold">🏨 호텔</b> {d.hotel}</div>
        {d.mc && <div className="mt-1 text-slate-300"><b>🍔 맥도날드 사례</b> {d.mc}</div>}
      </Detail>
    </Box>
  )
}

/* ---------- 4. 사람 승인 분류 게임 ---------- */
const RISK = [
  { t: '회의록을 요약하고 액션 아이템 정리', human: false, why: '검증 가능한 초안 작업입니다. 결과는 참석자가 확인하면 됩니다.' },
  { t: '불만 고객에게 환불·포인트 지급 실행', human: true, why: '금전 실행은 되돌리기 어려운(irreversible) 작업 → 사람 승인 필수.' },
  { t: '객실 사진에서 비품 누락 1차 점검', human: false, why: '보조 점검이며 최종 확인은 하우스키핑 담당이 합니다(추천안 단계).' },
  { t: '투숙객 여권번호를 퍼블릭 AI에 붙여넣어 번역', human: true, why: '개인정보(PII)를 외부 모델에 입력하는 작업 → 금지/사람 승인.' },
  { t: '신입 직원 채용 합불 최종 결정', human: true, why: '채용·평가는 개인에게 중대한 영향 → AI 단독 결정 금지.' },
  { t: '주말 패키지 홍보 문구 초안 작성(발행 전 검토)', human: false, why: '초안 작성은 AI에게 맡기되 발행 전 사람이 검토합니다.' },
]
function Risk() {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [fb, setFb] = useState<null | { ok: boolean; why: string }>(null)
  const done = i >= RISK.length
  const answer = (human: boolean) => {
    const r = RISK[i]
    const ok = r.human === human
    setFb({ ok, why: r.why })
    if (ok) setScore((s) => s + 1)
  }
  return (
    <Box title="체크리스트 게임 — 이 업무는 AI 단독으로 맡겨도 될까요?">
      {done ? (
        <div className="py-4 text-center">
          <div className="text-3xl font-extrabold text-gold">{score} / {RISK.length}</div>
          <p className="mt-1 text-sm text-slate-300">{score === RISK.length ? '완벽합니다! 고위험 업무는 사람이 승인하는 원칙을 잘 이해했습니다.' : '틀린 항목의 이유를 다시 읽어 보세요. 판단 기준은 “되돌릴 수 있는가·개인정보인가·중대한 영향인가”입니다.'}</p>
          <button className="btn mt-3" onClick={() => { setI(0); setScore(0); setFb(null) }}>다시 풀기</button>
        </div>
      ) : (
        <>
          <div className="text-[12px] text-slate-400">{i + 1} / {RISK.length}</div>
          <div className="my-2 rounded-xl bg-white/5 p-3 text-[15px] font-semibold text-white">{RISK[i].t}</div>
          {!fb ? (
            <div className="grid grid-cols-2 gap-2">
              <button className="btn btn-cyan" onClick={() => answer(false)}>🤖 AI 단독 가능</button>
              <button className="btn border-rose-300/50 bg-rose-400/15 text-rose-100" onClick={() => answer(true)}>🧑‍⚖️ 사람 승인 필수</button>
            </div>
          ) : (
            <div className={`rounded-xl border p-3 text-[13.5px] ${fb.ok ? 'border-emerald-300/50 bg-emerald-400/10' : 'border-rose-300/50 bg-rose-400/10'}`}>
              <b>{fb.ok ? '✅ 정답' : '❌ 오답'}</b> — {fb.why}
              <div><button className="btn btn-gold mt-2" onClick={() => { setI(i + 1); setFb(null) }}>다음</button></div>
            </div>
          )}
        </>
      )}
    </Box>
  )
}

/* ---------- 5. 5 Layers ---------- */
const LAYERS = [
  { n: '05', id: 'graph', name: 'GRAPH', ko: '그래프 엔지니어링', desc: 'AI가 정보를 연결하고 흐르게 하는 구조 설계', fn: '노드와 관계 정의 · 정보 연결 및 탐색 · 추론과 추천 지원', use: '연구문헌 연결 · 조직·데이터 관계 분석 · 맞춤형 추천 · 멀티에이전트 협업', color: '#10b981', lesson: 'L09' },
  { n: '04', id: 'loop', name: 'LOOP', ko: '루프 엔지니어링', desc: 'AI가 스스로 점검하고 반복하며 개선하는 과정 설계', fn: '결과 자동 점검 · 오류 수정 및 재시도 · 반복 계획 수립 · 종료 조건 설정', use: '코드 실행 및 수정 · 보고서 재생성 · 품질 자동 검증 · 지속적 성능 개선', color: '#3b82f6', lesson: 'L08' },
  { n: '03', id: 'harness', name: 'HARNESS', ko: '하네스 엔지니어링', desc: 'AI가 사용할 도구와 규칙을 연결하고 통제하는 시스템', fn: '외부 도구 연결 · 작업 규칙과 권한 설정 · 보안과 안전장치 · 실행 환경 제어', use: '문서 파일 사용 · 웹 검색 및 API 호출 · 코드 실행 환경 제공 · 민감정보 필터링', color: '#8b5cf6', lesson: 'L07' },
  { n: '02', id: 'context', name: 'CONTEXT', ko: '컨텍스트 엔지니어링', desc: 'AI가 현재 상황을 정확히 이해할 수 있도록 정보 제공', fn: '필요한 정보 선택·구성 · 데이터 검색 및 주입 · 누락 정보 보완 · 토큰 예산 관리', use: '문서 요약 시 참고 자료 제공 · 연구 주제에 맞는 자료 검색 · 긴 문서를 핵심만 추출 · 프로젝트 배경과 목적 공유', color: '#f97316', lesson: 'L06' },
  { n: '01', id: 'prompt', name: 'PROMPT', ko: '프롬프트 엔지니어링', desc: 'AI에게 원하는 작업을 정확히 지시하는 방법', fn: '명확한 지시 전달 · 출력 품질 향상 · 일관된 결과 생성 · 반복 사용 가능', use: '보고서 작성 · 데이터 분석 · 아이디어 생성 · 코드 생성', color: '#f43f5e', lesson: 'L05' },
]
function Layers() {
  const [id, setId] = useState('prompt')
  const openLesson = useStore((s) => s.openLesson)
  const openViewer = useStore((s) => s.openViewer)
  const cur = useStore((s) => s.lessonId)
  const l = LAYERS.find((x) => x.id === id)!
  return (
    <Box title="AI ENGINEERING: 5 LAYERS — 각 층은 서로 연결되어 아래에서 위로 쌓입니다">
      <div className="grid gap-1.5">
        {LAYERS.map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${id === x.id ? 'scale-[1.01] border-white/70' : 'border-white/10 opacity-80 hover:opacity-100'}`} style={{ background: `linear-gradient(90deg, ${x.color}${id === x.id ? '66' : '33'}, transparent)` }}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-extrabold text-white" style={{ background: x.color }}>{x.n}</span>
            <span className="min-w-0">
              <span className="block text-[13px] font-extrabold tracking-wide text-white">{x.name} ENGINEERING <span className="font-medium text-slate-300">· {x.ko}</span></span>
              <span className="block truncate text-[12px] text-slate-300">{x.desc}</span>
            </span>
            {cur === x.lesson && <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-navy">현재 강의</span>}
          </button>
        ))}
      </div>
      <Detail k="layer" id={id}>
        <div><b style={{ color: l.color }}>주요 기능</b> {l.fn}</div>
        <div><b style={{ color: l.color }}>활용 예시</b> {l.use}</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {cur !== l.lesson && <button className="btn btn-cyan" onClick={() => openLesson(l.lesson)}>이 층 강의 열기 ▶</button>}
          <button className="btn" onClick={() => openViewer('ai-engineering')}>🖼 원본 인포그래픽</button>
        </div>
      </Detail>
      <p className="mt-2 text-[12.5px] text-slate-300">하나씩 바꾸는 것이 아니라 5개가 함께 작동할 때 AI는 단순 채팅을 넘어 신뢰할 수 있는 결과를 만듭니다.</p>
    </Box>
  )
}

/* ---------- 6. 컨텍스트 믹서 ---------- */
const CTXS = [
  { id: 'q', label: '사용자 질문', sees: '“토요일 객실 가능한가요?”' },
  { id: 'hist', label: '이전 대화', sees: '고객이 가족 3인, 조식 포함을 원함' },
  { id: 'know', label: '검색된 지식(RAG)', sees: '요금표: 주말 340,000원, 조식 +45,000원' },
  { id: 'tool', label: '도구 결과', sees: 'PMS 조회: 토요일 디럭스 더블 잔여 4실' },
]
function Context() {
  const [on, setOn] = useState<Record<string, boolean>>({ q: true, hist: false, know: false, tool: false })
  const n = Object.values(on).filter(Boolean).length
  const reply = !on.q ? '(질문이 없어 답할 수 없습니다)' : on.know && on.tool ? '네, 토요일 디럭스 더블은 4실 남아 있습니다. 3인 가족 기준 조식 포함 385,000원이며 엑스트라 베드는 확인 후 안내드리겠습니다.' : on.know ? '주말 디럭스 더블은 340,000원, 조식 포함 시 +45,000원입니다. 객실 재고는 확인이 필요합니다.' : on.tool ? '토요일 잔여 객실은 4실입니다. 요금은 확인 후 안내드리겠습니다.' : '죄송합니다. 정확한 가능 여부와 요금은 확인 후 안내드리겠습니다.'
  return (
    <Box title="컨텍스트 믹서 — 켜진 정보만 AI가 ‘봅니다’">
      <div className="grid gap-1.5 sm:grid-cols-2">
        {CTXS.map((c) => (
          <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/12 bg-white/5 px-3 py-2 text-[13px]">
            <input type="checkbox" className="h-4 w-4 accent-orange-400" checked={on[c.id]} onChange={() => setOn({ ...on, [c.id]: !on[c.id] })} />
            <span><b>{c.label}</b><br /><span className="text-slate-400">{c.sees}</span></span>
          </label>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/12 bg-black/25 p-3 text-[13px]"><b className="text-orange-300">모델이 보는 정보 ({n}/4)</b><ul className="mt-1 list-disc pl-4 text-slate-200">{CTXS.filter((c) => on[c.id]).map((c) => <li key={c.id}>{c.sees}</li>)}{n === 0 && <li className="list-none text-slate-500">없음</li>}</ul></div>
        <div className="rounded-xl border border-gold/40 bg-gold/10 p-3 text-[13px]"><b className="text-gold">AI 응답(예시)</b><p className="mt-1 text-slate-100">{reply}</p></div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[12px] text-slate-300">응답 정확도 <div className="h-2 flex-1 overflow-hidden rounded bg-white/10"><motion.div className="h-full bg-gradient-to-r from-orange-400 to-gold" animate={{ width: `${(n / 4) * 100}%` }} /></div></div>
    </Box>
  )
}

/* ---------- 7. 하네스 ---------- */
const HAR = [
  { id: 'tools', label: '도구 연결', sub: '파일·앱·API', pos: 'left-0 top-0', detail: 'PMS 조회, Google Drive, Gmail, Slack을 MCP 커넥터로 연결합니다.', hotel: '컨시어지 에이전트가 PMS 조회·메일 초안·캘린더 등록만 사용' },
  { id: 'perm', label: '권한과 제어', sub: '어디까지 할 수 있는가', pos: 'right-0 top-0', detail: '읽기/쓰기 구분, 자동 실행/승인 필요/금지 분류, Manual vs Skip approvals.', hotel: '환불·결제는 금지 또는 사람 승인 단계로 고정' },
  { id: 'rules', label: '규칙 설정', sub: '안전·윤리·형식', pos: 'left-0 bottom-0', detail: '시스템 프롬프트·CLAUDE.md로 안전 규칙, 톤, 보고 형식을 강제합니다.', hotel: '“자료에 없으면 추측하지 않는다”, “고객정보는 마스킹”' },
  { id: 'mon', label: '모니터링', sub: '사용량·보안·로그', pos: 'right-0 bottom-0', detail: '실행 로그, 사용량·비용, 이상 행동 알림을 기록합니다.', hotel: '야간 점검 에이전트의 실행 로그를 매일 아침 확인' },
]
function Harness() {
  const [id, setId] = useState('tools')
  const h = HAR.find((x) => x.id === id)!
  return (
    <Box title="하네스 허브 — AI 모델을 둘러싼 4가지 통제 장치">
      <div className="relative mx-auto grid h-[210px] max-w-md grid-cols-2 gap-x-24 gap-y-3 sm:h-[190px]">
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-center text-[12px] font-extrabold text-white shadow-lg shadow-violet-500/40"><motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2.2 }}>AI<br />모델</motion.span></div>
        {HAR.map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} className={`rounded-xl border px-2 py-3 text-center text-[13px] font-bold transition ${id === x.id ? 'border-gold bg-gold/20 text-gold' : 'border-white/15 bg-white/5 text-white hover:border-white/40'}`}>
            {x.label}<span className="block text-[11px] font-normal opacity-75">{x.sub}</span>
          </button>
        ))}
      </div>
      <Detail k="har" id={id}>
        <div>{h.detail}</div>
        <div className="mt-1 rounded-lg bg-gold/10 p-2"><b className="text-gold">🏨 호텔 적용</b> {h.hotel}</div>
      </Detail>
    </Box>
  )
}

/* ---------- 8. 루프 애니메이션 ---------- */
const LOOP_STEPS = ['실행', '결과 확인', '기준 충족?', '문제 수정', '다시 시도', '완료']
function Loop() {
  const [run, setRun] = useState(false)
  const [step, setStep] = useState(0)
  const [iter, setIter] = useState(1)
  const [log, setLog] = useState<string[]>([])
  const CRITERIA = ['총 견적 ≤ 예산', '4개 섹션 모두 포함', '미확인 정보 표시']
  useEffect(() => {
    if (!run) return
    const id = setTimeout(() => {
      if (step === 0) { setStep(1); return }
      if (step === 1) { setStep(2); return }
      if (step === 2) {
        const pass = iter >= 3
        setLog((l) => [...l, `${iter}회차 점검: ${pass ? '모든 기준 PASS' : iter === 1 ? '총 견적 > 예산 → FAIL' : '미확인 정보 표시 누락 → FAIL'}`])
        if (pass) setStep(5)
        else setStep(3)
        return
      }
      if (step === 3) { setStep(4); return }
      if (step === 4) { setIter((n) => n + 1); setStep(0); return }
      if (step === 5) setRun(false)
    }, 900)
    return () => clearTimeout(id)
  }, [run, step, iter])
  const start = () => { setLog([]); setIter(1); setStep(0); setRun(true) }
  return (
    <Box title="루프 엔지니어링 — 기준을 만족할 때까지 AI가 스스로 점검·수정">
      <div className="flex flex-wrap items-center gap-2">
        {LOOP_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <motion.div animate={{ scale: run && step === i ? 1.12 : 1, backgroundColor: run && step === i ? '#d4af37' : i === 2 ? '#1e3a8a' : i === 5 ? '#065f46' : '#1d2f63' }} className={`rounded-xl border border-white/20 px-3 py-2 text-[13px] font-bold ${run && step === i ? 'text-navy' : 'text-white'}`}>{s}</motion.div>
            {i < LOOP_STEPS.length - 1 && <span className="text-slate-500">{i === 2 ? '아니오→' : '→'}</span>}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button className="btn btn-gold" onClick={start} disabled={run}>▶ 루프 실행</button>
        <span className="text-sm text-cyan-200">반복 {iter}회차 / 최대 3회</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/12 bg-black/25 p-3 text-[13px]"><b className="text-gold">검사 기준(종료 조건)</b><ul className="mt-1 list-disc pl-4 text-slate-200">{CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul></div>
        <div className="rounded-xl border border-white/12 bg-black/25 p-3 text-[13px]"><b className="text-gold">실행 로그</b><ul className="mt-1 space-y-0.5 text-slate-200">{log.map((l, i) => <li key={i}>• {l}</li>)}{!log.length && <li className="text-slate-500">▶ 버튼을 눌러 시작하세요</li>}</ul></div>
      </div>
    </Box>
  )
}

/* ---------- 9. 에이전트 파이프라인 ---------- */
const AGENT_STEPS = [
  { n: '목표 위임', d: '“송년회 연회 제안서를 만들어줘” (사람)', icon: '🧑' },
  { n: '계획(Plan)', d: '작업 순서·타임라인 설계', icon: '🗺️' },
  { n: '조사(Research)', d: '경쟁 호텔 패키지 병렬 수집', icon: '🔎' },
  { n: '작성(Content)', d: '제안서 핵심 텍스트 초안', icon: '✍️' },
  { n: '포맷(PPTX/Doc)', d: '파일로 디자인·저장', icon: '🎨' },
  { n: '검수(QA)', d: '견적·오탈자 교차 검증', icon: '🛡️' },
  { n: '사람 승인', d: '최종 검토 후 발송 (Human-in-the-Loop)', icon: '🧑‍⚖️' },
]
function Agent() {
  const [i, setI] = useState(-1)
  const [run, setRun] = useState(false)
  useEffect(() => {
    if (!run) return
    if (i >= AGENT_STEPS.length - 1) { setRun(false); return }
    const id = setTimeout(() => setI((n) => n + 1), 800)
    return () => clearTimeout(id)
  }, [run, i])
  return (
    <Box title="AI 에이전트 오케스트레이션 — 사람은 ‘지휘자’">
      <ol className="space-y-1.5">
        {AGENT_STEPS.map((s, k) => (
          <motion.li key={s.n} animate={{ opacity: k <= i ? 1 : 0.45, x: k === i ? 6 : 0 }} className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-[13px] ${k === i ? 'border-gold bg-gold/15' : k < i ? 'border-emerald-300/40 bg-emerald-300/10' : 'border-white/10 bg-white/5'}`}>
            <span className="text-xl">{s.icon}</span>
            <span><b className="text-white">{s.n}</b> <span className="text-slate-300">— {s.d}</span></span>
            {k < i && <span className="ml-auto text-emerald-300">✓</span>}
            {k === i && run && <span className="ml-auto animate-pulse text-gold">처리 중</span>}
          </motion.li>
        ))}
      </ol>
      <div className="mt-3 flex gap-2">
        <button className="btn btn-gold" onClick={() => { setI(0); setRun(true) }} disabled={run}>▶ 에이전트 실행</button>
        <button className="btn" onClick={() => { setRun(false); setI(-1) }}>초기화</button>
      </div>
    </Box>
  )
}

/* ---------- 11. Claude 3종 ---------- */
const CL = [
  { id: 'chat', label: 'Claude AI (Chat)', def: '대화형 지능형 비서', who: '모든 일반 사용자', how: '1:1 대화·프롬프트 기반', use: '보고서 초안, 요약, 아이디에이션', feat: '유려한 문장력, 거대 문맥(200K)', hotel: '프로모션 문구·응대 이메일 초안' },
  { id: 'cowork', label: 'Claude Cowork', def: '비개발자용 자율 업무 에이전트', who: '비기술직 지식근로자(마케팅·영업·재무 등)', how: '목표 위임 시 스스로 계획·다단계 자율 수행', use: '파일 정리, 리포트 자율 제작, 작업 예약', feat: '로컬 파일 접근, 외부 앱 연결(Gmail·Drive·Slack), 작업 예약·병렬 처리', hotel: '월간 F&B 매출 폴더 → 대시보드·보고서 자동 제작 (호텔 관리자에게 가장 가까운 도구)' },
  { id: 'code', label: 'Claude Code', def: '개발자용 터미널 기반 에이전트', who: '전문 소프트웨어 개발자·DevOps', how: '터미널 명령으로 코드베이스 자율 수행', use: '버그 수정, 신규 프로젝트, Git 워크플로우', feat: 'CLI 기반, git 통합, 코드베이스 전체 분석', hotel: 'KPI 대시보드 프로토타입 제작 → GitHub·Vercel 배포 (바이브 코딩)' },
]
function Claude3() {
  const [id, setId] = useState('cowork')
  const c = CL.find((x) => x.id === id)!
  const rows: [string, string][] = [['핵심 정의', c.def], ['최적 사용자', c.who], ['작동 방식', c.how], ['대표 활용', c.use], ['핵심 특징', c.feat]]
  return (
    <Box title="같은 Claude 모델, 다른 작동 방식">
      <Tabs items={CL.map((x) => ({ id: x.id, label: x.label }))} value={id} onChange={setId} />
      <Detail k="cl" id={id}>
        <dl className="grid grid-cols-[88px_1fr] gap-x-3 gap-y-1">
          {rows.map(([k, v]) => (<Fragment key={k}><dt className="font-semibold text-gold">{k}</dt><dd className="text-slate-100">{v}</dd></Fragment>))}
        </dl>
        <div className="mt-2 rounded-lg bg-gold/10 p-2"><b className="text-gold">🏨 호텔 적용</b> {c.hotel}</div>
      </Detail>
    </Box>
  )
}

/* ---------- 12. 모델 선택 ---------- */
const MODELS = [
  { id: 'm1', task: '최고 성능이 필요한 최난도·초장기 자율 작업', rec: 'Fable 5 · Opus 4.8', note: '$10/$50, $5/$25 (입력/출력, M토큰)' },
  { id: 'm2', task: '일반 글쓰기·분석·코딩 등 매일 쓰는 업무', rec: 'Sonnet 4.6 ~ Sonnet 5', note: '속도·지능 최적 조합 · 시작점으로 추천' },
  { id: 'm3', task: '대량 요약·분류·태깅 등 비용 민감 작업', rec: 'Haiku 4.5', note: '$1/$5 · 압도적 속도·효율' },
  { id: 'm4', task: '매우 큰 코드베이스·문서 전체 투입', rec: 'Opus 4.8 · Sonnet 5 (1M 컨텍스트)', note: 'Claude Code에서 1M 컨텍스트 활용' },
]
function Models() {
  const [id, setId] = useState('m2')
  const m = MODELS.find((x) => x.id === id)!
  return (
    <Box title="어떤 업무에 어떤 모델? (강의자료 2026.07.13 기준 · 최신값은 공식 문서 확인)">
      <div className="grid gap-1.5">
        {MODELS.map((x) => (
          <button key={x.id} onClick={() => setId(x.id)} className={`rounded-xl border px-3 py-2 text-left text-[13px] transition ${id === x.id ? 'border-gold bg-gold/15 text-white' : 'border-white/12 bg-white/5 text-slate-200 hover:border-white/40'}`}>{x.task}</button>
        ))}
      </div>
      <Detail k="mo" id={id}>
        <div><b className="text-gold">추천 모델</b> {m.rec}</div>
        <div className="text-slate-300">{m.note}</div>
        <div className="mt-1 text-[12.5px] text-cyan-200">기본 전략: Sonnet으로 시작 → 막히면 Opus로 승급 → 단순·대량 작업은 Haiku. effort(사고 강도)도 사용량에 영향을 줍니다.</div>
      </Detail>
    </Box>
  )
}

/* ---------- 13. 바이브코딩 파이프라인 ---------- */
const VIBE = [
  { n: '아이디어', d: 'LLM에게 자연어로 설명', icon: '💡' },
  { n: 'SPEC.md', d: '★ 가장 중요한 단계: 요구사항·구조·스택·범위', icon: '📝' },
  { n: '코드', d: 'Claude Code가 작은 단위로 구현·즉시 검증', icon: '⌨️' },
  { n: 'GitHub', d: '커밋·브랜치·PR로 버전 관리 (.env 제외)', icon: '🐙' },
  { n: 'Vercel', d: 'push → 자동 빌드(CI/CD) → 배포', icon: '▲' },
  { n: 'URL', d: 'HTTPS 주소로 PC·태블릿·스마트폰 접속', icon: '🌐' },
]
function VibeFlow() {
  const [i, setI] = useState(-1)
  const [run, setRun] = useState(false)
  useEffect(() => {
    if (!run) return
    if (i >= VIBE.length - 1) { setRun(false); return }
    const id = setTimeout(() => setI((n) => n + 1), 750)
    return () => clearTimeout(id)
  }, [run, i])
  return (
    <Box title="아이디어 → 코드 → 배포 → 서비스">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {VIBE.map((s, k) => (
          <motion.div key={s.n} animate={{ scale: k === i ? 1.04 : 1 }} className={`rounded-xl border p-2.5 text-[12.5px] ${k === i ? 'border-gold bg-gold/20' : k < i ? 'border-emerald-300/50 bg-emerald-300/10' : 'border-white/12 bg-white/5'}`}>
            <div className="text-xl">{s.icon}</div>
            <b className="text-white">{s.n}</b>
            <div className="text-slate-300">{s.d}</div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <button className="btn btn-gold" onClick={() => { setI(0); setRun(true) }} disabled={run}>▶ 배포 흐름 재생</button>
        <button className="btn" onClick={() => { setRun(false); setI(-1) }}>초기화</button>
      </div>
      <p className="mt-2 text-[12.5px] text-slate-300">바이브 코딩 4대 원칙: ① 명확한 의도 ② 작은 단위 반복 ③ 즉시 검증 ④ 위임하되 통제</p>
    </Box>
  )
}

export function VisualBlock({ kind, title }: { kind: VisualKind; title?: string }) {
  const map: Record<VisualKind, ReactNode> = {
    evolution: <Evolution />,
    levels: <Levels />,
    dxax: <DxAx />,
    risk: <Risk />,
    layers: <Layers />,
    context: <Context />,
    harness: <Harness />,
    loop: <Loop />,
    agent: <Agent />,
    graph: <Box title="호텔 운영 지식그래프"><HotelGraph /></Box>,
    claude3: <Claude3 />,
    models: <Models />,
    vibeflow: <VibeFlow />,
  }
  return (
    <figure className="my-4" aria-label={title}>
      {title && <figcaption className="mb-1.5 text-[12.5px] font-semibold text-gold">▶ 인터랙티브 · {title}</figcaption>}
      {map[kind]}
    </figure>
  )
}
