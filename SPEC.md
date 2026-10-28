# SPEC.md — HOTEL AI TRANSFORMATION

3D 인터랙티브 호텔리어 AI 교육 플랫폼 (React + Vite + TypeScript + Tailwind CSS + Three.js/React Three Fiber)

> 이 문서는 "아이디어 → SPEC.md → 코드 → 검증 → 배포" 바이브 코딩 흐름의 2단계 산출물입니다.
> 개발·유지보수 시 코드를 바꾸기 전에 먼저 이 문서를 갱신하세요.

---

## 1. 목적과 사용자

| 항목 | 내용 |
| --- | --- |
| 목적 | 호텔 현업 종사자가 가상 호텔을 탐험하며 AI 시장 변화·AX 전환·Prompt/Context/Harness/Loop/Graph Engineering·Claude 실무·AI Humanizer·Vibe Coding을 직무 맥락에서 학습하고 실습한다 |
| 1차 사용자 | 호텔리어(프론트오피스, 예약, 객실·하우스키핑, F&B·연회·MICE, 마케팅·RM, 경영혁신) |
| 2차 사용자 | 강사(강의 모드로 화면 공유), 콘텐츠 관리자(데이터 파일만 수정) |
| 비목표 | 실제 AI API 호출, 실고객 데이터 처리, 로그인/서버 저장 (모두 가상·시뮬레이션) |

## 2. 핵심 구조 (사용자 여정)

```
가상 호텔 선택 → 3D 호텔 입장 → 부서 선택 → AI 교육 → 직무별 실습 → 경영혁신 시뮬레이션
```

- 단일 HTML 진입점 `index.html` (SPA). 3D·교육·UI·데이터는 별도 모듈.
- 화면 상태: `world`(광장/외관) ↔ `interior`(로비·디지털 트윈). 상태는 `src/utils/store.ts`(zustand) 한 곳에서 관리.
- 단일 `<Canvas>`가 두 장면을 전환하고 `CameraRig`가 카메라 이동(store.camGoal)을 담당.

## 3. 가상 호텔 5개 (`src/data/hotels.ts`)

| 호텔 | 외관 스타일 | 부서(= 3D 핫스팟) | 연결 강의 |
| --- | --- | --- | --- |
| AURORA GRAND HOTEL | classic (금빛 핀 타워) | 프론트오피스, 예약팀, 고객경험(CX), VIP 라운지 | L01, L05, L04, L11 |
| BLUEWAVE RESORT | resort (곡면 윙·수영장) | 객실관리, 하우스키핑, 시설관리 | L02, L06, L07 |
| THE LUMEN PALACE | palace (기둥·돔) | 식음료, 연회, MICE, 행사기획 | L10, L03, L08, L09 |
| NEXUS BUSINESS HOTEL | business (유리 슬랩) | 마케팅, Revenue Management, 고객분석 | L11, L02, L09 |
| HORIZON SMART HOTEL | smart (원통 타워·링) | AI 경영혁신실, 자동화센터, AI Agent 랩, Vibe Coding 스튜디오 | L01, L04, L03, L12 |

호텔 클릭 → 카메라 이동 → "로비로 입장" → 입구 돌진 → 페이드 → 로비 진입(카메라 워크) → 부서 표지판/스테이션 클릭 → 강의 패널.

## 4. 교육 콘텐츠 (`src/data/lessons/*.ts`, `courses.ts`)

각 강의는 **학습목표 → 핵심 이론 → 원본 이미지 → 호텔 적용사례 → AI 프롬프트 → 실습 → 퀴즈** 7단계.

| ID | 강의 | 근거 자료 |
| --- | --- | --- |
| L01 | AI 시장 변화와 경영 패러다임 | 1부, 1주차, Orientation |
| L02 | DX에서 AX로의 전환 (자동화 4단계, AX 3축, OCC·ADR·RevPAR) | 2부 Ⅰ, Orientation |
| L03 | 생성형 AI와 AI Agent (오케스트레이션, 서브에이전트) | 1부 Ⅲ, 3부 Cowork |
| L04 | AI 활용의 한계·리스크·보안 (4대 리스크, 단독 결정 금지, 5가지 습관) | 2부 Ⅱ |
| L05 | Prompt Engineering (4요소, 6원칙, TCREI) | 인포그래픽 Layer 01, Orientation, 2부 |
| L06 | Context Engineering | 인포그래픽 Layer 02, 2부 |
| L07 | Harness Engineering (+ MCP/Connector/Plugin) | 인포그래픽 Layer 03, Orientation |
| L08 | Loop Engineering | 인포그래픽 Layer 04, 1부 |
| L09 | Graph Engineering | 인포그래픽 Layer 05 |
| L10 | Claude Chat · Cowork · Code (+ CLAUDE.md/SKILL.md, 모델 선택) | 3부 |
| L11 | AI Humanizer — 전형적인 AI 말투 개선 (10패턴) | HUMANIZER 인포그래픽 |
| L12 | Vibe Coding과 GitHub·Vercel 배포 (SPEC.md, 4대 원칙, CI/CD) | VIBE_CODING 인포그래픽, 3부 실습 |

