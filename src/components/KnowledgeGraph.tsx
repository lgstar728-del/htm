import { useMemo, useState } from 'react'
import { courses } from '../data/courses'
import { lessonById } from '../data/lessons'
import { useStore } from '../utils/store'

interface N { id: string; label: string; x: number; y: number; kind: 'person' | 'place' | 'event' | 'concept'; info: string }
interface E { a: string; b: string; label: string }

const KIND = { person: '#38bdf8', place: '#34d399', event: '#fb923c', concept: '#c084fc' }
const KIND_LABEL = { person: '사람', place: '장소', event: '사건', concept: '개념' }

const NODES: N[] = [
  { id: 'guest', label: '가족 고객', x: 90, y: 90, kind: 'person', info: '주말 1~2박, 아이 동반. 조식·키즈 시설을 중시합니다.' },
  { id: 'resv', label: '주말 예약', x: 250, y: 170, kind: 'event', info: '토요일 1박 디럭스 더블 + 조식 포함 예약.' },
  { id: 'room', label: '디럭스 더블', x: 420, y: 90, kind: 'place', info: '엑스트라 베드 가능, 14층 인접 연회장(소음 주의).' },
  { id: 'review', label: '조식 불만 리뷰', x: 120, y: 260, kind: 'event', info: '"조식 대기가 길었다"는 이전 투숙 리뷰.' },
  { id: 'fnb', label: '조식 서비스', x: 330, y: 280, kind: 'concept', info: '조식당 운영 시간·혼잡도·좌석 정책.' },
  { id: 'concert', label: '인근 콘서트', x: 520, y: 220, kind: 'event', info: '토요일 대형 콘서트 → 수요·소음·조식 혼잡 영향.' },
  { id: 'staff', label: '컨시어지', x: 520, y: 60, kind: 'person', info: '사전 안내·픽업 조정을 담당하는 직원/에이전트.' },
]
const EDGES: E[] = [
  { a: 'guest', b: 'resv', label: '예약함' },
  { a: 'resv', b: 'room', label: '배정됨' },
  { a: 'guest', b: 'review', label: '작성함' },
  { a: 'review', b: 'fnb', label: '언급함' },
  { a: 'resv', b: 'fnb', label: '포함 서비스' },
  { a: 'concert', b: 'resv', label: '영향' },
  { a: 'concert', b: 'fnb', label: '혼잡 가중' },
  { a: 'staff', b: 'guest', label: '안내' },
  { a: 'room', b: 'concert', label: '인접 소음' },
]

const INFER: Record<string, string> = {
  guest: '추론: 조식 불만 이력 + 토요일 콘서트 → 사전에 "조식 사전 예약석·늦은 시간대"를 안내하면 불만 재발을 줄일 수 있습니다.',
  resv: '추론: 콘서트 영향으로 해당 일자 수요 상승 → 요금 인상 검토와 소음 민원 대비가 동시에 필요합니다.',
  room: '추론: 연회장 인접 객실 → 가족 고객에게는 조용한 층 객실 업그레이드를 먼저 제안합니다.',
  review: '추론: 리뷰 → 서비스 개선 과제로 연결, 같은 고객에게 개선 사항을 회신합니다.',
  fnb: '추론: 콘서트 날 조식 혼잡 예상 → 인력 추가 배치와 시간대 분산 안내.',
  concert: '추론: 외부 이벤트가 예약·F&B·객실 소음에 동시에 영향을 주는 핵심 허브 노드입니다.',
  staff: '추론: 컨시어지(에이전트)는 고객 노드와 서비스 노드를 연결해 맞춤 추천을 실행합니다.',
}

/** 호텔 운영 지식그래프 — 노드를 눌러 연결과 추론 예시를 확인 */
export function HotelGraph() {
  const [sel, setSel] = useState<string>('guest')
  const node = NODES.find((n) => n.id === sel)!
  const linked = new Set(EDGES.filter((e) => e.a === sel || e.b === sel).flatMap((e) => [e.a, e.b]))
  return (
    <div className="space-y-2">
      <svg viewBox="0 0 620 340" className="w-full rounded-xl bg-navy/60" role="img" aria-label="호텔 운영 지식그래프">
        {EDGES.map((e) => {
          const a = NODES.find((n) => n.id === e.a)!
          const b = NODES.find((n) => n.id === e.b)!
          const on = e.a === sel || e.b === sel
          return (
            <g key={e.a + e.b} opacity={on ? 1 : 0.35}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? '#d4af37' : '#64748b'} strokeWidth={on ? 2.5 : 1.5} />
              <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 4} fontSize="10" fill={on ? '#fde68a' : '#94a3b8'} textAnchor="middle">{e.label}</text>
            </g>
          )
        })}
        {NODES.map((n) => (
          <g key={n.id} onClick={() => setSel(n.id)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setSel(n.id)} aria-label={n.label}>
            <circle cx={n.x} cy={n.y} r={n.id === sel ? 30 : 24} fill={KIND[n.kind]} fillOpacity={linked.has(n.id) || n.id === sel ? 0.95 : 0.4} stroke={n.id === sel ? '#fff' : 'none'} strokeWidth="3" style={{ transition: 'all .2s' }} />
            <text x={n.x} y={n.y + 4} fontSize="11" fontWeight="700" fill="#06122c" textAnchor="middle">{n.label.length > 6 ? n.label.slice(0, 6) : n.label}</text>
            {n.label.length > 6 && <text x={n.x} y={n.y + 40} fontSize="10" fill="#cbd5e1" textAnchor="middle">{n.label}</text>}
          </g>
        ))}
      </svg>
      <div className="flex flex-wrap gap-2 text-[12px]">
        {Object.entries(KIND_LABEL).map(([k, v]) => (<span key={k} className="flex items-center gap-1"><span className="h-3 w-3 rounded-full" style={{ background: KIND[k as keyof typeof KIND] }} />{v}</span>))}
      </div>
      <div className="rounded-xl border border-gold/40 bg-gold/10 p-3 text-[13.5px]">
        <div className="font-bold text-gold">{node.label} <span className="text-[12px] font-normal text-slate-300">({KIND_LABEL[node.kind]})</span></div>
        <p className="mt-1 text-slate-200">{node.info}</p>
        <p className="mt-1 text-cyan-200">{INFER[node.id]}</p>
      </div>
    </div>
  )
}

