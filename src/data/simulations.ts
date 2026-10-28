import type { SimulationMeta } from '../types'

// 모든 실습 데이터는 가상 데이터입니다. 실제 AI API는 연결되어 있지 않으며 규칙 기반 시뮬레이션으로 동작합니다.
export const simulations: SimulationMeta[] = [
  { id: 'reservation-reply', title: '예약 문의 자동 응답', desc: '문의 키워드를 분석해 요금·정책 사실에 근거한 답변 초안을 만듭니다.', icon: '📨', needsHumanApproval: true, kind: 'generate' },
  { id: 'complaint', title: '고객 불만 분석 및 대응', desc: '불만을 분류하고 긴급도·원인·회복 전략과 응답 초안을 제안합니다.', icon: '🗣️', needsHumanApproval: true, kind: 'generate' },
  { id: 'demand', title: '객실 수요예측', desc: '14일 점유율 이력과 이벤트로 향후 7일 수요를 예측합니다.', icon: '📈', needsHumanApproval: true, kind: 'calc' },
  { id: 'adr-revpar', title: 'ADR · RevPAR 계산', desc: 'OCC·ADR·RevPAR을 계산하고 요금 변경 시나리오를 비교합니다.', icon: '🧮', needsHumanApproval: true, kind: 'calc' },
  { id: 'marketing', title: '고객 맞춤형 마케팅', desc: '세그먼트별 메시지·채널·KPI를 만들고 AI 말투를 점검합니다.', icon: '🎯', needsHumanApproval: true, kind: 'generate' },
  { id: 'banquet', title: '연회 제안서 작성 (루프 점검)', desc: '행사 조건으로 제안서와 견적을 만들고 기준 충족까지 자동 점검·수정을 반복합니다.', icon: '🥂', needsHumanApproval: true, kind: 'generate' },
  { id: 'ops-report', title: '호텔 운영 보고서 자동 생성', desc: '일일 운영 지표로 요약·이상 징후·조치 항목을 만듭니다.', icon: '📊', needsHumanApproval: true, kind: 'generate' },
  { id: 'agent-automation', title: 'AI Agent 업무 자동화', desc: '컨시어지 요청을 에이전트가 계획·도구호출하고 고위험 단계는 승인 대기합니다.', icon: '🤖', needsHumanApproval: true, kind: 'agent' },
  { id: 'housekeeping', title: '하우스키핑 배정 (컨텍스트 실험)', desc: '컨텍스트 요소를 켜고 끄며 결과 품질 차이를 확인합니다.', icon: '🛏️', needsHumanApproval: true, kind: 'generate' },
  { id: 'humanizer', title: 'AI Humanizer 점검기', desc: 'AI 말투 10패턴을 탐지하고 자연스러운 문장으로 수정합니다.', icon: '✍️', needsHumanApproval: true, kind: 'tool' },
  { id: 'spec-generator', title: 'SPEC.md 생성기 (Vibe Coding)', desc: '아이디어와 기능으로 SPEC.md와 배포 체크리스트를 만듭니다.', icon: '📝', needsHumanApproval: true, kind: 'generate' },
]

export const simById = (id: string) => simulations.find((s) => s.id === id)

// ---------- 가상 데이터 ----------

export const sampleInquiries = [
  { id: 'q1', label: '주말 가족 + 조식 + 주차', text: '이번 토요일 1박, 성인 2명 아이 1명인데 디럭스 더블 가능한가요? 조식 포함 가격이랑 주차도 알고 싶어요.' },
  { id: 'q2', label: '취소/변경 문의', text: '다음 주 금요일 예약인데 일정이 바뀌었어요. 취소하면 위약금이 있나요? 날짜 변경은 가능한가요?' },
  { id: 'q3', label: '반려견 동반 + 늦은 체크인', text: '반려견 한 마리랑 같이 투숙 가능할까요? 그리고 밤 11시에 체크인해도 되나요?' },
]

export const rateTable = {
  deluxeWeekday: 285000,
  deluxeWeekend: 340000,
  breakfastAdd: 45000, // 2인 기준
  extraBed: 60000,
  parking: '투숙객 1일 1대 무료',
  cancel: '체크인 3일 전까지 무료 취소, 이후 첫날 요금의 50%',
  checkin: '15:00 (24시간 프론트 운영, 심야 도착 시 사전 안내 필요)',
}

export const sampleComplaints = [
  { id: 'c1', label: '야간 소음', text: '옆방 파티 소리 때문에 새벽 2시까지 잠을 못 잤어요. 프론트에 전화했는데 20분이나 지나서야 직원이 왔습니다. 정말 실망이에요.' },
  { id: 'c2', label: '객실 청결', text: '입실했는데 욕실 바닥에 머리카락이 있고 침구에서 냄새가 났습니다. 아이랑 왔는데 불쾌했습니다. 방을 바꿔 주세요.' },
  { id: 'c3', label: '요금 불일치', text: '예약 때 안내받은 금액보다 체크아웃 때 15만원이 더 청구됐습니다. 설명도 없었고 환불해 주세요.' },
]

export const occupancyHistory = [0.71, 0.74, 0.69, 0.78, 0.86, 0.93, 0.88, 0.72, 0.75, 0.7, 0.8, 0.88, 0.95, 0.9]