원본 인포그래픽 3종은 `public/images/` 에 원본 PNG 그대로 포함하며, 뷰어(`ImageViewer`)가 휠/핀치 확대·축소, 드래그 이동, 더블클릭, 전체 화면, 다운로드를 지원한다.

## 5. 직무별 실습 (`src/data/simulations.ts`, `src/sims/*`)

모든 실습은 **가상 데이터 + 규칙 기반 시뮬레이션**이며 화면에 "SIMULATION" 배너를 표시한다. 결과는 반드시 `ApprovalGate`(사람 검토 체크리스트 → 승인/반려)를 거치고 승인 이력은 학습 현황에 기록된다.

| 실습 | 핵심 로직 |
| --- | --- |
| 예약 문의 자동 응답 | 키워드→요금표 사실 매칭, 자료에 없는 정책(반려동물 등)은 추측하지 않고 "확인 필요" |
| 고객 불만 분석·대응 | 분류·불만 강도·긴급도, 보상 포함 시 AI 단독 금지 경고 |
| 객실 수요예측 | 이동평균+요일 계절성+이벤트 가중, 백테스트 MAPE, SVG 차트 |
| ADR·RevPAR 계산 | 실제 공식(OCC, ADR, RevPAR) + 요금 변경 탄력성 시나리오 곡선 |
| 고객 맞춤형 마케팅 | 세그먼트별 메시지·채널·KPI + Humanizer 점검 전/후 |
| 연회 제안서 (루프) | 견적 계산 → 4개 검사기준 → 미달 시 수정·재시도(최대 3회) |
| 운영 보고서 자동 생성 | 지표 계산·목표 대비 이상 징후·조치 항목 |
| AI Agent 업무 자동화 | 하네스 권한 토글, 단계별 도구 호출 로그, 승인 대기 |
| 하우스키핑 배정 | 컨텍스트 요소 on/off에 따른 품질 점수·경고 |
| AI Humanizer | 10패턴 탐지·하이라이트·점수·1차 수정 |
| SPEC.md 생성기 | SPEC.md, 배포 체크리스트, GitHub/Vercel 명령어 |

## 6. 3D·시각화

- 외관: 스타일별 절차적 모델(창문 캔버스 텍스처, 네온, 글로우, 간판), 광장 그리드·나무·별·달.
- 내부: 로비 셸(바닥·기둥·샹들리에·도시 뷰), 부서 7종 스테이션(desk/room/meeting/kitchen/ops/server/lounge), **디지털 트윈**(객실 점유 상태가 갱신되는 미니 타워 + OCC/ADR/RevPAR).
- 인터랙션: 회전·확대·축소(OrbitControls, 터치 지원), 호텔 간 카메라 이동, 핫스팟 호버/클릭.
- 인터랙티브 시각화(`components/Visuals.tsx`): AI 진화 5단계, 자동화 4단계, DX vs AX, 위험 분류 게임, 5 Layers, 컨텍스트 믹서, 하네스 허브, 루프 애니메이션, 에이전트 파이프라인, 호텔 지식그래프, Claude 3종, 모델 선택, 배포 파이프라인. 전역 지식그래프(12개 강의 관계)는 헤더에서 연다.
- 저사양/모바일: WebGL 미지원·저사양·`prefers-reduced-motion`이면 자동으로 2D 간편 모드(`Fallback2D`) — 헤더에서 수동 전환 가능.

## 7. 파일·모듈 구조

