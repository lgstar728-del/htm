import type { Course } from '../types'

export const courses: Course[] = [
  {
    id: 'paradigm',
    title: 'AI 경영 패러다임',
    desc: 'AI 시장 변화 · DX→AX · 생성형 AI와 AI Agent',
    color: '#d4af37',
    lessonIds: ['L01', 'L02', 'L03'],
  },
  {
    id: 'governance',
    title: '리스크·보안·거버넌스',
    desc: '환각·편향·개인정보·인간 최종 승인',
    color: '#f87171',
    lessonIds: ['L04'],
  },
  {
    id: 'engineering',
    title: 'AI Engineering 5 Layers',
    desc: 'Prompt · Context · Harness · Loop · Graph',
    color: '#22d3ee',
    lessonIds: ['L05', 'L06', 'L07', 'L08', 'L09'],
  },
  {
    id: 'claude',
    title: 'Claude 실무 도구',
    desc: 'Chat · Cowork · Code · Skill · MCP · AI Humanizer',
    color: '#c084fc',
    lessonIds: ['L10', 'L11'],
  },
  {
    id: 'vibe',
    title: 'Vibe Coding & 배포',
    desc: 'SPEC.md · GitHub · Vercel 자동 배포',
    color: '#2dd4bf',
    lessonIds: ['L12'],
  },
]

export const courseById = (id: string) => courses.find((c) => c.id === id)
