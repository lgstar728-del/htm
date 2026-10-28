import { useMemo, useState } from 'react'
import { ApprovalGate, Card, Field, Pill } from './shared'

// 호텔 정책 문서(가상). 각 문서는 문장 단위로 청킹 가능
const DOCS: { id: string; title: string; sentences: string[] }[] = [
  { id: 'D1', title: '취소·변경 정책', sentences: ['체크인 3일 전 18시까지는 위약금 없이 취소할 수 있습니다.', '이후 취소하면 첫날 요금의 50%가 위약금으로 부과됩니다.', '날짜 변경은 해당 일자 객실 재고가 있을 때만 가능합니다.'] },
  { id: 'D2', title: '조식 안내', sentences: ['조식은 06:30부터 10:00까지 1층 레스토랑에서 제공됩니다.', '조식 2인 추가 요금은 45,000원입니다.', '주말에는 대기가 길 수 있어 사전 예약석을 권장합니다.'] },
  { id: 'D3', title: '주차 안내', sentences: ['투숙객은 객실당 1일 1대 주차가 무료입니다.', '추가 차량은 1일 20,000원입니다.', '전기차 충전기는 지하 2층에 4기가 있습니다.'] },
  { id: 'D4', title: '반려동물 정책', sentences: ['소형견(10kg 이하)은 지정 객실에서 동반 투숙할 수 있습니다.', '반려동물 1마리당 청소비 30,000원이 부과됩니다.', '공용 시설(레스토랑·수영장) 출입은 제한됩니다.'] },
  { id: 'D5', title: '체크인·체크아웃', sentences: ['체크인은 15:00, 체크아웃은 11:00입니다.', '프론트는 24시간 운영되며 심야 도착은 사전 안내가 필요합니다.', '늦은 체크아웃은 재고에 따라 시간당 요금이 부과됩니다.'] },
  { id: 'D6', title: '어린이·엑스트라 베드', sentences: ['만 12세 미만 어린이는 기존 침대 사용 시 추가 요금이 없습니다.', '엑스트라 베드는 1박 60,000원이며 사전 요청이 필요합니다.'] },
]

const SAMPLES = ['체크인 며칠 전까지 무료로 취소할 수 있나요?', '강아지랑 같이 묵을 수 있어요? 비용은요?', '조식 2인 추가하면 얼마예요?', '수영장 야간 개장 시간은?']

const grams = (t: string) => {
  const c = t.replace(/[^가-힣a-zA-Z0-9]/g, '')
  const out = new Set<string>()
  for (let i = 0; i < c.length - 1; i++) out.add(c.slice(i, i + 2))
  return out
}
const score = (q: Set<string>, t: string) => {
  const g = grams(t)
  let hit = 0
  q.forEach((x) => g.has(x) && hit++)
  return q.size ? hit / q.size : 0
}

export default function Rag() {
  const [q, setQ] = useState(SAMPLES[0])
  const [unit, setUnit] = useState<'doc' | 'sentence'>('sentence')
  const [k, setK] = useState(2)
  const chunks = useMemo(() => (unit === 'doc' ? DOCS.map((d) => ({ id: d.id, title: d.title, text: d.sentences.join(' ') })) : DOCS.flatMap((d) => d.sentences.map((s, i) => ({ id: `${d.id}-${i + 1}`, title: d.title, text: s })))), [unit])
  const ranked = useMemo(() => {
    const qg = grams(q)
    return chunks.map((c) => ({ ...c, s: score(qg, c.title + ' ' + c.text) })).sort((a, b) => b.s - a.s)
  }, [q, chunks])
  const top = ranked.slice(0, k).filter((r) => r.s >= 0.18)
  const answer = top.length ? `${top.map((t) => t.text).join(' ')}\n\n[근거: ${top.map((t) => `${t.title} (${t.id})`).join(', ')}]` : '제공된 문서에서 관련 내용을 찾지 못했습니다. 확인 후 안내드리겠습니다. (자료에 없는 내용은 추측하지 않습니다)'
  const llmOnly = '일반적으로 호텔마다 정책이 다르며, 보통 체크인 며칠 전까지 무료 취소가 가능하고 반려동물은 호텔별로 허용 여부가 다릅니다. 정확한 내용은 호텔에 문의하세요. (※ LLM은 이 호텔의 정책 문서를 학습하지 않았으므로 구체적 수치를 지어낼 위험이 있습니다)'
  const note = unit === 'doc' && top[0] ? '문서 전체를 한 덩어리로 가져오면 질문과 무관한 문장까지 섞여 답이 길고 부정확해질 수 있습니다.' : '문장 단위로 쪼개면 필요한 근거만 정확히 찾지만 앞뒤 맥락이 잘릴 수 있습니다.'
  return (
    <div className="space-y-3">
      <Field label="질문 (직접 수정 가능)">
        <div className="mb-2 flex flex-wrap gap-2">{SAMPLES.map((s) => <button key={s} className={`btn !min-h-8 !text-[12.5px] ${q === s ? 'btn-cyan' : ''}`} onClick={() => setQ(s)}>{s.slice(0, 16)}…</button>)}</div>
        <input className="field" value={q} onChange={(e) => setQ(e.target.value)} />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="청킹(Chunking) 단위">
          <select className="field" value={unit} onChange={(e) => setUnit(e.target.value as 'doc' | 'sentence')}>
            <option value="sentence">문장 단위 (정밀)</option>
            <option value="doc">문서 전체 (큰 덩어리)</option>
          </select>
        </Field>
        <Field label={`검색 개수 top-k = ${k}`}><input type="range" min={1} max={4} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-cyan-400" /></Field>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card title="① LLM 단독 (학습된 지식만)" tone="red">{llmOnly}</Card>
        <Card title="② RAG (내 문서 검색 + 생성)" tone="cyan"><pre className="whitespace-pre-wrap font-sans">{answer}</pre></Card>
      </div>
      <Card title="검색 결과 (질문과의 유사도 · 2글자 겹침 기반 시뮬레이션)">
        <ul className="space-y-1.5">
          {ranked.slice(0, 5).map((r, i) => (
            <li key={r.id} className={`rounded-lg border px-2.5 py-1.5 text-[12.5px] ${i < k && r.s >= 0.18 ? 'border-cyan-300/50 bg-cyan-300/10' : 'border-white/10 opacity-70'}`}>
              <div className="flex items-center gap-2"><Pill tone={i < k && r.s >= 0.18 ? 'green' : 'cyan'}>{r.id}</Pill><b>{r.title}</b><span className="ml-auto tabular-nums text-gold">{r.s.toFixed(2)}</span></div>
              <div className="mt-0.5 text-slate-300">{r.text}</div>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-slate-400">※ 실제 RAG는 임베딩(의미 벡터)과 벡터DB, 리랭킹을 사용합니다. 여기서는 개념 이해용 간이 검색입니다. {note}</p>
      </Card>
      <ApprovalGate simId="rag" title="RAG 답변 승인" text={answer} checks={['답변이 검색된 근거 문장과 일치한다', '자료에 없는 내용은 "확인 필요"로 처리됐다', '요금·정책 최신 여부를 문서 담당자가 확인했다']} />
    </div>
  )
}
