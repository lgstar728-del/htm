import type { Lesson } from '../../types'

// 출처: AI ENGINEERING: 5 LAYERS 인포그래픽, 2부 Ⅲ(프롬프트→컨텍스트), 1부 Ⅲ(루프·하네스), Gen AI Orientation
export const engineeringLessons: Lesson[] = [
  {
    id: 'L05',
    no: 5,
    title: 'Prompt Engineering',
    subtitle: 'Layer 01 · AI에게 원하는 작업을 정확히 지시하는 방법',
    icon: '💬',
    courseId: 'engineering',
    sources: ['AI ENGINEERING: 5 LAYERS (Layer 01)', 'Gen AI Orientation: 좋은 프롬프트의 6원칙', '2부: 구글 TCREI 프롬프팅 가이드'],
    objectives: [
      '좋은 프롬프트의 4요소(역할·목표·형식·제약조건)와 6원칙을 적용할 수 있다',
      '구글 TCREI(Task·Context·References·Evaluate·Iterate) 5단계로 프롬프트를 개선할 수 있다',
      '"마케팅 문구 좀 써줘" 같은 모호한 지시를 호텔 업무용 프롬프트로 재작성할 수 있다',
    ],
    theory: [
      { t: 'p', text: 'Prompt Engineering은 AI에게 원하는 작업을 정확히 지시하는 방법입니다. 주요 기능은 명확한 지시 전달, 출력 품질 향상, 일관된 결과 생성, 반복 사용 가능성입니다.' },
      {
        t: 'table',
        caption: '좋은 프롬프트의 구성 요소 (인포그래픽 Layer 01)',
        head: ['요소', '설명', '예시'],
        rows: [
          ['역할(Role)', 'AI의 역할과 관점 지정', '전문가, 분석가, 호텔 RM 매니저'],
          ['목표(Task)', '무엇을 해야 하는지 명확히 지시', '예약 문의에 대한 답변 초안 작성'],
          ['형식(Format)', '어떤 형식으로 결과를 받을지 지정', '표, 3줄 요약, 100자 이내'],
          ['제약조건(Constraints)', '고려할 조건과 주의사항', '확인되지 않은 요금은 추측 금지'],
        ],
      },
      {
        t: 'list',
        items: [
          '① 명확·직접적 지시 — 톤·대상·길이 등을 구체적 문장으로 명시',
          '② 역할 부여 — 지시문 앞에 역할을 지정하면 어휘·관점·전문성이 자동 반영',
          '③ 예시 제공 — 원하는 출력 형태의 샘플을 1개 이상 제시',
          '④ 단계별 사고 유도 — "먼저 A 분석, 다음 B 판단"처럼 순서를 지정',
          '⑤ XML 태그로 구조화 — 지시문·참고자료·예시를 태그로 구분',
          '⑥ 출력 형식 명시 — 길이·포맷·톤을 미리 지정',
        ],
      },
      {
        t: 'table',
        caption: '구글 TCREI 프롬프팅 가이드',
        head: ['단계', '설명', '예시'],
        rows: [
          ['Task(작업)', '명확하고 구체적인 작업 정의', '"AI 제품 블로그 포스팅 500자 작성"'],
          ['Context(배경)', '상황·청중·스타일 정보 제공', '"청중: CEO, 톤: 전문가적이고 긍정적"'],
          ['References(참고)', '예시·데이터·출처·템플릿 제공', '"첨부된 PDF 보고서 스타일 참고"'],
          ['Evaluate(평가)', '초기 결과물을 비판적으로 검토', '"글자 수 맞나? 톤 적절한가? 사실인가?"'],
          ['Iterate(반복)', '평가를 바탕으로 프롬프트 수정·반복', '"더 간결하게, 구체적 예시 추가"'],
        ],
      },
      {
        t: 'callout',
        tone: 'gold',
        title: 'Before → After',
        text: '"이번주 프로모션 문구 써줘" → "20~30대 가족단위 고객 대상, 친근한 톤, 100자 이내로 이번주 주말 패키지 프로모션 문구 3개를 써줘". 톤·대상·채널·길이가 없는 지시는 매번 다른 결과를 낳습니다.',
      },
      { t: 'visual', kind: 'layers', title: 'AI ENGINEERING 5 LAYERS — 층을 눌러 보세요 (Layer 01이 지금 배우는 층)' },
    ],
    infographicId: 'ai-engineering',
    infographicNote: '원본 인포그래픽의 01 PROMPT ENGINEERING 영역(맨 아래층)과 예시 프롬프트를 확대해 확인하세요.',
    hotelCases: [
      { hotelId: 'aurora', title: '예약 문의 자동 응답 프롬프트', text: '역할(예약 담당자)·톤(정중)·형식(3문단, 마지막에 예약 링크 안내)·제약(요금표에 없는 금액은 추측 금지)을 포함해 일관된 답변 품질을 만듭니다.' },
      { hotelId: 'lumen', title: '주말 패키지 프로모션 문구', text: '20~30대 가족 고객, 친근한 톤, 100자 이내, 3개 안 — 모호한 요청을 구조화한 대표 사례입니다.' },
      { hotelId: 'nexus', title: '대학평가 보고서 예시(인포그래픽)', text: '"당신은 대학평가 전문가입니다. 첨부 자료를 바탕으로 … 표와 근거자료를 포함해 3페이지 이내로 정리해 주세요" 형식을 호텔 운영 보고서로 바꿔 씁니다.' },
    ],
    prompts: [
      {
        title: '예약 문의 응답 프롬프트 (4요소 + XML 구조)',
        text: '<역할>당신은 AURORA GRAND HOTEL 예약팀 상담원입니다.</역할>\n<목표>아래 고객 문의에 대한 답변 초안을 작성합니다.</목표>\n<자료>\n- 디럭스 더블: 평일 285,000원 / 주말 340,000원 (조식 2인 포함 시 +45,000원)\n- 주차: 투숙객 1일 1대 무료\n- 취소: 체크인 3일 전까지 무료\n</자료>\n<고객문의>[고객 문의 입력]</고객문의>\n<형식>3문단 이내, 마지막 줄에 "예약 확정은 담당자 확인 후 안내됩니다" 포함</형식>\n<제약>자료에 없는 정보는 추측하지 말고 "확인 후 안내"로 답할 것. 존댓말, 과장 표현 금지.</제약>',
        tip: '아래 "실습" 단계의 프롬프트 랩에서 이 프롬프트를 수정하며 점수가 어떻게 바뀌는지 확인해 보세요.',
      },
    ],
    practice: {
      simId: 'reservation-reply',
      mission: '프롬프트 랩에서 모호한 프롬프트를 4요소를 갖춘 프롬프트로 개선하고, 예약 응답 시뮬레이션에 적용하세요.',
      steps: ['프롬프트 랩에서 점수를 확인한다', '부족한 요소(역할·형식·제약)를 보강한다', '예약 응답 시뮬레이션을 실행한다', '결과를 TCREI의 Evaluate 관점으로 평가한다'],
    },
    quiz: [
      { q: '좋은 프롬프트의 4요소가 아닌 것은?', options: ['역할(Role)', '목표(Task)', '형식(Format)', '모델 크기(Size)'], answer: 3, explain: '역할·목표·형식·제약조건이 4요소입니다.' },
      { q: 'TCREI의 "E, I"는 각각 무엇인가?', options: ['Edit, Insert', 'Evaluate, Iterate', 'Explain, Improve', 'Execute, Install'], answer: 1, explain: '초기 결과를 비판적으로 평가(Evaluate)하고 프롬프트를 수정·반복(Iterate)합니다.' },
      { q: '지시문·참고자료·예시를 구분해 AI가 혼동하지 않게 하는 방법은?', options: ['한 문단에 모두 쓰기', 'XML 태그로 구조화', '이모지 사용', '질문을 짧게'], answer: 1, explain: '6원칙 ⑤: XML 태그로 지시문·참고자료·예시를 구분합니다.' },
    ],
  },
  {
    id: 'L06',
    no: 6,
    title: 'Context Engineering',
    subtitle: 'Layer 02 · AI가 현재 상황을 정확히 이해하도록 정보를 제공',
    icon: '🧩',
    courseId: 'engineering',
    sources: ['AI ENGINEERING: 5 LAYERS (Layer 02)', '2부: 프롬프트에서 컨텍스트(맥락) 관리로', '3부: Claude Project · CLAUDE.md'],
    objectives: [
      'Prompt Engineering(질문을 잘하기)과 Context Engineering(상황을 설명하고 코칭하기)의 차이를 설명할 수 있다',
      '컨텍스트 윈도우의 4요소(사용자 입력·이전 대화·검색 지식·도구 결과)를 구성할 수 있다',
      'Claude Project 지식베이스·Instructions로 호텔 업무 맥락을 상시 제공하는 방법을 안다',
    ],
    theory: [
      { t: 'p', text: 'AI는 열정적인 신입사원입니다. 상황을 알려줄수록 결과가 좋아집니다. Prompt Engineering이 "세일즈 이메일을 기승전결로 써줘"라면, Context Engineering은 "고객 통화내용과 경쟁사 상황을 참고해 세일즈 이메일을 써줘"입니다.' },
      {
        t: 'callout',
        tone: 'cyan',
        title: '콘텍스트 윈도우 = 4요소의 합',
        text: 'User Input(사용자 질문) + Prior Conversation(이전 대화) + Retrieved Knowledge(검색된 지식) + Tool Outputs(도구 결과). 모델은 이 창 안의 정보만 "본다"고 생각하세요.',
      },
      { t: 'visual', kind: 'context', title: '컨텍스트 믹서 — 요소를 켜고 끄며 AI가 보는 정보가 어떻게 달라지는지 확인' },
      {
        t: 'table',
        caption: 'Layer 02 주요 기능',
        head: ['기능', '호텔 활용 예시'],
        rows: [
          ['필요한 정보 선택·구성', '문서 요약 시 참고 자료 제공'],
          ['데이터 검색 및 주입', '연구 주제에 맞는 자료 검색 → 응대 매뉴얼 주입'],
          ['누락 정보 보완', '긴 문서를 핵심만 추출'],
          ['토큰 예산 관리', '프로젝트 배경과 목적 공유(너무 길지 않게)'],
        ],
      },
      {
        t: 'list',
        items: [
          'Claude Project: 지식베이스(RAG)·프로젝트 지침(Custom Instructions)·콘텍스트 유지 — 프로젝트 내 모든 채팅이 설정 자료를 자동 인지',
          'Instruction이 지나치게 길면 컨텍스트 용량을 과도하게 점유하므로 간결함을 유지',
          'CLAUDE.md는 항상 로드되는 프로젝트의 "기억" — 매 대화 턴마다 토큰을 소모하므로 핵심 규칙만',
          '경영 시사점: 신입사원 온보딩과 유사 — "무엇을 시킬지"보다 "어떤 맥락에서 판단할지"를 코칭',
        ],
      },
    ],
    infographicId: 'ai-engineering',
    infographicNote: '02 CONTEXT ENGINEERING 영역의 "컨텍스트 입력 예시 → 모델이 보는 정보" 도식을 확대해 보세요.',
    hotelCases: [
      { hotelId: 'bluewave', title: '하우스키핑 배정 컨텍스트', text: '객실 상태·VIP 도착 시간·가용 인력·청소 기준을 함께 주면 우선순위가 맞는 배정표가 나옵니다. 하나라도 빠지면 배정 오류가 생깁니다. (실습 참고)' },
      { hotelId: 'aurora', title: '호텔 응대 매뉴얼 Project', text: '요금표·정책·톤앤매너를 Project 지식베이스와 Instruction으로 등록해 모든 직원의 응대 품질을 일정하게 유지합니다.' },
      { hotelId: 'nexus', title: '고객 통화 내용 + 경쟁사 가격 → 세일즈 메일', text: '기업 고객 통화 메모와 경쟁 호텔 요금 비교표를 함께 제공해 맞춤 제안 메일을 작성합니다.' },
    ],
    prompts: [
      {
        title: '컨텍스트를 갖춘 하우스키핑 배정 프롬프트',
        text: '당신은 하우스키핑 supervisor 보조 AI입니다.\n<객실상태>[체크아웃/연박/VIP 도착 객실 목록]</객실상태>\n<인력>[오늘 근무자 수와 숙련도]</인력>\n<기준>VIP 객실 14시 이전 완료, 1인당 최대 14객실, 연박 객실은 요청 시에만 청소</기준>\n<목표>위 정보로 객실 청소 배정표를 만들고 우선순위 이유를 한 줄씩 적어줘.</목표>\n<제약>정보가 부족하면 가정하지 말고 "추가 정보 필요: ~"로 먼저 물어볼 것.</제약>',
        tip: '"정보가 부족하면 먼저 물어보라"는 한 줄이 누락 정보 보완(Layer 02 기능)을 만들어 줍니다.',
      },
    ],
    practice: {
      simId: 'housekeeping',
      mission: '컨텍스트 요소를 하나씩 빼면서 배정 결과의 품질과 오류가 어떻게 변하는지 확인하세요.',
      steps: ['4가지 컨텍스트를 모두 켠다', '하나씩 끄며 결과를 비교한다', '누락으로 인한 오류 경고를 확인한다', '최적 컨텍스트 조합을 정리한다'],
    },
    quiz: [
      { q: '컨텍스트 윈도우를 구성하는 4요소가 아닌 것은?', options: ['User Input', 'Prior Conversation', 'Retrieved Knowledge', '사용자의 기분'], answer: 3, explain: '사용자 입력·이전 대화·검색된 지식·도구 결과가 4요소입니다.' },
      { q: 'Context Engineering의 핵심 관점은?', options: ['질문을 짧게 하기', '무엇을 시킬지보다 어떤 맥락에서 판단할지 코칭하기', '모델을 바꾸기', '답변 형식만 지정하기'], answer: 1, explain: '신입사원 온보딩처럼 판단의 맥락을 제공하는 것이 핵심입니다.' },
      { q: 'Claude Project의 지식베이스가 하는 일은?', options: ['모델을 재학습', '사전 업로드 자료로 배경 이해를 강화(RAG)', '요금제 변경', '인터넷 차단'], answer: 1, explain: 'PDF·텍스트 등을 사전 업로드해 프로젝트 내 모든 채팅이 배경을 알도록 합니다.' },
    ],
  },
  {
    id: 'L07',
    no: 7,
    title: 'Harness Engineering',
    subtitle: 'Layer 03 · AI가 사용할 도구와 규칙을 연결하고 통제하는 시스템',
    icon: '⚙️',
    courseId: 'engineering',
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
      { hotelId: 'bluewave', title: '시설 점검 보고서 하네스', text: '시설 점검 시트(파일)만 읽기 권한, 보고서 폴더에는 쓰기 권한, 외부 인터넷은 차단하고, 모든 실행 로그를 모니터링합니다.' },
      { hotelId: 'horizon', title: 'PMS·메일·캘린더 커넥터 연결', text: '컨시어지 에이전트가 PMS 조회·Gmail 초안·캘린더 등록만 가능하게 하고 "환불"은 승인 단계를 강제합니다.' },
      { hotelId: 'aurora', title: '민감정보 필터링', text: '카드번호·여권번호 패턴은 입력 전에 자동 마스킹해 외부 모델로 나가지 않게 합니다.' },
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
  {
    id: 'L08',
    no: 8,
    title: 'Loop Engineering',
    subtitle: 'Layer 04 · AI가 스스로 점검하고 반복하며 개선하는 과정 설계',
    icon: '🔁',
    courseId: 'engineering',
    sources: ['AI ENGINEERING: 5 LAYERS (Layer 04)', '1부: 루프 엔지니어링(PyTorchKR 자료 재구성)'],
    objectives: [
      '실행→결과 확인→기준 충족?→(완료 | 문제 수정→다시 시도) 루프를 설계할 수 있다',
      '루프 엔지니어링 6요소(오토메이션·워크트리·스킬·플러그인·서브에이전트·메모리)를 설명할 수 있다',
      '종료 조건과 최대 반복 횟수를 정해 무한 루프·비용 폭주를 막을 수 있다',
    ],
    theory: [
      { t: 'p', text: 'Loop Engineering은 AI가 스스로 점검하고 반복하며 개선하는 과정을 설계하는 것입니다. 한 번에 완벽한 결과를 기대하는 대신, "검사 기준"을 정해 AI가 기준을 만족할 때까지 수정·재시도하도록 합니다.' },
      { t: 'visual', kind: 'loop', title: '루프 애니메이션 — 연회 제안서가 기준을 충족할 때까지 반복합니다' },
      {
        t: 'table',
        caption: '루프 엔지니어링 6요소',
        head: ['요소', '역할'],
        rows: [
          ['오토메이션', '정해진 시간·이벤트에 루프를 자동 시작'],
          ['워크트리', '작업을 격리된 공간에서 안전하게 수행'],
          ['스킬', '반복 업무의 절차를 재사용 가능한 매뉴얼로 보관'],
          ['플러그인', '도구·커넥터 묶음으로 능력 확장'],
          ['서브에이전트', '검수·수정 역할을 분리해 교차 검증'],
          ['메모리', '이전 반복에서 배운 점을 다음 반복에 전달'],
        ],
      },
      {
        t: 'list',
        items: [
          '주요 기능: 결과 자동 점검 / 오류 수정 및 재시도 / 반복 계획 수립 / 종료 조건 설정',
          '활용 예시: 코드 실행 및 수정, 보고서 재생성, 품질 자동 검증, 지속적 성능 개선',
          '종료 조건 필수: "체크리스트 전부 통과" 또는 "최대 N회" 중 먼저 오는 것',
          '자율 반복 구간에서도 최종 산출물은 사람이 검토·승인(Human-in-the-Loop)',
        ],
      },
    ],
    infographicId: 'ai-engineering',
    infographicNote: '04 LOOP ENGINEERING 영역의 순환 플로우차트(실행→결과 확인→기준 충족?→…)를 확인하세요.',
    hotelCases: [
      { hotelId: 'lumen', title: 'MICE 제안서 자기 점검 루프', text: '예산 초과·필수 섹션 누락·인당 단가 범위를 체크리스트로 점검해 기준 미달이면 AI가 수정 후 재검사합니다. (실습)' },
      { hotelId: 'nexus', title: '주간 매출 보고서 재생성', text: '수치 불일치(합계 오류)가 발견되면 AI가 원인을 수정하고 보고서를 다시 생성합니다.' },
      { hotelId: 'horizon', title: '야간 자동 점검 오토메이션', text: '매일 새벽 객실 재고와 요금 불일치를 점검하고 이상 시 담당자에게 알립니다.' },
    ],
    prompts: [
      {
        title: '자기 점검 루프 프롬프트',
        text: '당신은 연회 제안서 작성 에이전트입니다.\n1단계: 제안서를 작성한다.\n2단계: 아래 <검사기준>으로 스스로 점검하고 각 항목 PASS/FAIL을 표로 보고한다.\n3단계: FAIL 항목이 있으면 원인을 한 줄로 쓰고 수정본을 만든 뒤 다시 2단계를 수행한다.\n종료 조건: 모든 항목 PASS 또는 최대 3회 반복. 3회 후에도 FAIL이면 "사람 검토 필요"로 보고하고 중단한다.\n<검사기준>\n□ 총 견적이 예산 이내\n□ 인당 단가가 8~25만원 범위\n□ 일정표·메뉴·장비·견적 4개 섹션 모두 포함\n□ 확인되지 않은 정보는 "확인 필요"로 표시\n</검사기준>',
        tip: '종료 조건과 최대 반복 횟수가 없으면 루프가 끝나지 않거나 비용이 폭증할 수 있습니다.',
      },
    ],
    practice: {
      simId: 'banquet',
      mission: '연회 제안서 시뮬레이션의 "루프 점검 로그"를 확인하고, 기준을 바꿔 반복 횟수가 어떻게 달라지는지 비교하세요.',
      steps: ['행사 조건과 예산을 입력한다', '제안서를 생성한다', '루프 점검 로그에서 FAIL→수정→PASS를 확인한다', '최종본을 사람이 승인한다'],
    },
    quiz: [
      { q: '루프 엔지니어링에서 반드시 정해야 하는 것은?', options: ['종료 조건', '이모지', '배경색', '모델 이름'], answer: 0, explain: '종료 조건(체크리스트 통과 또는 최대 반복 횟수)이 없으면 무한 반복·비용 폭주 위험이 있습니다.' },
      { q: '"기준 충족?"에서 아니오가 나오면 다음 단계는?', options: ['완료', '문제 수정 → 다시 시도', '삭제', '사람에게 전부 위임'], answer: 1, explain: '인포그래픽의 순환: 실행→결과 확인→기준 충족?→(예) 완료 / (아니오) 문제 수정→다시 시도.' },
      { q: '루프 엔지니어링 6요소에 포함되지 않는 것은?', options: ['메모리', '서브에이전트', '플러그인', '광고 입찰'], answer: 3, explain: '오토메이션·워크트리·스킬·플러그인·서브에이전트·메모리가 6요소입니다.' },
    ],
  },
  {
    id: 'L09',
    no: 9,
    title: 'Graph Engineering',
    subtitle: 'Layer 05 · AI가 정보를 연결하고 흐르게 하는 구조 설계',
    icon: '🕸️',
    courseId: 'engineering',
    sources: ['AI ENGINEERING: 5 LAYERS (Layer 05)'],
    objectives: [
      '노드(사람·장소·사건·개념)와 관계로 호텔 데이터를 지식그래프로 표현할 수 있다',
      '그래프로 정보 연결·탐색·추론·추천을 지원하는 방식을 설명할 수 있다',
      '고객·예약·객실·리뷰·이벤트의 관계에서 맞춤형 추천 시나리오를 도출할 수 있다',
    ],
    theory: [
      { t: 'p', text: 'Graph Engineering은 AI가 정보를 연결하고 흐르게 하는 구조를 설계하는 일입니다. 문서·표만으로는 보이지 않는 "관계"를 노드와 엣지로 표현하면 AI가 맥락을 따라 탐색·추론할 수 있습니다.' },
      { t: 'visual', kind: 'graph', title: '호텔 지식그래프 — 노드를 눌러 연결 관계와 추론 예시를 확인하세요' },
      {
        t: 'list',
        items: [
          '주요 기능: 노드와 관계 정의 / 정보 연결 및 탐색 / 추론과 추천 지원 / 사람·상태·환경 간 상호작용 모델링',
          '활용 예시: 연구문헌 연결, 조직·데이터 관계 분석, 맞춤형 추천, 멀티에이전트 협업',
          '모션그래프: 업무 프로세스를 애니메이션으로 시각화하면 병목과 승인 지점이 한눈에 보입니다.',
          '디지털 트윈: 호텔의 객실·인력·고객 흐름을 가상 공간에 연결해 운영 상태를 시각화합니다.',
        ],
      },
      {
        t: 'callout',
        tone: 'gold',
        title: '5 Layers는 하나씩 바꾸는 것이 아니라 함께 작동',
        text: '① 좋은 프롬프트만으로는 충분하지 않습니다. ② 컨텍스트·도구·반복·그래프가 함께 필요합니다. ③ 각 층을 이해하고 설계하면 더 강력하고 안정적인 AI 시스템을 만들 수 있습니다.',
      },
    ],
    infographicId: 'ai-engineering',
    infographicNote: '05 GRAPH ENGINEERING 영역(맨 위층)의 지식 그래프 예시와 하단 요약 문구를 확인하세요.',
    hotelCases: [
      { hotelId: 'nexus', title: '고객-예약-리뷰 그래프', text: '"가족 고객→주말 예약→조식 불만 리뷰"의 관계를 연결해 다음 방문 시 조식 안내를 사전 추천합니다.' },
      { hotelId: 'lumen', title: '행사 관계망', text: '주최사·참석자·연사·장소·식음 옵션을 그래프로 묶어 누락된 연결(예: 알레르기 정보↔메뉴)을 찾습니다.' },
      { hotelId: 'horizon', title: '멀티에이전트 협업 지도', text: '예약·객실·청소·F&B 에이전트 간 정보 흐름을 그래프로 설계해 중복 요청과 병목을 줄입니다.' },
    ],
    prompts: [
      {
        title: '호텔 지식그래프 설계 프롬프트',
        text: '당신은 데이터 모델러입니다.\n호텔 고객 경험 개선을 위한 지식그래프를 설계하세요.\n1) 노드 유형 6개(예: 고객, 예약, 객실, 이벤트, 리뷰, 서비스)와 속성\n2) 관계 유형 8개(예: 고객-예약, 예약-객실, 리뷰-서비스)\n3) 이 그래프로 답할 수 있는 질문 5개와 맞춤 추천 시나리오 3개\n4) 개인정보가 포함되는 노드/속성과 비식별화 방법\n형식: 표 + Mermaid 다이어그램',
      },
    ],
    practice: {
      simId: 'demand',
      mission: '지식그래프의 "이벤트" 노드가 수요예측에 미치는 영향을 이벤트 가중치로 확인하세요.',
      steps: ['최근 점유율 데이터를 확인한다', '이벤트(콘서트·컨벤션)를 추가한다', '7일 예측 변화를 비교한다', '예측 근거(관계)를 설명해 본다'],
    },
    quiz: [
      { q: 'Graph Engineering이 다루는 핵심 구조는?', options: ['색상과 폰트', '노드와 관계', '파일 용량', '서버 위치'], answer: 1, explain: '노드(사람·장소·사건·개념)와 그 관계를 정의해 정보를 연결합니다.' },
      { q: '지식그래프의 활용 예시로 인포그래픽에 나온 것이 아닌 것은?', options: ['연구문헌 연결', '조직·데이터 관계 분석', '맞춤형 추천', '배경음악 생성'], answer: 3, explain: '연구문헌 연결·조직·데이터 관계 분석·맞춤형 추천·멀티에이전트 협업이 예시입니다.' },
      { q: 'AI Engineering 5 Layers의 올바른 순서(아래→위)는?', options: ['Prompt→Context→Harness→Loop→Graph', 'Graph→Loop→Harness→Context→Prompt', 'Loop→Prompt→Graph→Context→Harness', 'Context→Prompt→Loop→Graph→Harness'], answer: 0, explain: '01 Prompt, 02 Context, 03 Harness, 04 Loop, 05 Graph 순으로 쌓입니다.' },
    ],
  },
]
