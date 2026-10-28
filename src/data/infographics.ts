import type { Infographic } from '../types'

// 원본 인포그래픽 3종 — public/images/ 의 파일만 교체하면 즉시 갱신됩니다.
// (파일명을 유지하세요. 크기가 달라지면 width/height 만 수정)
export const infographics: Infographic[] = [
  {
    id: 'humanizer',
    title: '전형적인 AI 말투 (Ver 1.1 · 2026.9.16)',
    src: '/images/humanizer.png',
    caption: 'AI가 작성한 글에서 자주 나타나는 10가지 표현과 자연스러운 대체 표현',
    width: 1536,
    height: 1024,
    lessonIds: ['L11'],
  },
  {
    id: 'ai-engineering',
    title: 'AI ENGINEERING: 5 LAYERS',
    src: '/images/ai-engineering.png',
    caption: 'Prompt → Context → Harness → Loop → Graph, 좋은 결과를 만드는 AI 시스템의 5가지 핵심 층위',
    width: 1223,
    height: 1286,
    lessonIds: ['L05', 'L06', 'L07', 'L08', 'L09'],
  },
  {
    id: 'vibe-coding',
    title: '바이브코딩: 아이디어 → 코드 → 배포 → 서비스',
    src: '/images/vibe-coding.png',
    caption: '개발 환경 구축부터 SPEC.md, 프론트·백엔드, GitHub, Vercel 자동 배포, 사용자 접근까지',
    width: 1536,
    height: 1024,
    lessonIds: ['L12'],
  },
]

export const infographicById = (id?: string) => infographics.find((i) => i.id === id)