/** 12개 강의 간 관계 지식그래프(전역 모달) */
export function KnowledgeGraphModal() {
  const open = useStore((s) => s.graphOpen)
  const setOpen = useStore((s) => s.setGraphOpen)
  const openLesson = useStore((s) => s.openLesson)
  const [hover, setHover] = useState<string | null>(null)

  const layout = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {}
    // 5개 코스를 가로 띠로 배치, 각 코스 안의 강의는 가로로 나열
    courses.forEach((c, ci) => {
      c.lessonIds.forEach((id, li) => {
        const n = c.lessonIds.length
        pos[id] = { x: 70 + ((li + 0.5) / Math.max(n, 3)) * 520 + (n < 3 ? 90 : 0) - 20, y: 50 + ci * 78 }
      })
    })
    return pos
  }, [])

  const links: [string, string][] = [['L01', 'L02'], ['L02', 'L03'], ['L03', 'L04'], ['L04', 'L05'], ['L05', 'L06'], ['L06', 'L07'], ['L07', 'L08'], ['L08', 'L09'], ['L03', 'L07'], ['L05', 'L10'], ['L10', 'L11'], ['L05', 'L11'], ['L07', 'L10'], ['L10', 'L12'], ['L08', 'L12'], ['L06', 'L10']]
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-3 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="glass max-h-[92dvh] w-full max-w-4xl overflow-auto rounded-2xl p-4 md:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gold md:text-xl">🕸️ AI 교육 지식그래프</h2>
            <p className="text-[13px] text-slate-300">12개 강의의 선수 관계입니다. 노드를 누르면 해당 강의가 열립니다.</p>
          </div>
          <button className="btn btn-gold" onClick={() => setOpen(false)}>닫기</button>
        </div>
        <svg viewBox="0 0 640 400" className="w-full rounded-xl bg-navy/70" role="img" aria-label="강의 간 관계 그래프">
          {links.map(([a, b]) => {
            const pa = layout[a]
            const pb = layout[b]
            const on = hover === a || hover === b
            return <line key={a + b} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={on ? '#d4af37' : '#475a85'} strokeWidth={on ? 2.5 : 1.2} opacity={hover && !on ? 0.2 : 0.8} />
          })}
          {courses.map((c, ci) => (
            <text key={c.id} x="8" y={54 + ci * 78} fontSize="10" fill={c.color} fontWeight="700" transform={`rotate(-90 12 ${54 + ci * 78})`} textAnchor="middle">{c.title.slice(0, 6)}</text>
          ))}
          {courses.flatMap((c) =>
            c.lessonIds.map((id) => {
              const l = lessonById(id)!
              const p = layout[id]
              return (
                <g key={id} style={{ cursor: 'pointer' }} onMouseEnter={() => setHover(id)} onMouseLeave={() => setHover(null)} onClick={() => { setOpen(false); openLesson(id) }} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && (setOpen(false), openLesson(id))} aria-label={l.title}>
                  <circle cx={p.x} cy={p.y} r={hover === id ? 27 : 23} fill={c.color} fillOpacity={0.9} stroke="#fff" strokeOpacity={hover === id ? 1 : 0.3} strokeWidth="2" />
                  <text x={p.x} y={p.y + 5} fontSize="15" textAnchor="middle">{l.icon}</text>
                  <text x={p.x} y={p.y + 41} fontSize="10" fill="#e2e8f0" textAnchor="middle">{`L${String(l.no).padStart(2, '0')} ${l.title.length > 13 ? l.title.slice(0, 13) + '…' : l.title}`}</text>
                </g>
              )
            }),
          )}
        </svg>
        <div className="mt-3 flex flex-wrap gap-2">
          {courses.map((c) => (<span key={c.id} className="flex items-center gap-1.5 text-[12px]"><span className="h-3 w-3 rounded-full" style={{ background: c.color }} />{c.title}</span>))}
        </div>
      </div>
    </div>
  )
}
