import type { Course } from '../types'

// 코스 = 호텔 1개의 강의 묶음
export const courses: Course[] = [
  { id: 'trend', hotelId: 'bluewave', title: 'AI 동향 & AX 전략', desc: '시장·모델 · 2026 동향 · DX→AX · 리스크', color: '#22d3ee', lessonIds: ['L01', 'L02', 'L03', 'L04'] },
  { id: 'connect', hotelId: 'nexus', title: 'LLM · RAG · API · MCP', desc: 'LLM→RAG→Agent · Iceberg · API vs MCP · 하네스', color: '#38bdf8', lessonIds: ['L05', 'L06', 'L07', 'L08'] },
  { id: 'prompt', hotelId: 'aurora', title: 'Prompt Engineering', desc: '프롬프트 · 추론 기법 · 컨텍스트 · Humanizer', color: '#d4af37', lessonIds: ['L09', 'L10', 'L11', 'L12'] },
  { id: 'vibe', hotelId: 'horizon', title: 'Vibe Coding', desc: '개념 · 웹 기초 · SPEC.md · 워크플로우 · 보안 · 배포', color: '#2dd4bf', lessonIds: ['L13', 'L14', 'L15', 'L16', 'L17', 'L18'] },
  { id: 'other', hotelId: 'lumen', title: 'Other · Claude 실무 & 자동화', desc: 'Claude 3종 · 파이프라인 · Loop · Graph', color: '#c084fc', lessonIds: ['L19', 'L20', 'L21', 'L22'] },
]

export const courseById = (id: string) => courses.find((c) => c.id === id)
export const courseOfLesson = (lessonId: string) => courses.find((c) => c.lessonIds.includes(lessonId))