```
hotel-ai-transformation/
├── index.html                 # 유일한 HTML 진입점
├── public/images/             # humanizer.png · ai-engineering.png · vibe-coding.png (원본)
├── public/models/             # (선택) glb 모델 — 호텔 확장 시 연결
├── src/
│   ├── App.tsx, main.tsx
│   ├── components/            # HotelSelector, HotelScene3D, HotelInterior, LearningPanel,
│   │                          # ImageViewer, SimulationPanel, Visuals, KnowledgeGraph, Dashboard, Header, Fallback2D
│   ├── scenes/                # HotelModel, Stations, CameraRig, textures (3D 모듈)
│   ├── sims/                  # 실습 11종 + shared(승인 게이트)
│   ├── data/                  # hotels, courses, lessons(+lessons/*), simulations, infographics  ← 콘텐츠
│   ├── utils/                 # store, calc, humanizer, env
│   └── styles/index.css
├── scripts/validate-content.mjs   # 코드·콘텐츠·이미지 연결 자동 점검
├── .github/workflows/ci.yml, vercel.json
└── SPEC.md, README.md, .gitignore, .env.example
```

## 8. 수정·유지관리 원칙

1. 호텔명·부서명·강의·퀴즈·프롬프트 → `src/data/*` 만 수정.
2. 인포그래픽 교체 → `public/images/` 의 같은 파일명으로 덮어쓰기(크기가 바뀌면 `data/infographics.ts` width/height).
3. 호텔 추가 → `data/hotels.ts` 등록 + `scenes/HotelModel.tsx` 스타일 추가(또는 `public/models/*.glb` 로드).
4. 강의 추가 → `data/lessons/*.ts` 작성 → `data/courses.ts` 에 id 등록.
5. 모든 변경 후 `npm run validate` (빌드 시 자동 실행)가 참조 오류를 잡는다.

## 9. 보안·개인정보

- API Key·개인정보는 저장소에 포함하지 않는다 (`.gitignore`: `.env*`). 검증 스크립트가 비밀정보 패턴과 `.env` 제외 여부를 점검.
- 실제 AI API를 붙일 경우 비밀키는 Vercel 환경변수 + 서버리스 함수에서만 사용 (`VITE_*` 는 브라우저에 노출됨).
- 학습 진도·승인 이력은 브라우저 `localStorage` 에만 저장(서버 전송 없음).

## 10. 완료 조건 점검표

| # | 조건 | 구현 | 검증 |
| --- | --- | --- | --- |
| 1 | 가상 호텔 5개 선택 | HotelSelector + 3D 이름표/건물 클릭 | e2e |
| 2 | 3D 외부·내부 이동 | 카메라 이동·입장 연출·로비 장면 | e2e |
| 3 | 부서별 교육 실행 | 18개 부서 → LearningPanel | e2e(18/18) |
| 4 | 인포그래픽 3개 원본 | ImageViewer (확대·전체화면) | e2e |
| 5 | PPT 핵심 내용 통합 | 12개 강의 | validate(필수 키워드 13종) |
| 6 | 프롬프트 복사·실습 | PromptCard(편집·복사·품질 점검) | e2e |
| 7 | 운영 시뮬레이션 | 실습 11종 + 승인 게이트 | e2e(24/24 승인) |
| 8 | PC·모바일 반응형 | Tailwind + 2D 대체 | e2e(1280/390px) |
| 9 | 교육자료 즉시 수정 | data/* 분리 | validate |
| 10 | GitHub·Vercel 자동 배포 | ci.yml, vercel.json, README | 연결은 사용자 계정 필요 |

## 11. 개발·검증 Loop (Loop Engineering)

```
요구사항 분석 → SPEC.md → 3D 호텔 → 교육자료 통합 → 직무별 실습 → 반응형 검증
      ↑                                                                  ↓
      └──────────── 원인 분석 → 수정 → 재검증 (validate · tsc · build · e2e) ←┘
```

이번 개발 중 Loop로 발견·수정한 사례: 전경 카메라 잘림(거리 조정) / 로비 표지판 겹침 / 광원 과다로 인한 렌더 지연 / 부서별 실습(dept.simId) 미반영 / SVG circle r 오류 / Humanizer 조사 오류·의미 반전 위험 변환 제거 / 단가 검사 기준과 기본 예산 불일치.

## 12. 알려진 제약

- 실제 AI API는 연결하지 않음(시뮬레이션). 결과 품질은 규칙 기반이므로 교육용 설명 도구로 사용.
- 첨부 PPT는 **텍스트·표·구조**를 강의 데이터로 재구성했으며 슬라이드 이미지는 포함하지 않음(원본 PPT는 저작권·용량상 저장소에 포함하지 않는 것을 권장). 인포그래픽 3종은 원본 그대로 포함.
- 강의자료의 모델명·가격·시장 수치는 자료 시점(2026) 기준이며 강의 전 최신 값 재확인 필요.
- 3D 모델은 절차적 생성(별도 glb 없음). 고품질 glb로 교체하려면 `HotelModel` 을 `useGLTF` 로 대체.
