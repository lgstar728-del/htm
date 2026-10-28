import type { Hotel, HotelStyle } from '../types'

// 외관 모델 높이(월드 단위) — 카메라 거리 계산과 라벨 위치에 사용
export const STYLE_HEIGHT: Record<HotelStyle, number> = { classic: 37, resort: 15, palace: 22, business: 28, smart: 34 }

// 호텔 = 교육 주제 하나. 배열 순서 = 권장 학습 동선(광장의 왼쪽 → 오른쪽).
// 호텔 추가 방법: 아래 배열에 객체를 추가하고(departments 포함),
// 외관 모델은 scenes/HotelModel.tsx 의 style 별 빌더(또는 public/models 의 glb)와 연결합니다.
export const hotels: Hotel[] = [
  {
    id: 'bluewave',
    topic: 'AI 동향 & AX 전략',
    name: 'BLUEWAVE RESORT',
    shortName: 'BLUEWAVE',
    tagline: '파도처럼 바뀌는 AI 시장을 읽고 AX로 전환하는 법',
    focus: ['AI 시장·모델', '2026 최신 동향', 'DX→AX', '리스크·거버넌스'],
    style: 'resort',
    theme: { primary: '#22d3ee', accent: '#67e8f9', glass: '#38bdf8' },
    position: [-38, 2],
    facing: 0.45,
    facts: { rooms: 410, adr: 240000, occ: 0.76, grade: '5성급 리조트', location: '해안 휴양 지구' },
    departments: [
      { id: 'blue-market', name: '시장·모델 라운지', en: 'Market & Models', kind: 'lounge', lessonId: 'L01', blurb: '글로벌 AI 시장, 모델 진화 5단계, 비용·성능 포트폴리오' },
      { id: 'blue-trend', name: '2026 트렌드 데스크', en: 'Trend Desk', kind: 'desk', lessonId: 'L02', blurb: 'Opus 5, AI 역량과잉(Capability Overhang), 말하는 AI → 행동하는 AI' },
      { id: 'blue-ax', name: 'AX 전환실', en: 'AX Office', kind: 'meeting', lessonId: 'L03', blurb: 'DX와 AX, 자동화 4단계, AX 워크플로우 전환 5단계' },
      { id: 'blue-risk', name: '리스크·거버넌스 센터', en: 'Risk & Governance', kind: 'server', lessonId: 'L04', blurb: '환각·편향·보안, 단독 결정 금지, 규제 동향' },
    ],
  },
  {
    id: 'nexus',
    topic: 'LLM · RAG · API · MCP',
    name: 'NEXUS BUSINESS HOTEL',
    shortName: 'NEXUS',
    tagline: 'AI를 데이터·도구에 연결하는 허브 — LLM에서 RAG, API, MCP까지',
    focus: ['LLM·RAG·Agent', 'Gen AI Iceberg', 'API vs MCP', '하네스·커넥터'],
    style: 'business',
    theme: { primary: '#38bdf8', accent: '#bae6fd', glass: '#60a5fa' },
    position: [-19, -8],
    facing: 0.22,
    facts: { rooms: 220, adr: 198000, occ: 0.85, grade: '4성급 비즈니스', location: '산업단지·역세권' },
    departments: [
      { id: 'nex-llm', name: 'LLM·RAG 허브', en: 'LLM · RAG · Agent', kind: 'server', lessonId: 'L05', blurb: 'LLM → RAG → AI 에이전트 → 에이전틱 AI, 단계별 확장' },
      { id: 'nex-ice', name: 'Gen AI 빙산 전망대', en: 'Gen AI Iceberg', kind: 'lounge', lessonId: 'L06', blurb: '입문·중급·고급 — 임베딩, 청킹, 벡터DB, 파인튜닝, 가드레일' },
      { id: 'nex-api', name: 'API·MCP 게이트', en: 'API vs MCP', kind: 'desk', lessonId: 'L07', blurb: 'API의 이해, MCP는 API 위의 AI 친화적 통역기' },
      { id: 'nex-harness', name: '하네스·커넥터 룸', en: 'Harness & Connectors', kind: 'meeting', lessonId: 'L08', blurb: 'Harness Engineering, 커넥터·플러그인, 권한과 모니터링' },
    ],
  },
  {
    id: 'aurora',
    topic: 'Prompt Engineering',
    name: 'AURORA GRAND HOTEL',
    shortName: 'AURORA',
    tagline: '말로 일을 시키는 기술 — 프롬프트에서 컨텍스트, 문장 다듬기까지',
    focus: ['프롬프트 6원칙', '추론 유도 기법', 'Context Engineering', 'AI Humanizer'],
    style: 'classic',
    theme: { primary: '#d4af37', accent: '#f6e27a', glass: '#7aa7d9' },
    position: [0, -15],
    facing: 0,
    facts: { rooms: 320, adr: 285000, occ: 0.82, grade: '5성급', location: '도심 비즈니스 지구' },
    departments: [
      { id: 'aur-prompt', name: '프롬프트 프런트데스크', en: 'Prompt Basics', kind: 'desk', lessonId: 'L09', blurb: '4요소·6원칙·TCREI, 역할·Few-shot·형식 지정' },
      { id: 'aur-reason', name: '추론 기법 라운지', en: 'Reasoning Techniques', kind: 'lounge', lessonId: 'L10', blurb: 'CoT, Self-Consistency, ToT, ReAct, Extended Thinking' },
      { id: 'aur-context', name: '컨텍스트 컨시어지', en: 'Context Engineering', kind: 'ops', lessonId: 'L11', blurb: '무엇을·얼마나·어떤 순서로 채울 것인가' },
      { id: 'aur-human', name: 'VIP 문장 살롱', en: 'AI Humanizer', kind: 'room', lessonId: 'L12', blurb: '전형적인 AI 말투 10가지를 걷어내기' },
    ],
  },
  {
    id: 'horizon',
    topic: 'Vibe Coding',
    name: 'HORIZON SMART HOTEL',
    shortName: 'HORIZON',
    tagline: '코드 대신 의도를 말한다 — 아이디어에서 배포·서비스까지',
    focus: ['바이브코딩 입문', '기획·SPEC.md', '실전 워크플로우', 'GitHub·Vercel 배포'],
    style: 'smart',
    theme: { primary: '#2dd4bf', accent: '#99f6e4', glass: '#22d3ee' },
    position: [19, -8],
    facing: -0.22,
    facts: { rooms: 180, adr: 265000, occ: 0.8, grade: '스마트 호텔', location: '혁신 도시' },
    departments: [
      { id: 'hor-vibe', name: '바이브코딩 스튜디오', en: 'Vibe Studio', kind: 'desk', lessonId: 'L13', extraLessonIds: ['L14'], blurb: '바이브코딩의 이해·도구 + 프론트·백엔드·DB 기초' },
      { id: 'hor-spec', name: 'SPEC 기획실', en: 'Planning Room', kind: 'meeting', lessonId: 'L15', blurb: '기획 → 요구사항 → 화면 → 데이터 → SPEC.md' },
      { id: 'hor-flow', name: '실전 워크플로우 랩', en: 'Workflow Lab', kind: 'ops', lessonId: 'L16', extraLessonIds: ['L17'], blurb: '빌드 순서·검증 루프·디버깅 + 보안·OWASP' },
      { id: 'hor-deploy', name: '배포 센터', en: 'Deploy Center', kind: 'server', lessonId: 'L18', blurb: 'Git·GitHub → Vercel 자동 배포(CI/CD)' },
    ],
  },
  {
    id: 'lumen',
    topic: 'Other · Claude 실무 & 에이전틱 자동화',
    name: 'THE LUMEN PALACE',
    shortName: 'LUMEN',
    tagline: 'AI와 일하는 방식의 완성 — Claude 실무, 파이프라인, Loop·Graph',
    focus: ['Claude Chat·Cowork·Code', '에이전틱 파이프라인', 'Loop Engineering', 'Graph Engineering'],
    style: 'palace',
    theme: { primary: '#c084fc', accent: '#e9d5ff', glass: '#a5b4fc' },
    position: [38, 2],
    facing: -0.45,
    facts: { rooms: 280, adr: 310000, occ: 0.74, grade: '특1급', location: '컨벤션 단지' },
    departments: [
      { id: 'lum-claude', name: 'Claude 스튜디오', en: 'Claude Studio', kind: 'desk', lessonId: 'L19', blurb: 'Chat·Cowork·Code, 모델 선택, CLAUDE.md·SKILL.md' },
      { id: 'lum-pipe', name: '파이프라인 센터', en: 'Pipeline Center', kind: 'ops', lessonId: 'L20', blurb: '트리거-계획-실행-검증, 서브에이전트·Skill·Hook, AX 문제발굴' },
      { id: 'lum-loop', name: 'Loop 랩', en: 'Loop Lab', kind: 'meeting', lessonId: 'L21', blurb: '스스로 점검하고 반복 개선하는 루프 설계' },
      { id: 'lum-graph', name: 'Graph 갤러리', en: 'Graph Gallery', kind: 'lounge', lessonId: 'L22', blurb: '정보를 연결하고 흐르게 하는 지식그래프' },
    ],
  },
]

export const hotelById = (id: string) => hotels.find((h) => h.id === id)

/** 부서에서 열 수 있는 모든 강의 id (주 강의 + 관련 강의) */
export const deptLessonIds = (d: { lessonId: string; extraLessonIds?: string[] }) => [d.lessonId, ...(d.extraLessonIds ?? [])]

/** 이름표·칩에 쓰는 짧은 주제 라벨 (예: 'AI 동향', 'LLM', 'Prompt Engineering', 'Vibe Coding', 'Other') */
export const topicShort = (h: { topic: string }) => h.topic.split(/ [·&] /)[0]