export const eventOptions = [
  { id: 'none', label: '이벤트 없음', uplift: 0 },
  { id: 'concert', label: '인근 대형 콘서트 (+12%p)', uplift: 0.12 },
  { id: 'convention', label: '컨벤션센터 박람회 (+9%p)', uplift: 0.09 },
  { id: 'holiday', label: '연휴 (+10%p)', uplift: 0.1 },
  { id: 'rain', label: '태풍·폭우 예보 (-8%p)', uplift: -0.08 },
]

export const segments = [
  { id: 'family', label: '가족 고객', traits: '주말 1~2박, 키즈 시설·조식 중시', channel: '카카오 알림톡 · 인스타그램', kpi: '주말 패키지 전환율' },
  { id: 'couple', label: '커플·기념일', traits: '기념일 이벤트, 룸서비스·와인 선호', channel: '이메일 · 네이버 예약', kpi: '기념일 패키지 객단가' },
  { id: 'business', label: '비즈니스 출장', traits: '평일 연박, 조식·세탁·회의실', channel: '기업 계약 메일 · 링크드인', kpi: '평일 재방문율' },
  { id: 'foreign', label: '외국인 관광객', traits: '도심 접근성, 공항 픽업·현지 체험', channel: 'OTA · 구글 지도 · 인스타그램', kpi: 'OTA 리뷰 평점' },
]

export const banquetTypes = [
  { id: 'corp', label: '기업 송년회', perHead: 120000 },
  { id: 'wedding', label: '소규모 웨딩', perHead: 150000 },
  { id: 'mice', label: 'MICE 세미나', perHead: 95000 },
  { id: 'gala', label: '갈라 디너', perHead: 180000 },
]

export const opsSample = {
  occ: 0.83, adr: 281000, roomsAvail: 320, roomsSold: 266,
  fnbRevenue: 18400000, fnbTarget: 20000000,
  complaints: 7, complaintAvg: 3, nps: 62,
  hkMinPerRoom: 38, hkTarget: 35,
  energyKwh: 23100, energyAvg: 21000,
  noShow: 5,
}

export const housekeepingData = {
  rooms: [
    { no: '1204', status: '체크아웃', vip: true, note: 'VIP 14:00 도착' },
    { no: '1207', status: '체크아웃', vip: false, note: '' },
    { no: '1211', status: '연박', vip: false, note: '청소 거부 요청' },
    { no: '1305', status: '체크아웃', vip: false, note: '아이 동반, 침구 추가' },
    { no: '1308', status: '체크아웃', vip: true, note: 'VIP 15:00 도착' },
    { no: '1402', status: '체크아웃', vip: false, note: '' },
    { no: '1406', status: '체크아웃', vip: false, note: '연회장 인접' },
    { no: '1410', status: '연박', vip: false, note: '' },
  ],
  staff: [
    { name: '김하늘', skill: '숙련' },
    { name: '이도윤', skill: '숙련' },
    { name: '박서연', skill: '신입' },
  ],
}

export const conciergeRequests = [
  { id: 'r1', label: '체크인 변경 + 공항 픽업', text: '내일 체크인을 모레로 바꾸고 공항 픽업 시간도 오후 3시로 조정해 주세요.' },
  { id: 'r2', label: '불만 고객 보상 요청', text: '지난 투숙 때 소음 문제가 있었습니다. 환불이나 포인트 보상을 받고 싶어요.' },
  { id: 'r3', label: '기념일 룸 세팅', text: '다음 주 토요일 결혼기념일입니다. 룸 세팅과 케이크, 늦은 체크아웃을 부탁드려요.' },
]

export const humanizerSamples = [
  {
    id: 'h1',
    label: '프로모션 문구',
    text: '이번 패키지는 단순한 숙박이 아니라, 특별한 경험을 선사합니다. 또한, 조식이 포함되어 있습니다. 결과적으로, 단순히 편안함을 넘어서 가족의 추억을 만들어 드립니다. **지금 예약하지 않으시겠어요?**',
  },
  {
    id: 'h2',
    label: 'VIP 환영 안내문',
    text: '첫째, 전용 라운지를 이용하실 수 있습니다. 둘째, 체크인이 신속합니다. 셋째, 모든 서비스가 완벽하게 준비되어 있습니다. 하지만 더 많은 요청은 언제든지 환영합니다. 혁신적인 서비스는 놀라운 변화를 가져올 것입니다.',
  },
  {
    id: 'h3',
    label: '고객 만족 보고',
    text: '이번 분기 설문 결과는 고객 만족도가 높음을 보여준다. 이 서비스는 단순한 개선이 아니라 호텔의 미래로 이동하는 과정을 보여준다.',
  },
]

export const specIdeas = [
  { id: 'kpi', label: '총지배인 KPI 대시보드', features: ['OCC·ADR·RevPAR 카드', '14일 추세 차트', '목표 대비 경고', '모바일 보기'] },
  { id: 'promo', label: '주말 패키지 랜딩페이지', features: ['패키지 소개', '예약 문의 폼', '미리보기 URL 공유', '반응형 레이아웃'] },
  { id: 'banq', label: '연회 견적 계산기', features: ['인원·메뉴 선택', '견적 자동 계산', 'PDF 저장', '담당자 승인 요청'] },
]
