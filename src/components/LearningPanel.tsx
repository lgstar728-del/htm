import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Block, Lesson, PromptTemplate } from '../types'
import { lessonById } from '../data/lessons'
import { infographicById, infographics } from '../data/infographics'
import { hotelById } from '../data/hotels'
import { courseById } from '../data/courses'
import { STEP_IDS, STEP_LABELS, lessonCompletion, useStore, type StepId } from '../utils/store'
import { copyText } from '../utils/env'
import { VisualBlock } from './Visuals'
import { SimulationPanel } from './SimulationPanel'
import { simById } from '../data/simulations'

/* ---------------- 이론 블록 렌더러 ---------------- */
function BlockView({ b, big }: { b: Block; big: boolean }) {
  const t = big ? 'text-[17px] md:text-[19px]' : 'text-[14.5px]'
  switch (b.t) {
    case 'p':
      return <p className={`${t} prose-lec my-3 text-slate-100`}>{b.text}</p>
    case 'list':
      return (
        <ul className={`${t} prose-lec my-3 space-y-1.5 pl-1`}>
          {b.items.map((i) => (
            <li key={i} className="flex gap-2 text-slate-100"><span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /><span>{i}</span></li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="my-4 overflow-x-auto rounded-xl border border-white/12">
          {b.caption && <div className="border-b border-white/10 bg-white/5 px-3 py-2 text-[13px] font-semibold text-gold">{b.caption}</div>}
          <table className={`w-full ${big ? 'text-[15px]' : 'text-[13px]'}`}>
            <thead><tr className="bg-navy-3/60 text-left text-cyan-100">{b.head.map((h) => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-t border-white/8 align-top odd:bg-white/[0.02]">
                  {r.map((c, k) => <td key={k} className={`px-3 py-2 leading-relaxed ${k === 0 ? 'font-semibold text-white' : 'text-slate-200'}`}>{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'callout': {
      const tone = { gold: 'border-gold/50 bg-gold/10', cyan: 'border-cyan-300/50 bg-cyan-300/10', red: 'border-rose-400/50 bg-rose-400/10', green: 'border-emerald-300/50 bg-emerald-300/10' }[b.tone ?? 'gold']
      return (
        <div className={`my-4 rounded-xl border p-3.5 ${tone}`}>
          {b.title && <div className={`mb-1 font-bold text-white ${big ? 'text-lg' : 'text-[14px]'}`}>{b.title}</div>}
          <p className={`${t} prose-lec text-slate-100`}>{b.text}</p>
        </div>
      )
    }
    case 'quote':
      return (
        <blockquote className="my-4 border-l-4 border-gold pl-4">
          <p className={`${big ? 'text-xl' : 'text-[15.5px]'} font-semibold italic text-gold-2`}>“{b.text}”</p>
          {b.src && <footer className="mt-1 text-[12px] text-slate-400">{b.src}</footer>}
        </blockquote>
      )
    case 'stats':
      return (
        <div className="my-4 grid grid-cols-2 gap-2.5 md:grid-cols-4">
          {b.items.map((s) => (
            <div key={s.v + s.l} className="rounded-xl border border-gold/35 bg-gradient-to-br from-gold/15 to-transparent p-3">
              <div className={`${big ? 'text-3xl' : 'text-2xl'} font-extrabold text-gold`}>{s.v}</div>
              <div className="mt-0.5 text-[12px] leading-snug text-slate-300">{s.l}</div>
            </div>
          ))}
        </div>
      )
    case 'visual':
      return <VisualBlock kind={b.kind} title={b.title} />
  }
}

/* ---------------- 프롬프트 랩 ---------------- */
const CHECKS: { id: string; label: string; re: RegExp; tip: string }[] = [
  { id: 'role', label: '역할(Role)', re: /역할|당신은|너는|전문가|담당자|매니저|분석가|컨설턴트|상담원/, tip: '“당신은 ○○ 담당자입니다”처럼 역할을 지정하세요.' },
  { id: 'task', label: '목표(Task)', re: /작성|분석|요약|정리|만들|생성|제안|추천|계산|설계|써/, tip: '무엇을 해야 하는지 동사로 명확히 지시하세요.' },
  { id: 'format', label: '형식(Format)', re: /형식|구조로|표로|표 |줄|문단|자 이내|개조식|JSON|Markdown|출력|3개|번호/, tip: '길이·표·문단 수 등 출력 형식을 지정하세요.' },
  { id: 'cons', label: '제약조건(Constraints)', re: /조건|제약|금지|하지 말|추측|반드시|절대|이내|확인 필요|승인|표시하/, tip: '“추측 금지”, “확인 필요 표시” 같은 제약을 넣으세요.' },
  { id: 'ctx', label: '맥락·자료(Context)', re: /<자료>|<[^>]{1,10}>|자료|배경|청중|대상|고객|목적|상황|참고/, tip: '대상·상황·참고 자료를 함께 제공하세요.' },
  { id: 'ex', label: '예시(Example)', re: /예시|예:|예\)|샘플|예를 들/, tip: '원하는 출력의 샘플을 1개 이상 보여주세요.' },
  { id: 'step', label: '단계/구조(Structure)', re: /먼저|다음|단계|1[).]|①|<[^>]+>/, tip: '순서를 지정하거나 XML 태그로 구조화하세요.' },
]

function PromptCard({ p, idx }: { p: PromptTemplate; idx: number }) {
  const [text, setText] = useState(p.text)
  const [copied, setCopied] = useState(false)
  const res = useMemo(() => CHECKS.map((c) => ({ ...c, ok: c.re.test(text) })), [text])
  const score = Math.round((res.filter((r) => r.ok).length / CHECKS.length) * 100)
  return (
    <div className="my-4 rounded-2xl border border-cyan-300/30 bg-black/25 p-3.5">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-cyan-400/20 px-2 py-0.5 text-[12px] font-bold text-cyan-200">PROMPT {idx + 1}</span>
        <b className="text-white">{p.title}</b>
        <div className="ml-auto flex gap-2">
          <button className="btn !min-h-9 !py-1.5" onClick={() => setText(p.text)}>↺ 원본</button>
          <button className="btn btn-gold !min-h-9 !py-1.5" onClick={async () => { setCopied(await copyText(text)); setTimeout(() => setCopied(false), 1600) }}>{copied ? '복사됨 ✓' : '📋 프롬프트 복사'}</button>
        </div>
      </div>
      <textarea className="field min-h-[190px] font-mono text-[12.5px] leading-relaxed" value={text} onChange={(e) => setText(e.target.value)} aria-label={`프롬프트 ${idx + 1} 편집`} spellCheck={false} />
      <div className="mt-3 rounded-xl bg-white/5 p-3">
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-semibold text-slate-200">프롬프트 품질 점검</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded bg-white/10"><motion.div className={`h-full ${score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`} animate={{ width: `${score}%` }} /></div>
          <b className={score >= 70 ? 'text-emerald-300' : score >= 40 ? 'text-amber-300' : 'text-rose-300'}>{score}점</b>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {res.map((r) => (<span key={r.id} title={r.ok ? '포함됨' : r.tip} className={`rounded-full border px-2 py-0.5 text-[12px] ${r.ok ? 'border-emerald-300/50 bg-emerald-400/10 text-emerald-200' : 'border-rose-300/40 bg-rose-400/10 text-rose-200'}`}>{r.ok ? '✓' : '✗'} {r.label}</span>))}
        </div>
        {res.some((r) => !r.ok) && <p className="mt-2 text-[12.5px] text-slate-300">💡 {res.find((r) => !r.ok)!.tip}</p>}
      </div>
      {p.tip && <p className="mt-2 text-[13px] text-gold-2">TIP · {p.tip}</p>}
    </div>
  )
}

/* ---------------- 퀴즈 ---------------- */
function Quiz({ lesson }: { lesson: Lesson }) {
  const saveQuiz = useStore((s) => s.saveQuiz)
  const best = useStore((s) => s.progress[lesson.id]?.quizBest)
  const [picked, setPicked] = useState<(number | null)[]>(() => lesson.quiz.map(() => null))
  useEffect(() => setPicked(lesson.quiz.map(() => null)), [lesson.id, lesson.quiz])
  const answered = picked.filter((p) => p !== null).length
  const score = picked.filter((p, i) => p === lesson.quiz[i].answer).length
  const finished = answered === lesson.quiz.length
  useEffect(() => {
    if (finished) saveQuiz(lesson.id, score, lesson.quiz.length)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])
  return (
    <div className="space-y-4">
      {best && <div className="text-[13px] text-slate-300">최고 기록: <b className="text-gold">{best.score}/{best.total}</b></div>}
      {lesson.quiz.map((q, qi) => (
        <fieldset key={q.q} className="rounded-2xl border border-white/12 bg-white/[0.03] p-3.5">
          <legend className="px-1 text-[12px] font-bold text-cyan-200">QUIZ {qi + 1}</legend>
          <p className="mb-2 font-semibold text-white">{q.q}</p>
          <div className="grid gap-1.5">
            {q.options.map((o, oi) => {
              const sel = picked[qi] === oi
              const done = picked[qi] !== null
              const correct = q.answer === oi
              return (
                <button key={o} disabled={done} onClick={() => setPicked(picked.map((p, i) => (i === qi ? oi : p)))} className={`rounded-xl border px-3 py-2.5 text-left text-[14px] transition ${done ? (correct ? 'border-emerald-300/70 bg-emerald-400/15 text-emerald-100' : sel ? 'border-rose-300/70 bg-rose-400/15 text-rose-100' : 'border-white/10 opacity-60') : 'border-white/15 bg-white/5 hover:border-gold'}`}>
                  <span className="mr-2 font-bold text-gold">{'①②③④'[oi]}</span>{o}
                </button>
              )
            })}
          </div>
          {picked[qi] !== null && <p className={`mt-2 rounded-lg p-2 text-[13px] ${picked[qi] === q.answer ? 'bg-emerald-400/10 text-emerald-100' : 'bg-rose-400/10 text-rose-100'}`}>{picked[qi] === q.answer ? '✅ 정답! ' : '❌ 오답. '}{q.explain}</p>}
        </fieldset>
      ))}
      {finished && (
        <div className="rounded-2xl border border-gold/50 bg-gold/10 p-4 text-center">
          <div className="text-3xl font-extrabold text-gold">{score} / {lesson.quiz.length}</div>
          <p className="text-sm text-slate-200">{score === lesson.quiz.length ? '🎉 모든 문제를 맞혔습니다!' : '해설을 읽고 이론 단계를 다시 확인해 보세요.'}</p>
          <button className="btn mt-2" onClick={() => setPicked(lesson.quiz.map(() => null))}>다시 풀기</button>
        </div>
      )}
    </div>
  )
}

/* ---------------- 실습: 부서 실습 + 강의 실습 전환 ---------------- */
function PracticeSims({ lessonSimId, deptSimId, deptName }: { lessonSimId?: string; deptSimId?: string; deptName?: string }) {
  const ids = [deptSimId, lessonSimId].filter((x, i, a): x is string => !!x && a.indexOf(x) === i)
  const [cur, setCur] = useState(ids[0])
  useEffect(() => setCur(ids[0]), [deptSimId, lessonSimId]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!ids.length) return null
  return (
    <div>
      {ids.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-2" role="tablist" aria-label="실습 선택">
          {ids.map((id) => (
            <button key={id} role="tab" aria-selected={cur === id} data-simtab={id} onClick={() => setCur(id)} className={`btn ${cur === id ? 'btn-cyan' : ''}`}>
              {id === deptSimId ? `🏨 ${deptName ?? '부서'} 실습` : '📘 강의 실습'} · {simById(id)?.title}
            </button>
          ))}
        </div>
      )}
      {cur && <SimulationPanel key={cur} simId={cur} />}
    </div>
  )
}

/* ---------------- 메인 패널 ---------------- */
export function LearningPanel() {
  const lessonId = useStore((s) => s.lessonId)
  const step = useStore((s) => s.currentStep)
  const setStep = useStore((s) => s.setLessonStep)
  const close = useStore((s) => s.closeLesson)
  const lecture = useStore((s) => s.lecture)
  const setLecture = useStore((s) => s.setLecture)
  const openViewer = useStore((s) => s.openViewer)
  const openLesson = useStore((s) => s.openLesson)
  const progress = useStore((s) => s.progress)
  const hotelId = useStore((s) => s.hotelId)
  const deptId = useStore((s) => s.activeDeptId)
  const lesson = lessonId ? lessonById(lessonId) : undefined

  const hotel = hotelId ? hotelById(hotelId) : undefined
  const dept = hotel?.departments.find((d) => d.id === deptId)
  const idx = STEP_IDS.indexOf(step)

  // 키보드: ←/→ 단계 이동, Esc 닫기 (강의 모드에서 특히 유용)
  useEffect(() => {
    if (!lesson) return
    const k = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SELECT') return
      if (useStore.getState().viewerId) return
      if (e.key === 'ArrowRight' && idx < STEP_IDS.length - 1) setStep(STEP_IDS[idx + 1])
      else if (e.key === 'ArrowLeft' && idx > 0) setStep(STEP_IDS[idx - 1])
      else if (e.key === 'Escape' && !document.fullscreenElement) close()
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [lesson, idx, setStep, close])

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement && useStore.getState().lecture) useStore.getState().setLecture(false)
    }
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const toggleLecture = () => {
    if (lecture) {
      setLecture(false)
      if (document.fullscreenElement) void document.exitFullscreen()
    } else {
      setLecture(true)
      void document.documentElement.requestFullscreen?.().catch(() => undefined)
    }
  }

  const done = lesson ? lessonCompletion(progress[lesson.id]) : 0
  const info = lesson ? infographicById(lesson.infographicId) : undefined
  const prevNext = lesson ? { prev: lessonById(`L${String(lesson.no - 1).padStart(2, '0')}`), next: lessonById(`L${String(lesson.no + 1).padStart(2, '0')}`) } : undefined

  return (
    <AnimatePresence>
      {lesson && (
        <motion.aside
          key="panel"
          initial={{ x: '100%', opacity: 0.6 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 260 }}
          className={`glass fixed z-50 flex flex-col overflow-hidden shadow-2xl ${lecture ? 'inset-0 rounded-none' : 'inset-x-0 bottom-0 top-[6dvh] rounded-t-3xl md:inset-y-0 md:left-auto md:right-0 md:top-0 md:w-[min(760px,56vw)] md:rounded-none md:rounded-l-3xl'}`}
          aria-label={`${lesson.title} 학습 패널`}
        >
          <header className="border-b border-white/10 px-4 pb-2 pt-3 md:px-6">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold/30 to-cyan-400/20 text-2xl">{lesson.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-cyan-200">
                  {hotel && <span className="font-bold text-gold">{hotel.shortName}{dept ? ` · ${dept.name}` : ''}</span>}
                  <span>LESSON {String(lesson.no).padStart(2, '0')} · {courseById(lesson.courseId)?.title}</span>
                </div>
                <h2 className={`${lecture ? 'text-3xl' : 'text-xl'} font-extrabold leading-tight text-white`}>{lesson.title}</h2>
                <p className="text-[13px] text-slate-300">{lesson.subtitle}</p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <button className="btn" onClick={toggleLecture} title="전체 화면 강의 모드 (←/→로 단계 이동)">{lecture ? '⤡' : '⛶'}<span className="hidden sm:inline">{lecture ? '강의 종료' : '강의 모드'}</span></button>
                <button className="btn btn-gold" onClick={close} aria-label="학습 패널 닫기">✕</button>
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2" aria-label="학습 진도">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><motion.div className="h-full bg-gradient-to-r from-cyan-400 to-gold" animate={{ width: `${done * 100}%` }} /></div>
              <span className="text-[12px] tabular-nums text-slate-300">{Math.round(done * 100)}%</span>
            </div>
            <nav className="scroll-thin -mx-1 mt-2 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="학습 단계">
              {STEP_IDS.map((s, i) => {
                const visited = progress[lesson.id]?.steps[s]
                return (
                  <button key={s} role="tab" aria-selected={step === s} onClick={() => setStep(s)} className={`shrink-0 rounded-xl border px-3 py-2 text-[13px] font-semibold transition ${step === s ? 'border-gold bg-gold text-navy' : visited ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100' : 'border-white/15 bg-white/5 text-slate-200 hover:border-white/40'}`}>
                    <span className="mr-1 opacity-70">{i + 1}</span>{STEP_LABELS[s]}
                  </button>
                )
              })}
            </nav>
          </header>

          <div className="scroll-thin flex-1 overflow-y-auto px-4 py-4 md:px-6" key={lesson.id + step}>
            <StepBody step={step} lesson={lesson} big={lecture} info={info} openViewer={openViewer} deptSimId={dept?.simId} deptName={dept?.name} />
          </div>

          <footer className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5 md:px-6">
            <button className="btn" disabled={idx === 0} onClick={() => setStep(STEP_IDS[idx - 1])}>← 이전</button>
            <div className="hidden text-[12px] text-slate-400 sm:block">{idx + 1} / {STEP_IDS.length} · {STEP_LABELS[step]}</div>
            {idx < STEP_IDS.length - 1 ? (
              <button className="btn btn-gold" onClick={() => setStep(STEP_IDS[idx + 1])}>다음: {STEP_LABELS[STEP_IDS[idx + 1]]} →</button>
            ) : prevNext?.next ? (
              <button className="btn btn-gold" onClick={() => openLesson(prevNext.next!.id)}>다음 강의 L{String(prevNext.next.no).padStart(2, '0')} →</button>
            ) : (
              <button className="btn btn-gold" onClick={close}>학습 완료 ✓</button>
            )}
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function StepBody({ step, lesson, big, info, openViewer, deptSimId, deptName }: { step: StepId; lesson: Lesson; big: boolean; info: ReturnType<typeof infographicById>; openViewer: (id: string | null) => void; deptSimId?: string; deptName?: string }) {
  const t = big ? 'text-[17px]' : 'text-[14.5px]'
  const setStep = useStore((s) => s.setLessonStep)
  switch (step) {
    case 'objectives':
      return (
        <div>
          <h3 className="mb-3 text-lg font-bold text-gold">🎯 학습목표</h3>
          <ol className="space-y-2.5">
            {lesson.objectives.map((o, i) => (
              <li key={o} className="flex gap-3 rounded-xl border border-white/12 bg-white/[0.04] p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold font-bold text-navy">{i + 1}</span>
                <span className={`${t} text-slate-100`}>{o}</span>
              </li>
            ))}
          </ol>
          <h4 className="mb-2 mt-5 text-[13px] font-bold text-cyan-200">📚 근거 강의자료</h4>
          <div className="flex flex-wrap gap-1.5">{lesson.sources.map((s) => <span key={s} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[12px] text-slate-200">{s}</span>)}</div>
          <div className="mt-5 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-[13px] text-cyan-50">
            학습 흐름: 학습목표 → 핵심 이론 → 원본 이미지 → 호텔 적용사례 → AI 프롬프트 → 실습 → 퀴즈 · 키보드 ←/→ 로 이동할 수 있습니다.
          </div>
        </div>
      )
    case 'theory':
      return (
        <div>
          <h3 className="mb-1 text-lg font-bold text-gold">📖 핵심 이론</h3>
          {lesson.theory.map((b, i) => <BlockView key={i} b={b} big={big} />)}
        </div>
      )
    case 'image':
      return (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gold">🖼️ 원본 이미지</h3>
          {info ? (
            <>
              <button onClick={() => openViewer(info.id)} className="group relative block w-full overflow-hidden rounded-2xl border border-gold/40 bg-black/30" aria-label={`${info.title} 원본 크게 보기`}>
                <img src={info.src} alt={info.title} className="max-h-[56dvh] w-full object-contain" loading="lazy" width={info.width} height={info.height} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center text-sm font-bold text-gold opacity-90 group-hover:opacity-100">🔍 클릭하면 원본을 확대·축소·전체화면으로 볼 수 있습니다</span>
              </button>
              <div className="mt-3 flex flex-wrap gap-2">
                <button className="btn btn-gold" onClick={() => openViewer(info.id)}>⛶ 원본 열기 (확대·전체화면)</button>
                <a className="btn" href={info.src} download>⬇ 원본 다운로드</a>
              </div>
              <h4 className="mt-3 text-[15px] font-bold text-white">{info.title}</h4>
              <p className="text-[13.5px] text-slate-300">{info.caption}</p>
              {lesson.infographicNote && <div className="mt-3 rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-[13.5px] text-cyan-50">👀 보는 포인트 · {lesson.infographicNote}</div>}
            </>
          ) : (
            <>
              <p className="text-[14px] text-slate-200">이 강의는 아래 PPT 강의자료를 근거로 구성되었습니다. 핵심 슬라이드는 “핵심 이론”에 정리되어 있고, 전체 과정의 원본 인포그래픽은 다음에서 확인할 수 있습니다.</p>
              <ul className="my-3 space-y-1.5">{lesson.sources.map((s) => <li key={s} className="rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-[13px]">📑 {s}</li>)}</ul>
              <h4 className="mb-2 text-[13px] font-bold text-cyan-200">전체 인포그래픽 (원본 · 확대 가능)</h4>
              <div className="grid grid-cols-3 gap-2">
                {infographics.map((i) => (
                  <button key={i.id} onClick={() => openViewer(i.id)} className="overflow-hidden rounded-xl border border-white/15 bg-black/30 text-left hover:border-gold">
                    <img src={i.src} alt={i.title} loading="lazy" className="h-24 w-full object-cover md:h-32" />
                    <div className="p-1.5 text-[11px] leading-tight text-slate-200">{i.title}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )
    case 'cases':
      return (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gold">🏨 호텔 적용사례</h3>
          <div className="grid gap-3">
            {lesson.hotelCases.map((c) => {
              const h = hotelById(c.hotelId)
              return (
                <motion.div key={c.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/12 bg-white/[0.04] p-3.5" style={{ borderLeft: `4px solid ${h?.theme.primary ?? '#d4af37'}` }}>
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {h && <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold tracking-wide text-navy" style={{ background: h.theme.primary }}>{h.shortName}</span>}
                    <b className="text-white">{c.title}</b>
                  </div>
                  <p className={`${t} prose-lec text-slate-200`}>{c.text}</p>
                </motion.div>
              )
            })}
          </div>
          <p className="mt-3 text-[12px] text-slate-400">※ 모든 사례는 교육용 가상 시나리오이며, AI 결과는 사람이 검토·승인하는 것을 전제로 합니다.</p>
        </div>
      )
    case 'prompt':
      return (
        <div>
          <h3 className="mb-1 text-lg font-bold text-gold">💬 AI 프롬프트</h3>
          <p className="text-[13.5px] text-slate-300">프롬프트를 직접 수정해 보세요. 오른쪽 아래 버튼으로 복사해 Claude·ChatGPT·Gemini에 붙여넣을 수 있고, 아래 점검기는 4요소·TCREI 기준으로 점수를 매깁니다.</p>
          {lesson.prompts.map((p, i) => <PromptCard key={p.title} p={p} idx={i} />)}
          <div className="rounded-xl border border-rose-300/40 bg-rose-400/10 p-3 text-[13px] text-rose-100">⚠ 실제 고객 개인정보·기밀을 외부 AI에 입력하지 마세요. 결과의 수치·정책은 반드시 원본과 대조하세요.</div>
        </div>
      )
    case 'practice':
      return (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gold">🧪 실습</h3>
          <div className="mb-3 rounded-xl border border-gold/40 bg-gold/10 p-3">
            <div className="text-[13px] font-bold text-gold">미션</div>
            <p className={`${t} text-slate-100`}>{lesson.practice.mission}</p>
            <ol className="mt-2 grid gap-1 text-[13px] text-slate-200 sm:grid-cols-2">{lesson.practice.steps.map((s, i) => <li key={s}><b className="text-gold">{i + 1}.</b> {s}</li>)}</ol>
          </div>
          <PracticeSims lessonSimId={lesson.practice.simId} deptSimId={deptSimId} deptName={deptName} />
          <div className="mt-4 text-right"><button className="btn btn-cyan" onClick={() => setStep('quiz')}>실습 완료 → 퀴즈</button></div>
        </div>
      )
    case 'quiz':
      return (
        <div>
          <h3 className="mb-2 text-lg font-bold text-gold">✅ 퀴즈</h3>
          <Quiz lesson={lesson} />
        </div>
      )
  }
}
