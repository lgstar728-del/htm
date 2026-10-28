import type { Lesson } from '../../types'

// 호텔 주제별 강의 — 이 파일의 강의 내용만 수정하면 3D 로비의 교육 콘텐츠가 바뀝니다.
export const connectLessons: Lesson[] = [
  {
    id: 'L05',
    no: 5,
    title: 'LLM · RAG · AI 에이전트 · 에이전틱 AI',
    subtitle: 'LLM에서 에이전틱 AI까지 — 단계마다 이전 기능을 포함하며 확장된다',
    icon: '🤖',
    courseId: 'connect',
    sources: ['LLM vs RAG vs AI 에이전트 vs 에이전틱 AI 인포그래픽', '1부 Ⅲ. AI 모델의 진화: 텍스트에서 에이전트로', '3부 Claude Cowork 서브에이전트', '4주차: 워크플로우·에이전트·파이프라인'],
    objectives: [
      'LLM, RAG, AI 에이전트, 에이전틱 AI의 정의와 단계별 확장 관계를 설명할 수 있다',
      'LLM 단독 답변의 한계(실시간·내부 정보 모름, 환각)와 RAG가 근거 있는 답변을 만드는 방식을 이해한다',
      '에이전트 오케스트레이션과 서브에이전트 역할 분담(계획·조사·작성·포맷·검수)을 호텔 업무에 설계할 수 있다',
    ],
    theory: [
      {
        t: 'steps',
        title: 'LLM → RAG → AI 에이전트 → 에이전틱 AI (각 단계는 이전 단계의 기능을 포함하며 확장됩니다)',
        items: [
          { label: '① LLM 언어모델', sub: 'Large Language Model', body: '프롬프트를 입력하면 학습된 지식만으로 답변하는 모델입니다. 학습한 데이터만 알고 있고 실시간 정보나 외부 문서는 모르며, 텍스트 생성·요약·번역 등이 가능합니다.', hotel: '"조식 포함 요금이 얼마예요?" → 우리 호텔 요금표를 모르므로 일반론 또는 그럴듯한 오답(환각)' },
          { label: '② RAG 검색증강생성', sub: 'Retrieval-Augmented Generation', body: '외부 문서를 검색해 필요한 정보를 찾아 근거와 함께 답변합니다. 프롬프트 → 외부 문서 검색(내 문서·논문·웹) → LLM(검색된 정보+생성) → 답변(내 문서 기반). 내 문서를 바탕으로 근거 있는 답변, 기업·기관의 내부 자료 활용, 최신 정보 반영이 가능합니다.', hotel: '호텔 요금·정책 문서를 검색해 "정책 3항에 따라 …" 처럼 출처와 함께 답변 (→ L06 실습)' },
          { label: '③ AI 에이전트', sub: '도구를 쓰며 목표 완수', body: '하나의 목표를 완료할 때까지 다양한 도구를 사용하며 작업을 수행하는 AI입니다. 작업 지시(목표) → 에이전트가 검색(웹/DB)·코드 실행(분석·처리)·API 호출(외부 서비스 연동)을 스스로 선택 → 작업 완료(결과물). 사용자가 지시한 작업이 완료될 때까지 수행합니다.', hotel: '예약 변경 요청을 받아 PMS 조회 → 변경안 작성 → 안내 메일 초안까지 처리' },
          { label: '④ 에이전틱 AI', sub: '여러 에이전트의 협업', body: '여러 에이전트가 협력해 복잡한 목표를 계획하고 스스로 수행하는 AI 시스템입니다. 최종 목표 → 오케스트레이터(계획·조정) → 연구 에이전트(조사·검색)·개발 에이전트(분석·구축)·검토 에이전트(검증·평가) → 최종 결과(완료·배포). 역할을 분담하고 절차를 자율적으로 수행하며 연구 → 구축 → 검토 같은 복합 작업을 자동으로 진행합니다.', hotel: '연회 제안서: 계획·조사·작성·검수 에이전트가 병렬 협업, 최종은 사람이 승인' },
        ],
      },
      {
        t: 'table',
        caption: '네 가지 한눈에 비교',
        head: ['', 'LLM', 'RAG', 'AI 에이전트', '에이전틱 AI'],
        rows: [
          ['핵심', '학습된 지식으로 답변', '검색한 근거로 답변', '도구를 써서 목표 완수', '여러 에이전트가 협업해 계획·수행'],
          ['아는 범위', '학습 데이터만', '+ 내 문서·최신 정보', '+ 도구·외부 서비스', '+ 역할 분담·자율 계획'],
          ['한계', '실시간·내부 정보 모름, 환각', '검색 품질에 좌우', '권한·안전장치 필요', '조율 복잡도·거버넌스'],
          ['사람의 역할', '질문·검증', '자료 관리·검증', '위임·승인', '설계·감독(Human-in-the-Loop)'],
        ],
      },
      { t: 'p', text: '생성형 AI는 요청에 맞춰 글·이미지·코드를 "생성"합니다. AI Agent는 목표 달성을 위해 추론·계획·실행을 결합해 스스로 작업하는 시스템입니다. "Copilot = 인터페이스, Agent = 특정 프로세스를 처리하는 AI 시대의 앱"입니다.' },
      { t: 'visual', kind: 'agent', title: '에이전트 파이프라인 — 목표를 위임하면 스스로 계획·실행·검수' },
      {
        t: 'list',
        items: [
          '에이전트 오케스트레이션: 사람의 역할이 "실행자"에서 "지휘자"로 이동합니다.',
          '20만 토큰 이상의 컨텍스트 윈도우를 활용해 장기 프로젝트의 일관성을 유지합니다.',
          '다양한 기능의 에이전트를 조직처럼 운영하는 Harness Engineering으로 확산 중입니다.',
          'LLM 성능 자체뿐 아니라 에이전트 기능 강화 방향으로 AI 개발 업계가 전환하고 있습니다.',
        ],
      },
      {
        t: 'table',
        caption: '서브에이전트 역할 분담 예시 — "시장 조사 후 임원진 발표용 PPT를 만들어줘"',
        head: ['에이전트', '역할'],
        rows: [
          ['① 계획(Plan)', '전체 작업 순서 설계, 타임라인 수립'],
          ['② 조사(Research)', '여러 대가 동시에 경쟁사·트렌드·뉴스를 병렬 수집'],
          ['③ 콘텐츠(Content)', '수집 데이터로 슬라이드 핵심 텍스트 초안'],
          ['④ 포맷팅(PPTX Skill)', '실제 파워포인트 형식으로 디자인·저장'],
          ['⑤ 검토/QA(Reviewer)', '데이터 오류·오탈자 교차 검증 후 완료 보고'],
        ],
      },
      {
        t: 'callout',
        tone: 'cyan',
        title: '병렬 서브에이전트의 4가지 장점',
        text: '① 컨텍스트 보존(요약 결과만 보고) ② 병렬 작업(Time Collapse: 몇 시간→몇 분) ③ 비용·속도 최적화(무거운 작업은 고성능 모델, 단순 작업은 Haiku) ④ 권한·보안 통제',
      },
      {
        t: 'callout',
        tone: 'gold',
        title: 'AGI는 스위치가 아니라 연속적 과정',
        text: '"보조 → 협업 → 위임 가능한 동료 → 자율 운영"으로 이어집니다. 피지컬 AI는 "이걸 해야 하는가(Should I do this)?"를 스스로 판단한다는 점에서 단순 로봇(Do This)과 다릅니다.',
      },
      {
        t: 'callout',
        tone: 'red',
        title: '경영 시사점: SaaS 재편과 거버넌스',
        text: '에이전트·바이브 코딩이 기존 SaaS 기능을 대체하기 시작했습니다. 우리 호텔 업무·시스템의 "AI 대체 취약성(Disruption Risk)"을 진단하고, 고위험 결정에는 Human-in-the-Loop를 반드시 두어야 합니다.',
      },
    ],
    infographicId: 'llm-rag-agent',
    infographicNote: '4단계 구조(LLM → RAG → AI 에이전트 → 에이전틱 AI)와 각 단계의 도식을 확대해 보세요. 각 단계는 이전 단계의 기능을 포함하며 확장됩니다.',
    hotelCases: [
      { dept: '경영혁신', title: '컨시어지 요청 전체 처리', text: '"내일 체크인을 모레로 변경하고 공항 픽업도 조정해줘" → 에이전트가 PMS 조회→변경안 작성→안내 메일 초안→캘린더 등록까지 수행, 요금 확정은 사람이 승인.' },
      { dept: 'F&B·연회', title: '연회 제안서 서브에이전트 분업', text: '계획(일정)·조사(경쟁 호텔 패키지)·작성(제안서)·검수(견적 오류) 에이전트가 병렬로 협업합니다.' },
      { dept: '마케팅·RM', title: '주간 경쟁사 요금 모니터링', text: '리서치 에이전트가 경쟁 호텔 요금 페이지를 비교 정리하고 RM 팀이 가격 의사결정을 합니다.' },
    ],
    prompts: [
      {
        title: '연회 제안서 서브에이전트 설계 프롬프트',
        text: '당신은 호텔 업무 자동화 설계자입니다.\n목표: "기업 송년회(120명, 예산 1인 12만원) 연회 제안서를 만든다"\n이 목표를 5개 서브에이전트(계획/조사/작성/포맷/검수)로 나누어 설계하세요.\n각 에이전트별로 입력, 출력, 사용할 도구, 사람이 승인할 지점을 표로 정리하고, 마지막에 전체 실행 순서를 번호로 제시하세요.\n조건: 견적 금액과 계약 조건은 AI가 확정하지 말고 "사람 승인 필요"로 표시.',
      },
    ],
    practice: {
      simId: 'agent-automation',
      mission: 'AI Agent가 컨시어지 요청을 단계별로 처리하는 과정을 실행하고, 고위험 단계에서 사람이 승인하세요.',
      steps: ['컨시어지 요청을 선택한다', '권한(하네스) 설정을 확인한다', '에이전트가 계획·도구 호출을 수행한다', '승인 대기 단계에서 사람이 승인/반려한다'],
    },
    quiz: [
      { q: 'RAG가 LLM 단독 사용보다 나은 점은?', options: ['모델이 더 커진다', '외부 문서를 검색해 내 자료·최신 정보를 근거와 함께 답한다', '이미지를 만든다', '비용이 항상 0원이다'], answer: 1, explain: 'RAG는 질문과 관련된 외부 문서를 검색해 그 내용을 근거로 답하게 합니다.' },
      { q: '"Copilot = 인터페이스, Agent = ?"에서 ?에 들어갈 말은?', options: ['데이터베이스', '특정 프로세스를 처리하는 AI 시대의 앱', '검색 엔진', '단순 챗봇'], answer: 1, explain: '강의자료: Copilot은 인터페이스, Agent는 특정 프로세스를 처리하는 AI 시대의 앱입니다.' },
      { q: '서브에이전트를 병렬로 쓰는 장점이 아닌 것은?', options: ['컨텍스트 보존', '시간 압축(Time Collapse)', '권한·보안 통제', '사람의 검토가 불필요해짐'], answer: 3, explain: '서브에이전트를 써도 고위험 결정에는 사람의 검토·승인이 필요합니다.' },
      { q: '에이전트 시대 사람의 역할 변화는?', options: ['지휘자에서 실행자로', '실행자에서 지휘자로', '관찰자로만', '변화 없음'], answer: 1, explain: '에이전트 오케스트레이션에서 사람은 실행자에서 설계자·감독자(지휘자)로 이동합니다.' },
    ],
  },
  {
    id: 'L06',
    no: 6,
    title: 'Gen AI 빙산(Iceberg) — 보이는 것과 실제로 필요한 것',
    subtitle: '입문 · 중급 · 고급 단계별 기술 지형과 RAG 파이프라인',
    icon: '🧊',
    courseId: 'connect',
    sources: ['GenAI_IceBerg 인포그래픽 (THE GEN AI ICEBERG)', 'LLM·RAG·AI 에이전트·에이전틱 AI 인포그래픽'],
    objectives: [
      '생성형 AI 기술 지형을 입문(Beginner)·중급(Intermediate)·고급(Advanced) 3단계로 설명할 수 있다',
      'RAG 파이프라인의 구성요소(청킹·임베딩·벡터DB·검색·리랭킹·평가)의 역할을 이해한다',
      '호텔 업무에서 어느 단계까지 직접 다뤄야 하는지, 무엇을 전문팀·벤더에 맡길지 판단할 수 있다',
    ],
    theory: [
      { t: 'p', text: 'ChatGPT·Claude·Gemini를 쓰는 것은 빙산의 일각입니다. 서비스를 직접 만들고 연결하려면 임베딩·RAG·벡터DB 같은 중급 기술이, 대규모 운영에는 파인튜닝·가드레일·멀티에이전트 같은 고급 기술이 필요합니다.' },
      {
        t: 'steps',
        title: '빙산 3단계 — 눌러서 항목 확인',
        items: [
          { label: '입문 Beginner', sub: '바로 사용해 결과물을 얻는 단계', body: 'ChatGPT(대화형 질문·글쓰기·요약), Claude(긴 문서 이해·분석), Gemini(구글 생태계 연동 멀티모달) · Prompt Engineering(역할 부여·단계적 지시·예시 제공) · Tokens & Context(입력 가능한 텍스트 분량과 컨텍스트 창의 한계) · Python Basics(간단한 스크립트, API 호출).', hotel: '프론트·예약·마케팅 담당자가 바로 쓰는 영역' },
          { label: '중급 Intermediate', sub: 'AI를 활용해 직접 만들고 연결하는 단계', body: 'Embeddings(텍스트→벡터, 의미 검색·추천) · RAG(외부 지식을 검색해 답변 품질 향상) · Chunking(긴 문서를 작은 단위로 분할) · Vector DB(Pinecone, Weaviate 등) · LangChain·LlamaIndex(연결·RAG 구축 도구) · Fine-tuning(도메인 특화) · Function Calling(외부 API·도구 호출) · Structured Outputs(JSON 등 정형 출력) · FastAPI·Streamlit(서비스·데이터 앱) · Reranking(검색 결과 재정렬) · Evaluation(FAISS 등 평가) · Agents(ReAct).', hotel: '호텔 규정집 Q&A 챗봇, 리뷰 분석 도구를 직접 만드는 영역' },
          { label: '고급 Advanced', sub: '대규모 서비스·맞춤형 모델 구축·운영', body: 'LoRA/QLoRA(효율적 파인튜닝) · vLLM(빠른 서빙) · GraphRAG(지식그래프+RAG) · Semantic Caching(의미 기반 캐싱으로 속도·비용 최적화) · 생성형 AI 벤치마크 평가 프레임워크 · Guardrails(안전·윤리 필터링) · DPO/RLHF(사람 선호 반영 학습) · Knowledge Graphs · Multi-Agent Systems · Hybrid Search(키워드+의미 검색) · Custom Models(CUDA 등 GPU 최적화).', hotel: '체인 전체 규모의 개인화 추천·운영 자동화 — 전문팀·벤더 영역' },
        ],
      },
      {
        t: 'table',
        caption: 'RAG 파이프라인 한눈에 보기',
        head: ['단계', '하는 일', '호텔 예시'],
        rows: [
          ['① 청킹(Chunking)', '긴 문서를 의미 단위로 나눈다', '객실 정책 PDF를 항목(취소·주차·조식)별 문단으로 분할'],
          ['② 임베딩(Embedding)', '텍스트를 의미를 담은 숫자 벡터로 바꾼다', '"환불" ≈ "취소 수수료" 처럼 뜻이 가까운 문장을 가깝게 배치'],
          ['③ 벡터 DB', '벡터를 저장하고 가까운 것을 빠르게 찾는다', 'Pinecone, Weaviate 등'],
          ['④ 검색 + 리랭킹', '질문과 관련 높은 청크를 찾아 다시 정렬한다', '질문 "반려견 동반 가능?" → 반려동물 정책 청크가 1순위'],
          ['⑤ 생성', 'LLM이 검색된 근거와 함께 답한다', '"정책 3항에 따라 …" + 출처 표시'],
          ['⑥ 평가', '검색·답변 품질을 측정한다', '정답 질문 세트로 정확도·근거 일치 점검'],
        ],
      },
      {
        t: 'callout',
        tone: 'cyan',
        title: '인포그래픽의 MCP 설명 주의',
        text: '이 인포그래픽의 고급 단계에는 MCP가 "멀티모달 컨텍스트 처리 프레임워크"로 요약되어 있습니다. 그러나 4주차 강의자료 기준 MCP는 Anthropic이 공개한 Model Context Protocol, 즉 AI와 외부 데이터·도구를 연결하는 표준입니다. 이 플랫폼은 강의자료 정의를 따릅니다 (→ L07).',
      },
      {
        t: 'callout',
        tone: 'gold',
        title: '경영 시사점',
        text: '대부분의 호텔 업무 자동화는 입문~중급(프롬프트·RAG·함수 호출)으로 충분합니다. 고급 영역은 규모·보안·비용 요구가 클 때 전문팀이나 벤더와 협업하세요. "무엇을 직접 하고 무엇을 맡길까"를 정하는 것이 AI 투자의 출발점입니다.',
      },
    ],
    infographicId: 'iceberg',
    infographicNote: '수면 위(입문)와 수면 아래(중급·고급)가 어떻게 나뉘는지, 중급 단계의 RAG 관련 항목(Embeddings·RAG·Chunking·Vector DB·Reranking)을 확대해 보세요.',
    hotelCases: [
      { dept: '프론트오피스', title: '규정집 Q&A 챗봇 (RAG)', text: '호텔 정책 문서를 청킹·임베딩해 직원이 "취소 수수료는?"처럼 물으면 근거 문단과 함께 답하도록 만듭니다. (실습)' },
      { dept: '마케팅', title: '리뷰 분석 (임베딩 + 분류)', text: 'OTA 리뷰를 임베딩으로 묶어 "조식 대기", "소음" 같은 주제 군집을 찾고 주간 리포트를 만듭니다.' },
      { dept: '예약·RM', title: 'Function Calling + 정형 출력', text: '문의 문장에서 날짜·인원·객실 유형을 JSON으로 추출하고 PMS 조회 함수를 호출하게 합니다.' },
      { dept: '경영진', title: '가드레일', text: '고객 응대 AI가 환불을 약속하거나 개인정보를 말하지 않도록 안전 규칙(Guardrails)을 둡니다.' },
    ],
    prompts: [
      {
        title: '호텔 문서 RAG 설계 프롬프트',
        text: '당신은 생성형 AI 솔루션 아키텍트입니다.\n목표: 호텔 직원용 "정책 Q&A 챗봇"을 RAG로 만든다.\n아래를 표로 설계해 주세요.\n1) 문서 목록(취소·주차·조식·VIP·분실물 등)과 청킹 기준(크기·겹침)\n2) 임베딩·벡터DB·리랭킹 선택 이유\n3) 답변 규칙: 근거 청크 번호 표시, 자료에 없으면 "확인 필요"\n4) 평가: 테스트 질문 10개와 정답 근거\n5) 개인정보·보안 유의사항\n조건: 도구는 예시로만 제시하고 특정 벤더를 단정하지 말 것.',
      },
    ],
    practice: {
      simId: 'rag',
      mission: '같은 질문을 LLM 단독과 RAG로 답하게 해 보고, 청킹 단위와 검색 개수(top-k)가 답의 정확도에 미치는 영향을 확인하세요.',
      steps: ['호텔 정책 질문을 선택한다', 'LLM 단독 답변과 RAG 답변을 비교한다', '청킹 단위와 top-k를 바꿔 검색 결과를 본다', '근거가 확인된 답변만 승인한다'],
    },
    quiz: [
      { q: 'RAG가 하는 일로 가장 알맞은 것은?', options: ['모델을 처음부터 다시 학습한다', '외부 문서를 검색해 근거와 함께 답하게 한다', '이미지를 생성한다', '코드를 배포한다'], answer: 1, explain: 'RAG(검색증강생성)는 외부 지식을 검색해 답변 품질과 근거를 높입니다.' },
      { q: '긴 문서를 작은 단위로 나눠 효율적으로 처리하는 방법은?', options: ['Reranking', 'Chunking', 'Fine-tuning', 'Guardrails'], answer: 1, explain: 'Chunking은 긴 문서를 의미 단위로 분할해 검색·처리 효율을 높입니다.' },
      { q: '빙산 인포그래픽에서 "AI를 활용해 직접 만들고 연결하는 단계"는?', options: ['입문(Beginner)', '중급(Intermediate)', '고급(Advanced)', '해당 없음'], answer: 1, explain: '중급 단계에서 임베딩·RAG·벡터DB·함수 호출 같은 기술로 서비스를 만들고 연결합니다.' },
    ],
  },
  {
    id: 'L07',
    no: 7,
    title: 'API와 MCP — AI가 외부 시스템과 대화하는 법',
    subtitle: 'API는 연결 다리, MCP는 API 위에 씌우는 AI 친화적 통역기',
    icon: '🔌',
    courseId: 'connect',
    sources: ['4주차 보충 수업: API란 무엇인가 / API 활용 / 클로드 에이전틱 파이프라인과 API / API vs MCP', '4주차 [Recap] MCP · 커넥터 · 플러그인', 'Gen AI Orientation: MCP란 무엇인가'],
    objectives: [
      'API(엔드포인트·요청·응답·인증)를 레스토랑 웨이터 비유로 설명할 수 있다',
      'API와 MCP의 차이, MCP가 API를 대체하지 않는 이유를 설명할 수 있다',
      'MCP의 구성(Host·Client·Server, Tools·Resources·Prompts)과 연결 방식(로컬 stdio / 원격 HTTP·OAuth)을 이해한다',
    ],
    theory: [
      { t: 'p', text: 'API(Application Programming Interface)는 서로 다른 프로그램이 소통하도록 돕는 중개자입니다. 주방(시스템)에 직접 들어가지 않아도 웨이터(API)에게 주문하면 음식(데이터)을 가져다주는 것과 같습니다.' },
      {
        t: 'table',
        caption: '실생활 속 API 예시',
        head: ['예시', '무엇을 연결하나'],
        rows: [
          ['날씨', '기상청 서버의 날씨 데이터를 API로 받아와 화면에 표시'],
          ['소셜 로그인', '"카카오로 로그인" 버튼 → 해당 기업 API가 본인 인증을 대신 처리'],
          ['간편결제', '토스·네이버페이·Stripe 같은 결제 API로 금융회사 시스템과 연결'],
          ['지도·번역·AI', '구글 맵 API, 번역 API, Claude API'],
          ['공공데이터 포털(data.go.kr)', '엑셀·CSV 파일 데이터와 오픈 API URL 제공 (관광·축제 정보 등)'],
        ],
      },
      {
        t: 'list',
        items: [
          'API 활용 장점 ① 바퀴를 새로 발명할 필요가 없다(지도·결제·날씨를 처음부터 만들지 않음)',
          '② 보안 강화 — 상대 시스템의 DB 내부까지 들어가지 않고 허용된 데이터만 받는다',
          '③ 시간과 비용 절약 — 개발 속도가 빨라지고 제공자는 API만 관리하면 된다',
          'API는 정해진 주소(엔드포인트)에 정해진 형식으로 요청하며, API Key·Client ID/Secret 같은 인증 정보는 외부에 유출되지 않게 별도 보관한다',
        ],
      },
      { t: 'code', caption: 'API 호출 개념 예시 (키는 코드가 아닌 환경변수에 보관)', text: 'GET https://api.example.com/weather?city=Seoul\nAuthorization: Bearer ${API_KEY}   # .env 에 보관, GitHub 업로드 금지\n\n응답(JSON): { "city": "Seoul", "temp": 18, "rain": false }' },
      {
        t: 'callout',
        tone: 'cyan',
        title: '에이전틱 파이프라인과 API — 판단 → API 호출 → 결과 확인 → 다음 행동',
        text: '"이번 주 출장 일정 짜줘" → AI: 캘린더 조회(MCP/커넥터 또는 API) → 목요일이 비었군 → 항공권 조회 → 오전표가 비싸니 오후표 예약 API 호출 → 최종 일정 보고. 클로드에 API를 쓰게 하려면 ① API URL과 Key/Secret을 별도 파일로 등록 ② 실행 가능한 샌드박스나 SDK(Claude Agent SDK 등) 권한 부여 ③ 자율 실행(예: 조회 API로 대상을 찾고 환불 API를 반복 호출)의 순서로 진행합니다. 환불처럼 되돌리기 어려운 호출은 반드시 사람 승인 단계를 둡니다.',
      },
      {
        t: 'table',
        caption: 'API vs MCP',
        head: ['비교 항목', 'API', 'MCP (Model Context Protocol)'],
        rows: [
          ['비유', '개별 식당의 전용 주문서', '배달앱 통합 표준 규격 — 모든 식당이 "AI 표준 메뉴판" 하나로 통일'],
          ['정의', '프로그램과 프로그램이 소통하는 규칙', 'AI 모델과 외부 환경(데이터·도구)이 소통하는 표준 프로토콜'],
          ['주 대상', '인간 개발자가 코드를 짤 때 사용', 'AI 에이전트가 스스로 읽고 이해할 때 사용'],
          ['소통 방식', '고정된 주소(Endpoint)에 정해진 형식으로만 요청', 'AI가 서버에 접속하면 서버가 "나 이런 기능 있어"라며 자율 탐색(Discovery)'],
          ['연동 비용', '10개 서비스 연동 시 10개의 서로 다른 API 코드', '10개 서비스가 MCP 표준을 따르면 AI는 단 하나의 통로로 모두 제어'],
          ['인증', 'API Key, Client ID/Secret 필요', '커넥터는 서비스 인증(OAuth) 또는 Client ID/Secret 입력 요청'],
        ],
      },
      { t: 'callout', tone: 'gold', title: '핵심 오해 바로잡기', text: '"MCP가 나오면 API는 없어지나요?" — 아닙니다. MCP는 API를 대체하는 것이 아니라 API 위에 씌우는 AI 친화적 통역기이며, MCP도 결국 API 위에서 작동합니다.' },
      {
        t: 'steps',
        title: 'MCP 한눈에 — 구성·연결·확장',
        items: [
          { label: '3대 구성', sub: 'Host · Client · Server', body: 'Host = Claude.ai·Claude Desktop·Claude Code 같은 AI 애플리케이션 / Client = Host 내부에서 서버와 통신을 담당하는 커넥터(USB-C 포트) / Server = Notion·Slack·GitHub·DB 등 실제 도구·데이터를 노출하는 외부 프로그램. 서버가 제공하는 것은 Tools(모델이 호출하는 함수) · Resources(읽어 오는 데이터) · Prompts(미리 정의된 작업 템플릿)입니다.' },
          { label: '연결 방식', sub: '로컬 stdio / 원격 HTTP·OAuth', body: '로컬(stdio): 내 컴퓨터에서 실행되는 서버(파일시스템, 로컬 DB) — Claude Desktop/Code에서 주로 사용. 원격(HTTP/SSE, 보통 OAuth): 클라우드에 배포된 서버(Notion, Slack, Google Drive) — Claude.ai에서 원클릭 연동. 커스텀 커넥터는 Anthropic 클라우드에서 접속하므로 서버가 공개 인터넷에 노출되어야 합니다.' },
          { label: 'Connector · Plugin', sub: '단일 연결 vs 패키지', body: 'Connector = MCP로 만든 단일 외부 데이터 소스 연결(예: Notion). 한 번 인증하면 세션 간 유지. Plugin = Skills + Connectors + 슬래시 커맨드 + 서브에이전트(Claude Code는 Hooks·MCP 서버·LSP까지)를 묶어 배포하는 상위 워크플로우 단위입니다. Team/Enterprise 관리자는 플러그인을 제한하거나 조직 전체에 자동 설치하도록 정책을 설정할 수 있습니다.' },
        ],
      },
      { t: 'callout', tone: 'red', title: '보안 유의', text: '검증되지 않은 커스텀 커넥터는 신뢰할 수 있는 제공자만 연결하세요. Anthropic이 모든 플러그인의 MCP 서버·파일·동작을 검증하지는 않으므로 설치 전 신뢰도를 확인해야 합니다. 고객 개인정보가 오가는 커넥터는 권한 범위(읽기/쓰기)를 최소화하세요.' },
    ],
    hotelCases: [
      { dept: '프론트오피스', title: '날씨 API → 객실 안내', text: '체크인 전날 날씨 API로 비·태풍 예보를 받아 우산·셔틀 안내 문구 초안을 자동 작성합니다.' },
      { dept: '마케팅', title: '공공데이터 포털 + Notion 파이프라인', text: '지역 축제 오픈 API로 일별 행사 정보를 수집해 Notion에 정리하고 패키지 홍보 콘텐츠 초안을 만듭니다. (4주차 데모 사례를 호텔 업무로 응용)' },
      { dept: '컨시어지', title: 'MCP로 PMS·Slack·Calendar 연결', text: '서비스마다 따로 코드를 짜지 않고 MCP 서버를 연결해 "오늘 VIP 도착 목록을 Slack에 공유"를 하나의 통로로 처리합니다. (실습)' },
      { dept: '결제·환불', title: '환불 API는 승인 후 호출', text: '대상 조회는 자동화하되 환불 API 호출은 담당 매니저 승인 이후에만 실행하도록 권한을 나눕니다.' },
    ],
    prompts: [
      {
        title: 'API vs MCP 도입 검토 프롬프트',
        text: '당신은 호텔 IT 아키텍트입니다.\n우리 호텔은 PMS, 이메일, 캘린더, Slack, 예약 채널(OTA)을 AI 에이전트와 연결하려 합니다.\n1) 각 시스템을 "기존 API 직접 연동 / 커넥터(MCP) 사용" 중 무엇으로 연결할지 표로 추천\n2) 연결 시 필요한 인증 정보와 보관 위치(.env, 비밀 관리)\n3) 읽기 전용 / 쓰기 / 사람 승인 필요 작업 분류\n4) 보안 위험 3가지와 대응\n조건: 확실하지 않은 제품 사양은 "확인 필요"로 표시.',
      },
    ],
    practice: {
      simId: 'mcp-connect',
      mission: 'API 방식과 MCP 방식으로 호텔 시스템을 연결했을 때의 연동 부담을 비교하고, MCP 도구 호출 과정을 확인하세요.',
      steps: ['연결할 호텔 시스템을 선택한다', 'API 방식과 MCP 방식의 연동 개수를 비교한다', '에이전트의 도구 탐색·호출 로그를 확인한다', '외부 발송 단계에서 사람이 승인한다'],
    },
    quiz: [
      { q: 'MCP와 API의 관계로 맞는 것은?', options: ['MCP가 API를 완전히 대체한다', 'MCP는 API 위에 씌우는 AI 친화적 통역기다', 'API는 AI 전용, MCP는 사람 전용이다', '둘은 아무 관계가 없다'], answer: 1, explain: 'MCP는 API를 대체하지 않고 API 위에서 AI가 도구를 자율 탐색·호출하게 해 줍니다.' },
      { q: 'MCP 3대 구성요소가 아닌 것은?', options: ['Host', 'Client', 'Server', 'Database'], answer: 3, explain: 'Host(AI 앱) · Client(연결 담당 커넥터) · Server(외부 도구)입니다.' },
      { q: '환불 API 호출을 에이전트에게 맡길 때 올바른 설계는?', options: ['완전 자동 실행', '조회는 자동, 환불 호출은 사람 승인 후 실행', '키를 코드에 직접 입력', '로그를 끈다'], answer: 1, explain: '되돌리기 어려운 금전 실행은 권한을 나누고 사람 승인을 거쳐야 합니다.' },
    ],
  },
  {
    id: 'L08',
    no: 8,
    title: 'Harness Engineering',
    subtitle: 'Layer 03 · AI가 사용할 도구와 규칙을 연결하고 통제하는 시스템',
    icon: '⚙️',
    courseId: 'connect',
    sources: ['AI ENGINEERING: 5 LAYERS (Layer 03)', '1부: AI 에이전트 오케스트레이션', 'Gen AI Orientation: 커넥터와 MCP', '3부: Cowork 승인 모드'],
    objectives: [
      '하네스의 4구성(도구 연결·권한과 제어·규칙 설정·모니터링)을 설명할 수 있다',
      'MCP·Connector·Plugin의 관계를 이해하고 호텔 시스템 연결을 설계할 수 있다',
      '실행 승인(Manual vs Skip all approvals)과 민감정보 필터링으로 안전장치를 설계할 수 있다',
    ],
    theory: [
      { t: 'p', text: 'Harness(마구)는 말을 통제하는 장비입니다. AI 모델이라는 "강한 말"이 안전하고 유용하게 일하도록 도구·권한·규칙·감시를 연결해 주는 시스템이 Harness Engineering입니다. 다양한 기능의 에이전트를 조직처럼 운영하는 방향으로 확산되고 있습니다.' },
      { t: 'visual', kind: 'harness', title: '하네스 허브 — 4개 구성요소를 눌러 호텔 적용을 확인하세요' },
      {
        t: 'table',
        caption: 'MCP · Connector · Plugin',
        head: ['구분', '정의', '예시'],
        rows: [
          ['MCP(프로토콜)', 'AI와 외부 시스템이 대화하는 공용 규격 (노트북의 USB-C 포트처럼)', 'Model Context Protocol (Anthropic 개발)'],
          ['Connector', 'MCP로 만든 하나의 데이터 연결', 'Google Drive, Slack, Gmail'],
          ['Plugin', 'Connector + Skill + 커맨드를 묶은 배포 단위', '역할·팀 표준 워크플로우'],
        ],
      },
      {
        t: 'list',
        items: [
          'MCP 3대 구성요소: Host(Claude.ai 등 AI 앱) · Client(연결 담당 커넥터) · Server(Notion·Slack 등 외부 도구)',
          '연결 방식: 로컬(내 컴퓨터에서 실행) / 원격(HTTP·OAuth 인증)',
          '실행 승인 단계: Manual(매 액션 승인) vs Skip all approvals(자동 실행) — 위험도에 따라 선택',
          'Trusted folders: 작업 폴더를 지정해 승인 절차를 간소화하되 권한 범위는 제한',
        ],
      },
      {
        t: 'callout',
        tone: 'red',
        title: '보안 대응 (2부 보안 문제)',
        text: '인사 데이터는 사내 프라이빗 LLM 또는 암호화된 엔터프라이즈 환경에서만 취급하고, 보안 승인 외 외부 AI·확장 프로그램 사용은 차단하며, 공식 업무용 AI 툴을 의무화합니다. 기본원칙: 보안·정확성·저작권·인간의 최종검토.',
      },
    ],
    infographicId: 'ai-engineering',
    infographicNote: '03 HARNESS ENGINEERING 영역의 4구성(도구 연결·권한과 제어·규칙 설정·모니터링)을 확인하세요.',
    hotelCases: [
      { dept: '객실·하우스키핑', title: '시설 점검 보고서 하네스', text: '시설 점검 시트(파일)만 읽기 권한, 보고서 폴더에는 쓰기 권한, 외부 인터넷은 차단하고, 모든 실행 로그를 모니터링합니다.' },
      { dept: '경영혁신', title: 'PMS·메일·캘린더 커넥터 연결', text: '컨시어지 에이전트가 PMS 조회·Gmail 초안·캘린더 등록만 가능하게 하고 "환불"은 승인 단계를 강제합니다.' },
      { dept: '프론트·예약', title: '민감정보 필터링', text: '카드번호·여권번호 패턴은 입력 전에 자동 마스킹해 외부 모델로 나가지 않게 합니다.' },
    ],
    prompts: [
      {
        title: '에이전트 권한·규칙 정의서 만들기',
        text: '당신은 AI 거버넌스 설계자입니다.\n호텔 컨시어지 AI 에이전트에 대해 아래 4가지를 표로 작성하세요.\n1) 도구 연결: 사용 가능한 시스템(PMS 조회, 이메일 초안, 캘린더)과 읽기/쓰기 구분\n2) 권한과 제어: 자동 실행 가능 / 사람 승인 필요 / 절대 금지 작업\n3) 규칙: 안전·윤리·형식 규칙 5개\n4) 모니터링: 기록해야 할 로그 항목과 알림 조건\n조건: 금전 지급·계약·개인정보 외부 전송은 "사람 승인 필요" 또는 "금지"로 분류.',
      },
    ],
    practice: {
      simId: 'ops-report',
      mission: '시설·운영 데이터를 읽어 보고서를 자동 생성하는 하네스(읽기 전용 권한)를 가정하고 결과를 승인하세요.',
      steps: ['입력 데이터(읽기 전용)를 확인한다', '보고서를 자동 생성한다', '이상 수치와 조치 항목을 확인한다', '담당자가 승인해 배포한다'],
    },
    quiz: [
      { q: 'Harness Engineering의 4구성이 아닌 것은?', options: ['도구 연결', '권한과 제어', '규칙 설정', '모델 학습 데이터 수집'], answer: 3, explain: '도구 연결·권한과 제어·규칙 설정·모니터링이 4구성입니다.' },
      { q: 'Connector, MCP, Plugin의 관계로 맞는 것은?', options: ['MCP=규격, Connector=단일 연결, Plugin=Connector+Skill 패키지', 'MCP=요금제', 'Plugin=프로토콜', 'Connector=모델'], answer: 0, explain: 'MCP는 공용 규격, Connector는 MCP로 만든 연결, Plugin은 이를 묶은 배포 단위입니다.' },
      { q: '환불처럼 되돌리기 어려운 실행에 적합한 승인 모드는?', options: ['Skip all approvals', 'Manual(매 액션 승인)', '승인 불필요', '로그 비활성화'], answer: 1, explain: '고위험 실행은 사람이 매번 승인하는 Manual 모드와 Human-in-the-Loop가 적합합니다.' },
    ],
  },
]
