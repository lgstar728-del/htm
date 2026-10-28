import type { Hotel, HotelStyle } from '../types'

// 외관 모델 높이(월드 단위) — 카메라 거리 계산과 라벨 위치에 사용
export const STYLE_HEIGHT: Record<HotelStyle, number> = { classic: 37, resort: 15, palace: 22, business: 28, smart: 34 }

// 호텔 추가 방법: 아래 배열에 객체를 추가하고(departments 포함),
// 외관 모델은 scenes/HotelModel.tsx 의 style 별 빌더(또는 public/models 의 glb)와 연결합니다.
export const hotels: Hotel[] = [
  {
    id: 'aurora',
    name: 'AURORA GRAND HOTEL',
    shortName: 'AURORA',
    tagline: '고객 경험의 모든 접점을 AI로 설계하는 플래그십',
    focus: ['프론트오피스', '예약', '고객경험', 'VIP 응대'],
    style: 'classic',
    theme: { primary: '#d4af37', accent: '#f6e27a', glass: '#7aa7d9' },
    position: [-38, 2],
    facing: 0.45,
    facts: { rooms: 320, adr: 285000, occ: 0.82, grade: '5성급', location: '도심 비즈니스 지구' },
    departments: [
      { id: 'aurora-fo', name: '프론트오피스', en: 'Front Office', kind: 'desk', lessonId: 'L01', simId: 'reservation-reply', blurb: 'AI 시장 변화와 경영 패러다임 · 예약 문의 자동 응답' },
      { id: 'aurora-rsv', name: '예약팀', en: 'Reservations', kind: 'meeting', lessonId: 'L05', simId: 'reservation-reply', blurb: '프롬프트 엔지니어링으로 예약 문의에 답하기' },
      { id: 'aurora-cx', name: '고객경험(CX)', en: 'Guest Experience', kind: 'lounge', lessonId: 'L04', simId: 'complaint', blurb: 'AI 리스크·보안과 고객 불만 분석·대응' },
      { id: 'aurora-vip', name: 'VIP 라운지', en: 'VIP Service', kind: 'room', lessonId: 'L11', simId: 'humanizer', blurb: 'AI 말투를 걷어낸 VIP 응대 문구 만들기' },
    ],
  },
  {
    id: 'bluewave',
    name: 'BLUEWAVE RESORT',
    shortName: 'BLUEWAVE',
    tagline: '객실·시설 운영을 데이터로 읽는 오션 리조트',
    focus: ['객실관리', '하우스키핑', '시설관리'],
    style: 'resort',
    theme: { primary: '#22d3ee', accent: '#67e8f9', glass: '#38bdf8' },
    position: [-19, -8],
    facing: 0.22,
    facts: { rooms: 410, adr: 240000, occ: 0.76, grade: '5성급 리조트', location: '해안 휴양 지구' },
    departments: [
      { id: 'blue-rooms', name: '객실관리', en: 'Rooms Division', kind: 'room', lessonId: 'L02', simId: 'demand', blurb: 'DX에서 AX로 · 객실 수요예측' },
      { id: 'blue-hk', name: '하우스키핑', en: 'Housekeeping', kind: 'ops', lessonId: 'L06', simId: 'housekeeping', blurb: '컨텍스트 엔지니어링으로 청소 배정 최적화' },
      { id: 'blue-fac', name: '시설관리', en: 'Facility', kind: 'server', lessonId: 'L07', simId: 'ops-report', blurb: '하네스 엔지니어링 · 시설 점검 보고서 자동화' },
    ],
  },
  {
    id: 'lumen',
    name: 'THE LUMEN PALACE',
    shortName: 'LUMEN',
    tagline: '식음·연회·MICE를 AI로 기획하는 그랜드 팰리스',
    focus: ['식음료', '연회', 'MICE', '행사기획'],
    style: 'palace',
    theme: { primary: '#c084fc', accent: '#e9d5ff', glass: '#a5b4fc' },
    position: [0, -15],
    facing: 0,
    facts: { rooms: 280, adr: 310000, occ: 0.74, grade: '특1급', location: '컨벤션 단지' },
    departments: [
      { id: 'lumen-fnb', name: '식음료(F&B)', en: 'Food & Beverage', kind: 'kitchen', lessonId: 'L10', simId: 'marketing', blurb: 'Claude Chat·Cowork·Code · 다이닝 프로모션' },
      { id: 'lumen-banq', name: '연회', en: 'Banquet', kind: 'meeting', lessonId: 'L03', simId: 'banquet', blurb: '생성형 AI와 에이전트 · 연회 제안서 작성' },
      { id: 'lumen-mice', name: 'MICE', en: 'MICE', kind: 'meeting', lessonId: 'L08', simId: 'banquet', blurb: '루프 엔지니어링으로 제안서를 스스로 점검·개선' },
      { id: 'lumen-event', name: '행사기획', en: 'Event Planning', kind: 'lounge', lessonId: 'L09', simId: 'banquet', blurb: '그래프 엔지니어링 · 행사 관계망 설계' },
    ],
  },
  {
    id: 'nexus',
    name: 'NEXUS BUSINESS HOTEL',
    shortName: 'NEXUS',
    tagline: '수익관리와 고객분석으로 성장하는 비즈니스 호텔',
    focus: ['마케팅', 'Revenue Management', '고객분석'],
    style: 'business',
    theme: { primary: '#38bdf8', accent: '#bae6fd', glass: '#60a5fa' },
    position: [19, -8],
    facing: -0.22,
    facts: { rooms: 220, adr: 198000, occ: 0.85, grade: '4성급 비즈니스', location: '산업단지·역세권' },
    departments: [
      { id: 'nexus-mkt', name: '마케팅', en: 'Marketing', kind: 'lounge', lessonId: 'L11', simId: 'marketing', blurb: 'AI Humanizer · 고객 맞춤형 마케팅' },
      { id: 'nexus-rm', name: 'Revenue Management', en: 'Revenue Mgmt', kind: 'server', lessonId: 'L02', simId: 'adr-revpar', blurb: 'AX 전환과 ADR·RevPAR 계산' },
      { id: 'nexus-an', name: '고객분석', en: 'Guest Analytics', kind: 'ops', lessonId: 'L09', simId: 'demand', blurb: '지식그래프로 읽는 고객·예약·리뷰 관계' },
    ],
  },
  {
    id: 'horizon',
    name: 'HORIZON SMART HOTEL',
    shortName: 'HORIZON',
    tagline: 'AI Agent와 Vibe Coding으로 일하는 방식을 바꾸는 스마트 호텔',
    focus: ['AI 경영혁신', '자동화', 'AI Agent', 'Vibe Coding'],
    style: 'smart',
    theme: { primary: '#2dd4bf', accent: '#99f6e4', glass: '#22d3ee' },
    position: [38, 2],
    facing: -0.45,
    facts: { rooms: 180, adr: 265000, occ: 0.8, grade: '스마트 호텔', location: '혁신 도시' },
    departments: [
      { id: 'hor-ax', name: 'AI 경영혁신실', en: 'AX Office', kind: 'meeting', lessonId: 'L01', simId: 'ops-report', blurb: 'AI 시장 변화와 경영 패러다임 · 운영 보고서 자동 생성' },
      { id: 'hor-auto', name: '자동화센터', en: 'Automation Hub', kind: 'server', lessonId: 'L04', simId: 'agent-automation', blurb: 'AI 리스크를 통제하는 업무 자동화' },
      { id: 'hor-agent', name: 'AI Agent 랩', en: 'Agent Lab', kind: 'ops', lessonId: 'L03', simId: 'agent-automation', blurb: '에이전트가 컨시어지 요청 전체를 처리' },
      { id: 'hor-vibe', name: 'Vibe Coding 스튜디오', en: 'Vibe Studio', kind: 'desk', lessonId: 'L12', simId: 'spec-generator', blurb: 'SPEC.md → GitHub → Vercel 배포' },
    ],
  },
]

export const hotelById = (id: string) => hotels.find((h) => h.id === id)
