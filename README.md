# 🏨 HOTEL AI TRANSFORMATION

3D 인터랙티브 호텔리어 AI 교육 플랫폼 — **가상 호텔 선택 → 3D 입장 → 부서 선택 → AI 교육 → 직무별 실습 → 경영혁신 시뮬레이션**

- 주제별 가상 호텔 5개(AI 동향 · LLM/RAG/API/MCP · Prompt Engineering · Vibe Coding · Other) · 부서 20개 · 강의 22개 · 실습 18종 · 원본 인포그래픽 5종
- React + Vite + TypeScript + Tailwind CSS + Three.js / React Three Fiber / Drei + Framer Motion
- 설계 문서: [SPEC.md](./SPEC.md)

## 1. 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

필요 환경: Node.js 20 이상

| 명령 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run validate` | 코드·콘텐츠·이미지 연결 오류 자동 점검 (참조 id, 이미지 경로·PNG 형식·크기, 필수 키워드, `.env` 제외, 비밀정보 패턴) |
| `npm run typecheck` | TypeScript 검사 |
| `npm run build` | validate → typecheck → 프로덕션 빌드(`dist/`) |
| `npm run preview` | 빌드 결과 미리보기 |

## 2. 강의 화면 사용법

| 동작 | 방법 |
| --- | --- |
| 호텔 선택 | 하단 칩 / 3D 이름표·건물 클릭 → 카메라 이동 → **로비로 입장** |
| 3D 조작 | 드래그 회전, 휠·핀치 확대/축소 |
| 부서 선택 | 로비의 부서 표지판·스테이션 클릭 또는 왼쪽 목록 |
| 강의 흐름 | 학습목표 → 핵심 이론 → 원본 이미지 → 호텔 적용사례 → AI 프롬프트 → 실습 → 퀴즈 (`←` `→` 키로 이동) |
| 전체 화면 강의 모드 | 패널 우상단 **강의 모드** (큰 글자, 풀스크린) |
| 원본 인포그래픽 | 헤더 🖼️ 또는 "원본 이미지" 단계 — 휠/핀치 확대, 드래그, 더블클릭, `F` 전체화면, `←→` 다른 이미지 |
| 지식그래프 | 헤더 🕸️ — 12개 강의 관계, 노드 클릭 시 강의 열기 |
| 학습 현황 | 헤더 📊 — 진도·퀴즈 기록·사람 승인 이력 |
| 저사양/모바일 | 자동으로 2D 간편 모드, 헤더의 `2D/3D` 버튼으로 수동 전환 |

> 모든 실습은 **가상 데이터 + 시뮬레이션**입니다(실제 AI API 미연결). AI 결과는 반드시 사람이 검토·승인하도록 `승인 게이트`를 거칩니다.

## 3. 콘텐츠 수정 방법 (코드 변경 없이)

| 바꾸고 싶은 것 | 수정할 파일 |
| --- | --- |
| 호텔명·주제·부서명(부서 → 강의 연결) | `src/data/hotels.ts` (한 부서에 `extraLessonIds`로 관련 강의 추가 가능) |
| 강의 내용(이론·사례·프롬프트·퀴즈) | 호텔별 파일 `src/data/lessons/trend.ts`(BLUEWAVE) · `connect.ts`(NEXUS) · `prompt.ts`(AURORA) · `vibe.ts`(HORIZON) · `claude.ts`(LUMEN) |
| 호텔별 강의 묶음(코스) | `src/data/courses.ts` |
| 실습 가상 데이터(문의 문구, 요금표, 점유율 이력 등) | `src/data/simulations.ts` |
| 인포그래픽 이미지 | `public/images/` 의 `llm-rag-agent.png`, `iceberg.png`, `ai-engineering.png`, `humanizer.png`, `vibe-coding.png` 를 **같은 파일명**으로 교체 (크기가 달라지면 `src/data/infographics.ts`의 width/height) |

수정 후 `npm run validate` 로 연결 오류(없는 강의·실습 id, 깨진 이미지 경로 등)를 즉시 확인할 수 있고, `npm run build` 에서도 자동 실행됩니다.

### 확장
- **강의 추가**: `src/data/lessons/*.ts` 에 `Lesson` 객체 추가 → `courses.ts` 의 `lessonIds` 에 등록 → 부서(`hotels.ts`)의 `lessonId`/`extraLessonIds` 로 연결
- **호텔 추가**: `hotels.ts` 에 객체 추가(부서 포함) → `src/scenes/HotelModel.tsx` 에 외관 스타일 추가(또는 `public/models/*.glb` + `useGLTF`) → `position`/`facing` 지정
- **실습 추가**: `src/sims/` 에 컴포넌트 작성 → `data/simulations.ts` 등록 → `components/SimulationPanel.tsx` 의 registry 연결

## 4. GitHub 저장 → Vercel 자동 배포

```bash
# 1) 로컬 검증
npm run build

# 2) GitHub (저장소 이름: hotel-ai-transformation)
git init
git add .
git commit -m "feat: HOTEL AI TRANSFORMATION 초기 버전"
git branch -M main
git remote add origin https://github.com/<계정>/hotel-ai-transformation.git
git push -u origin main
```

3. [Vercel](https://vercel.com/new) → **Import Git Repository** → `hotel-ai-transformation` 선택 (Framework: Vite 자동 감지, `vercel.json` 포함)
4. 이후 `main` 브랜치에 push 할 때마다 **자동 빌드·배포**(HTTPS 기본), PR 에는 미리보기 URL이 생성됩니다.
5. `.github/workflows/ci.yml` 이 push/PR 마다 `validate → typecheck → build` 를 실행합니다.

### 환경변수·보안
- API Key·개인정보는 **절대 GitHub에 올리지 않습니다** (`.env*` 는 `.gitignore`). `.env.example` 만 커밋됩니다.
- 실제 AI API를 연결할 때는 Vercel → Project Settings → Environment Variables 에 등록하고 서버리스 함수(`api/`)에서만 사용하세요. `VITE_` 접두사 변수는 브라우저에 노출됩니다.
- 학습 진도·승인 이력은 브라우저 `localStorage` 에만 저장되며 서버로 전송되지 않습니다.

## 5. 문제 해결

| 증상 | 확인 |
| --- | --- |
| 3D가 보이지 않음/느림 | 헤더에서 `2D` 간편 모드로 전환. 하드웨어 가속이 꺼져 있으면 브라우저 설정에서 켜세요 |
| `validate` 실패 | 출력된 ✖ 항목(없는 id, 이미지 경로 등)을 `src/data/*` 에서 수정 |
| 인포그래픽이 안 보임 | `public/images/` 파일명이 위 5개 이름과 같은지 확인 |
| 한글 폰트가 다르게 보임 | Pretendard CDN 접속이 안 되면 시스템 폰트(맑은 고딕 등)로 대체됩니다 |

## 6. 라이선스·출처

강의 내용은 「AI와 경영혁신」 1·2·3부, 「AI와 경영혁신 1주차」, 「Gen AI Orientation」, 강의자료 4·5·6주차(PDF) 및 인포그래픽 5종(LLM·RAG·에이전트, Gen AI Iceberg, AI ENGINEERING 5 LAYERS, 전형적인 AI 말투, 바이브코딩)을 재구성한 교육용 자료입니다. 시장 수치·모델명·가격은 자료 작성 시점 기준이므로 강의 전 최신 값으로 확인하세요. 모든 호텔·고객·수치 데이터는 가상입니다.
