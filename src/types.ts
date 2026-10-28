// 데이터 스키마 — 교육 콘텐츠(data/*)와 UI·3D 모듈(components/*, scenes/*) 사이의 계약

export type VisualKind =
  | 'evolution' // AI 모델 진화 5단계
  | 'levels' // 자동화 4단계
  | 'dxax' // DX vs AX
  | 'risk' // 사람 승인 분류 게임
  | 'layers' // AI Engineering 5 Layers
  | 'context' // 컨텍스트 윈도우 구성
  | 'harness' // 하네스 구성요소
  | 'loop' // 루프 엔지니어링 애니메이션
  | 'agent' // 에이전트 파이프라인 애니메이션
  | 'graph' // 호텔 지식그래프
  | 'claude3' // Claude Chat/Cowork/Code
  | 'models' // 모델 선택 가이드
  | 'vibeflow' // 아이디어→배포 파이프라인

export type Block =
  | { t: 'p'; text: string }
  | { t: 'list'; items: string[] }
  | { t: 'table'; head: string[]; rows: string[][]; caption?: string }
  | { t: 'callout'; title?: string; text: string; tone?: 'gold' | 'cyan' | 'red' | 'green' }
  | { t: 'quote'; text: string; src?: string }
  | { t: 'stats'; items: { v: string; l: string }[] }
  | { t: 'visual'; kind: VisualKind; title?: string }

export interface HotelCase {
  hotelId: string
  title: string
  text: string
}

export interface PromptTemplate {
  title: string
  text: string
  tip?: string
}

export interface QuizItem {
  q: string
  options: string[]
  answer: number
  explain: string
}

export interface Lesson {
  id: string
  no: number
  title: string
  subtitle: string
  icon: string
  courseId: string
  sources: string[] // 근거가 된 강의자료
  objectives: string[]
  theory: Block[]
  infographicId?: string // data/infographics.ts 의 id
  infographicNote?: string
  hotelCases: HotelCase[]
  prompts: PromptTemplate[]
  practice: { simId?: string; mission: string; steps: string[] }
  quiz: QuizItem[]
}

export interface Course {
  id: string
  title: string
  desc: string
  color: string
  lessonIds: string[]
}

export interface Infographic {
  id: string
  title: string
  src: string // public/ 기준 경로
  caption: string
  width: number
  height: number
  lessonIds: string[]
}

export type DeptKind = 'desk' | 'room' | 'meeting' | 'kitchen' | 'ops' | 'server' | 'lounge'

export interface Department {
  id: string
  name: string
  en: string
  kind: DeptKind
  lessonId: string
  simId: string
  blurb: string
}

export type HotelStyle = 'classic' | 'resort' | 'palace' | 'business' | 'smart'

export interface HotelFacts {
  rooms: number
  adr: number // 평균 객실요금(원)
  occ: number // 평균 점유율 0~1
  grade: string
  location: string
}

export interface Hotel {
  id: string
  name: string
  shortName: string
  tagline: string
  focus: string[]
  style: HotelStyle
  theme: { primary: string; accent: string; glass: string }
  position: [number, number] // 광장(plaza) 상의 x, z
  facing: number // y 회전(라디안)
  facts: HotelFacts
  departments: Department[]
}

export interface SimulationMeta {
  id: string
  title: string
  desc: string
  icon: string
  needsHumanApproval: boolean
  kind: 'generate' | 'calc' | 'agent' | 'tool'
}
