import { courses } from '../data/courses'
import { lessonById } from '../data/lessons'
import { simById } from '../data/simulations'
import { hotelById } from '../data/hotels'
import { STEP_IDS, lessonCompletion, useStore } from '../utils/store'

export function Dashboard() {
  const open = useStore((s) => s.dashOpen)
  const setOpen = useStore((s) => s.setDashOpen)
  const progress = useStore((s) => s.progress)
  const approvals = useStore((s) => s.approvals)
  const openLesson = useStore((s) => s.openLesson)
  const reset = useStore((s) => s.resetProgress)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-3 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="glass max-h-[92dvh] w-full max-w-3xl overflow-auto rounded-2xl p-4 scroll-thin md:p-6" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="학습 현황">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-gold">📊 학습 현황</h2>
            <p className="text-[13px] text-slate-300">진도·퀴즈·승인 이력은 이 브라우저에만 저장됩니다. (서버 전송 없음)</p>
          </div>
          <button className="btn btn-gold" onClick={() => setOpen(false)}>닫기</button>
        </div>
        <div className="space-y-4">
          {courses.map((c) => (
            <section key={c.id}>
              <div className="mb-1.5 flex items-center gap-2"><span className="h-3 w-3 rounded-full" style={{ background: c.color }} /><b className="text-white">{c.title}</b><span className="text-[12px] text-slate-400">{c.desc}</span></div>
              <div className="grid gap-1.5">
                {c.lessonIds.map((id) => {
                  const l = lessonById(id)!
                  const p = progress[id]
                  const comp = lessonCompletion(p)
                  return (
                    <button key={id} onClick={() => { setOpen(false); openLesson(id) }} className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-3 py-2 text-left hover:border-gold">
                      <span className="text-xl">{l.icon}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold text-white">L{String(l.no).padStart(2, '0')} {l.title}</span>
                        <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-white/10"><span className="block h-full bg-gradient-to-r from-cyan-400 to-gold" style={{ width: `${comp * 100}%` }} /></span>
                      </span>
                      <span className="text-[12px] tabular-nums text-slate-300">{Math.round(comp * STEP_IDS.length)}/{STEP_IDS.length}</span>
                      <span className="w-14 text-right text-[12px] font-bold text-gold">{p?.quizBest ? `퀴즈 ${p.quizBest.score}/${p.quizBest.total}` : '—'}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
          <section>
            <b className="text-white">🧑‍⚖️ 사람 승인 이력 ({approvals.length})</b>
            {approvals.length === 0 ? <p className="mt-1 text-[13px] text-slate-400">아직 승인한 AI 결과가 없습니다. 실습에서 결과를 검토·승인하면 기록됩니다.</p> : (
              <ul className="mt-1.5 space-y-1">
                {approvals.slice(0, 12).map((a, i) => (
                  <li key={a.at + '-' + i} className="flex flex-wrap items-center gap-2 rounded-lg bg-white/[0.04] px-3 py-1.5 text-[12.5px]">
                    <span>{simById(a.simId)?.icon}</span><span className="font-semibold text-white">{a.title}</span>
                    {a.hotelId && <span className="text-cyan-200">{hotelById(a.hotelId)?.shortName}</span>}
                    <span className="ml-auto text-slate-400">{new Date(a.at).toLocaleString('ko-KR')}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <div className="text-right"><button className="btn" onClick={() => confirm('진도·퀴즈·승인 이력을 모두 초기화할까요?') && reset()}>🗑 학습 기록 초기화</button></div>
        </div>
      </div>
    </div>
  )
}
