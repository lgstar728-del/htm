import { create } from 'zustand'
import { hotelById, STYLE_HEIGHT } from '../data/hotels'
import { hasWebGL, isLowEnd, safeStorage } from './env'

export const STEP_IDS = ['objectives', 'theory', 'image', 'cases', 'prompt', 'practice', 'quiz'] as const
export type StepId = (typeof STEP_IDS)[number]
export const STEP_LABELS: Record<StepId, string> = {
  objectives: '학습목표',
  theory: '핵심 이론',
  image: '원본 이미지',
  cases: '호텔 적용사례',
  prompt: 'AI 프롬프트',
  practice: '실습',
  quiz: '퀴즈',
}

export interface LessonProgress {
  steps: Partial<Record<StepId, boolean>>
  quizBest?: { score: number; total: number }
}
export interface Approval {
  simId: string
  hotelId: string | null
  title: string
  at: number
}

const storage = safeStorage()
const KEY = 'hat-progress-v1'

function loadSaved(): { progress: Record<string, LessonProgress>; approvals: Approval[]; prefer2d: boolean | null } {
  try {
    const raw = storage.get(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* 손상된 저장값 무시 */
  }
  return { progress: {}, approvals: [], prefer2d: null }
}

export interface CamGoal {
  id: number
  pos: [number, number, number]
  target: [number, number, number]
}

interface State {
  screen: 'world' | 'interior'
  hotelId: string | null // world: 포커스된 호텔 / interior: 현재 호텔
  hoveredHotel: string | null
  lessonId: string | null
  simId: string | null // 실습 직접 실행(부서 패널 외)
  activeDeptId: string | null
  viewerId: string | null
  graphOpen: boolean
  dashOpen: boolean
  lecture: boolean
  fade: boolean
  mode3d: boolean
  webgl: boolean
  camGoal: CamGoal | null
  progress: Record<string, LessonProgress>
  approvals: Approval[]

  focusHotel: (id: string | null) => void
  enterHotel: (instant?: boolean) => void
  exitHotel: (instant?: boolean) => void
  hover: (id: string | null) => void
  openDept: (deptId: string) => void
  openLesson: (lessonId: string, step?: StepId) => void
  closeLesson: () => void
  setLessonStep: (step: StepId) => void
  openViewer: (id: string | null) => void
  setGraphOpen: (v: boolean) => void
  setDashOpen: (v: boolean) => void
  setLecture: (v: boolean) => void
  setMode3d: (v: boolean) => void
  flyTo: (pos: [number, number, number], target: [number, number, number]) => void
  markStep: (lessonId: string, step: StepId) => void
  saveQuiz: (lessonId: string, score: number, total: number) => void
  approve: (a: Omit<Approval, 'at'>) => void
  resetProgress: () => void
  currentStep: StepId
}

const saved = loadSaved()
const webgl = typeof document !== 'undefined' ? hasWebGL() : true
const defaultMode3d = saved.prefer2d !== null ? !saved.prefer2d && webgl : webgl && !isLowEnd()

let goalId = 0
export const OVERVIEW_CAM: CamGoal = { id: 0, pos: [0, 40, 104], target: [0, 9, -6] }

function persist(s: Pick<State, 'progress' | 'approvals' | 'mode3d'>) {
  storage.set(KEY, JSON.stringify({ progress: s.progress, approvals: s.approvals, prefer2d: !s.mode3d }))
}

export const useStore = create<State>((set, get) => ({
  screen: 'world',
  hotelId: null,
  hoveredHotel: null,
  lessonId: null,
  simId: null,
  activeDeptId: null,
  viewerId: null,
  graphOpen: false,
  dashOpen: false,
  lecture: false,
  fade: false,
  mode3d: defaultMode3d,
  webgl,
  camGoal: null,
  progress: saved.progress ?? {},
  approvals: saved.approvals ?? [],
  currentStep: 'objectives',

  flyTo: (pos, target) => set({ camGoal: { id: ++goalId, pos, target } }),

  focusHotel: (id) => {
    set({ hotelId: id })
    if (!id) {
      get().flyTo(OVERVIEW_CAM.pos, OVERVIEW_CAM.target)
      return
    }
    const h = hotelById(id)!
    const [x, z] = h.position
    const fx = Math.sin(h.facing)
    const fz = Math.cos(h.facing)
    const hh = STYLE_HEIGHT[h.style]
    const dist = 28 + hh * 1.2
    get().flyTo([x + fx * dist, 10 + hh * 0.35, z + fz * dist + 2], [x, hh * 0.4 - 1, z])
  },

  enterHotel: (instant) => {
    const { hotelId } = get()
    if (!hotelId) return
    if (instant) {
      set({ screen: 'interior', activeDeptId: null })
      return
    }
    const h = hotelById(hotelId)!
    const [x, z] = h.position
    const fx = Math.sin(h.facing)
    const fz = Math.cos(h.facing)
    // 1) 입구로 돌진 → 2) 페이드 → 3) 내부 장면 전환
    get().flyTo([x + fx * 10, 3.2, z + fz * 10], [x + fx * 2, 3, z + fz * 2])
    setTimeout(() => set({ fade: true }), 900)
    setTimeout(() => {
      set({ screen: 'interior', activeDeptId: null })
      get().flyTo([0, 9.5, 25], [0, 2.2, -4])
    }, 1500)
    setTimeout(() => set({ fade: false }), 1900)
  },

  exitHotel: (instant) => {
    if (instant) {
      set({ screen: 'world', lessonId: null, lecture: false })
      return
    }
    set({ fade: true, lessonId: null, lecture: false })
    setTimeout(() => {
      set({ screen: 'world' })
      const id = get().hotelId
      get().focusHotel(id)
    }, 450)
    setTimeout(() => set({ fade: false }), 800)
  },

  hover: (id) => set({ hoveredHotel: id }),

  openDept: (deptId) => {
    set({ activeDeptId: deptId })
    const hotel = hotelById(get().hotelId ?? '')
    const dept = hotel?.departments.find((d) => d.id === deptId)
    if (dept) get().openLesson(dept.lessonId)
  },

  openLesson: (lessonId, step = 'objectives') => {
    set({ lessonId, currentStep: step })
    get().markStep(lessonId, step)
  },
  closeLesson: () => set({ lessonId: null, lecture: false, activeDeptId: null }),
  setLessonStep: (step) => {
    const { lessonId } = get()
    set({ currentStep: step })
    if (lessonId) get().markStep(lessonId, step)
  },

  openViewer: (id) => set({ viewerId: id }),
  setGraphOpen: (v) => set({ graphOpen: v }),
  setDashOpen: (v) => set({ dashOpen: v }),
  setLecture: (v) => set({ lecture: v }),
  setMode3d: (v) => {
    set({ mode3d: v })
    persist(get())
  },

  markStep: (lessonId, step) => {
    const p = get().progress
    const cur = p[lessonId] ?? { steps: {} }
    if (cur.steps[step]) return
    const progress = { ...p, [lessonId]: { ...cur, steps: { ...cur.steps, [step]: true } } }
    set({ progress })
    persist(get())
  },

  saveQuiz: (lessonId, score, total) => {
    const p = get().progress
    const cur = p[lessonId] ?? { steps: {} }
    const best = cur.quizBest && cur.quizBest.score >= score ? cur.quizBest : { score, total }
    set({ progress: { ...p, [lessonId]: { ...cur, quizBest: best } } })
    persist(get())
  },

  approve: (a) => {
    set({ approvals: [{ ...a, at: Date.now() }, ...get().approvals].slice(0, 50) })
    persist(get())
  },

  resetProgress: () => {
    set({ progress: {}, approvals: [] })
    persist(get())
  },
}))

export function lessonCompletion(p?: LessonProgress): number {
  if (!p) return 0
  const done = STEP_IDS.filter((s) => p.steps[s]).length
  return done / STEP_IDS.length
}
