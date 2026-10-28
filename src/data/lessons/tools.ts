import type { Lesson } from '../../types'

// 출처: 3부 Claude 채팅에서 Cowork까지, HUMANIZER 인포그래픽, VIBE CODING 인포그래픽
export const toolLessons: Lesson[] = [
  {
    id: 'L10',
    no: 10,
    title: 'Claude Chat · Cowork · Code',
    subtitle: '같은 모델, 다른 작동 방식 — 호텔 관리자에게 맞는 도구 고르기',
    icon: '🧠',
    courseId: 'claude',
    sources: ['3부: Claude 채팅에서 Claude Cowork까지', '1주차·Orientation: Claude AI·Cowork·Code'],
    objectives: [
      'Claude AI(Chat)·Cowork·Code의 정의·작동 방식·최적 사용자를 구분할 수 있다',
      '업무 난이도·비용에 맞는 모델(Fable·Opus·Sonnet·Haiku) 선택 전략을 세울 수 있다',
      'CLAUDE.md(항상 로드)와 SKILL.md(조건부 로드)의 차이로 문서를 올바르게 배치할 수 있다',
    ],
    theory: [
      { t: 'visual', kind: 'claude3', title: 'Claude 3종 비교 — 탭을 눌러 정의·사용자·호텔 활용을 비교하세요' },
      {
        t: 'list',
        items: [
          '대화·아이디어 반복, 피드백 기반 초안 → Claude 웹(Chat)',
          '자율 실행·소프트웨어 구축·복잡한 시스템 관리 → Claude Code',
          '파일 정리, 리서치 종합, 완성형 산출물 제작 → Claude Cowork',
          '호텔 적용: 프론트오피스·마케팅·재무 등 비개발 부서 관리자가 코딩 없이 파일 정리·보고서 작성·이메일 처리를 위임하는 도구가 Cowork',
        ],
      },
      { t: 'visual', kind: 'models', title: '모델 선택 가이드 (강의자료 2026.07.13 기준)' },
      {
        t: 'table',
        caption: 'Cowork의 3가지 결정적 차이',
        head: ['특징', '설명'],
        rows: [
          ['결과물 직접 생성', '텍스트 답변이 아니라 실제 작동하는 Excel·문서 파일을 폴더에 생성'],
          ['자율적 다단계 수행', '목표(Outcome)를 던지면 스스로 To-do를 쪼개고 여러 서브에이전트를 동시 실행'],
          ['백그라운드 실행', '지시 후 자리를 비워도 계속 수행해 완료'],
        ],
      },
      {
        t: 'table',
        caption: 'Cowork 6대 핵심 설정 요소',
        head: ['요소', '설명'],
        rows: [
          ['add-files', '읽고 수정할 로컬 파일·폴더를 작업 공간에 연결'],
          ['context', '비즈니스 환경·규칙을 about-me.md 등 마크다운으로 심어둠'],
          ['design', '텍스트·데이터를 PPTX·HTML·대시보드로 변환'],
          ['schedule', '/schedule 로 반복 업무 예약 자동화'],
          ['setup-cowork', '세션 시작 시 PC 환경과 연동해 작업 공간 구성'],
          ['skill-creator', '반복 업무 매뉴얼을 대화형으로 스킬 파일로 제작'],
        ],
      },
      {
        t: 'table',
        caption: 'CLAUDE.md vs SKILL.md',
        head: ['기능', 'CLAUDE.md (프로젝트 기억)', 'SKILL.md (동적 작업 매뉴얼)'],
        rows: [
          ['로드 방식', '정적 상시 로드 — 세션 시작 시 항상', '동적 조건부 로드 — 트리거될 때만'],
          ['주요 범위', '글로벌 규칙·빌드 명령어·기술 스택·컨벤션', '특정 작업·복잡한 워크플로우·단계별 절차'],
          ['토큰 효율', '낮음 — 매 대화 턴마다 소모', '높음 — 필요할 때만 소모'],
          ['이식성', '특정 디렉토리·레포지토리에 종속', '모듈화되어 여러 프로젝트에서 공유'],
        ],
      },
      {
        t: 'callout',
        tone: 'cyan',
        title: '의사결정 프레임워크',
        text: '"How we work"(우리가 일하는 방식) → CLAUDE.md / "How we do X"(X를 하는 방법) → SKILL.md. 비유: CLAUDE.md는 회사의 운영 방침, SKILL.md는 직원이 보유한 역량입니다.',
      },
      {
        t: 'callout',
        tone: 'gold',
        title: '비용·한도 관리',
        text: '기본 전략: Sonnet으로 시작 → 막히면 Opus로 승급 → 단순·대량 작업은 Haiku로 비용 절감. 구독형(Free/Pro/Max)은 정액·한도제, API/Console은 사용량 과금(변동비)입니다. 모델·가격·한도는 수시로 바뀌므로 공식 문서로 최신값을 확인하세요.',
      },
    ],
    hotelCases: [
      { hotelId: 'lumen', title: 'F&B 월간 매출 폴더 → Cowork 보고서', text: '월별 POS 엑셀이 있는 폴더를 연결하고 "메뉴별 매출 추이 대시보드와 요약 보고서"를 위임합니다.' },
      { hotelId: 'nexus', title: 'Skill로 만드는 주간 RM 리포트', text: '반복되는 주간 리포트 절차를 /skill-creator 로 스킬화해 누구나 같은 품질로 호출합니다.' },
      { hotelId: 'aurora', title: 'Project로 응대 톤앤매너 고정', text: '브랜드 가이드·요금 정책을 지식베이스로 등록해 모든 채팅이 같은 기준으로 답하게 합니다.' },
      { hotelId: 'horizon', title: 'MCP 커넥터로 Drive·Slack·Notion 연결', text: '다운로드 없이 외부 도구 데이터를 직접 활용하되 권한은 최소화합니다.' },
    ],
    prompts: [
      {
        title: 'Cowork Global Instructions 예시 (호텔 매니저용)',
        text: '나는 호텔 [부서] 매니저이며 코딩을 하지 않는다.\n- 모든 산출물은 한국어, 존댓말, 표 중심으로 작성한다.\n- 고객 개인정보(이름·연락처·카드·여권)는 절대 외부 도구로 전송하지 않는다.\n- 숫자는 출처 파일과 셀 위치를 함께 적는다. 확인되지 않은 숫자는 "확인 필요"로 표시한다.\n- 삭제·발송·결제 등 되돌리기 어려운 작업은 실행 전에 반드시 나에게 확인한다.\n- 작업이 끝나면 무엇을 했는지 3줄로 요약한다.',
        tip: 'Settings > Cowork 의 Global Instructions 에 한 번 등록하면 모든 세션에 적용됩니다.',
      },
      {
        title: '병렬 서브에이전트 요청',
        text: '폴더별로 병렬 서브에이전트를 동시에 띄워 각 폴더의 데이터 특성을 분석해 주세요.\n분석 결과를 바탕으로 객실 점유율 대시보드(HTML)를 만들고, 마지막에 운영 매뉴얼 요약 PPT 초안을 작성하세요.\n실행 전에 필요한 권한과 스킬을 먼저 알려주고 내 승인을 받으세요.',
      },
    ],
    practice: {
      simId: 'marketing',
      mission: '다이닝 프로모션 작성 업무를 Chat/Cowork/Code 중 어떤 도구로 처리할지 고르고, 맞춤형 메시지 시뮬레이션을 실행하세요.',
      steps: ['업무를 세 도구 중 하나에 배치한다', '고객 세그먼트를 선택한다', '맞춤 메시지를 생성한다', 'AI 말투 점검 후 승인한다'],
    },
    quiz: [
      { q: '비개발자용 자율 업무 에이전트는?', options: ['Claude AI(Chat)', 'Claude Cowork', 'Claude Code', 'Claude API'], answer: 1, explain: 'Cowork는 비기술직 지식근로자를 위해 목표를 위임하면 스스로 계획·다단계 수행합니다.' },
      { q: '항상 로드되어 매 대화 턴 토큰을 소모하는 파일은?', options: ['SKILL.md', 'CLAUDE.md', 'README.md', '.gitignore'], answer: 1, explain: 'CLAUDE.md는 정적 상시 로드 방식이라 토큰 효율이 낮습니다.' },
      { q: '"우리가 일하는 방식(Global Rules)"을 적는 곳은?', options: ['SKILL.md', 'CLAUDE.md', '채팅 입력창만', '이미지 파일'], answer: 1, explain: 'How we work → CLAUDE.md(Memory), How we do X → SKILL.md(Skill).' },
    ],
  },
  {
    id: 'L11',
    no: 11,
    title: 'AI Humanizer — 전형적인 AI 말투 개선',
    subtitle: 'AI가 쓴 글에서 자주 나타나는 10가지 표현과 자연스러운 대체',
    icon: '✍️',
    courseId: 'claude',
    sources: ['HUMANIZER 인포그래픽 「전형적인 AI 말투」 Ver 1.1 (2026.9.16)'],
    objectives: [
      'AI 말투 10가지 패턴을 식별할 수 있다',
      '고객 안내문·프로모션·공지문에서 AI 느낌 표현을 자연스러운 문장으로 바꿀 수 있다',
      'Humanizer 규칙을 프롬프트·스킬에 넣어 일관된 문체를 유지할 수 있다',
    ],
    theory: [
      { t: 'p', text: 'AI가 작성한 글은 읽는 순간 "AI 같다"는 느낌을 줍니다. 호텔의 고객 안내문·프로모션·SNS가 같은 말투를 반복하면 브랜드 신뢰가 떨어집니다. 원본 인포그래픽의 10가지 패턴을 기준으로 점검하세요.' },
      {
        t: 'table',
        caption: 'AI 말투 10패턴 — 이렇게 바꾸세요',
        head: ['#', '패턴', 'AI 느낌 표현', '자연스러운 표현'],
        rows: [
          ['1', '무분별한 "~아니라"의 남발', '이 기능은 단순한 도구가 아니라, 생산성을 높이는 방법이 아니라, 새로운 가능성의 시작이…', '이 기능은 생산성을 높이는 새로운 가능성의 시작입니다.'],
          ['2', '무분별한 따옴표 / 긴 하이픈(—)', "'특별한' 기능으로, 사용자의 '경험'을 — 한층 더 — 혁신적으로", '특별한 기능으로, 사용자의 경험을 한층 더 혁신적으로 바꿔줍니다.'],
          ['3', '무분별한 "단순히"', '단순히 시간을 절약하는 것을 넘어, 단순히 업무를 자동화하는 것을 넘어서…', '시간을 절약하고 업무를 자동화하여 더 큰 가치를 제공합니다.'],
          ['4', '"또한", "결과적으로" 등 중언부언 연결어', '편리합니다. 또한, 사용하기 쉽습니다. 결과적으로, 더 나은 경험을 제공합니다.', '편리하고 사용하기 쉬워 더 나은 경험을 제공합니다.'],
          ['5', '무분별한 Bold체, 의문문의 남용', '**이제, 당신의 업무 방식은 달라질까요?** 이 도구는 정말 필요할까요?', '이제 당신의 업무 방식이 더 효율적으로 달라질 수 있습니다.'],
          ['6', '"~을 넘어서", "~로 이동한다", "~는 남는다"', '단순한 자동화를 넘어서, 더 나은 미래로 이동하며, 그 가치는 계속 남습니다.', '이 기술은 업무 효율을 높이고 지속적인 가치를 제공합니다.'],
          ['7', '"~임을 보여준다"', '이 결과는 사용자의 만족도가 높음을 보여준다.', '이 결과로 사용자의 만족도가 높다는 것을 알 수 있다.'],
          ['8', '"하지만~다"', '이 기능은 사용하기 쉽지만, 더 많은 개선이 필요합니다.', '이 기능은 사용하기 쉽고 추가 개선이 필요합니다.'],
          ['9', '필요 없는 "첫째, 둘째, 셋째"', '첫째, 사용이 간편합니다. 둘째, 효율적입니다. 셋째, 비용을 절감할 수 있습니다.', '사용이 간편하고 효율적이며 비용을 절감할 수 있습니다.'],
          ['10', '과장된 말·표현', '혁신적인 도구는 모든 문제를 완벽하게 해결하며, 놀라운 변화를 가져올 것입니다.', '이 도구는 업무 효율을 크게 높이고 실질적인 도움이 될 수 있습니다.'],
        ],
      },
      {
        t: 'callout',
        tone: 'gold',
        title: '공통 원칙',
        text: '불필요한 대조·강조·연결어·목록화를 줄이고, 핵심 메시지를 간결하고 구체적으로 전달하세요. 과장 표현 대신 사실에 기반한 신뢰할 수 있는 표현을 쓰세요.',
      },
    ],
    infographicId: 'humanizer',
    infographicNote: '확대·축소 후 10개 카드의 "AI 느낌 표현 / 자연스러운 표현" 예문을 직접 비교해 보세요. 실습의 점검기는 이 10패턴을 기준으로 동작합니다.',
    hotelCases: [
      { hotelId: 'nexus', title: '주말 패키지 프로모션 문구', text: '"단순한 숙박이 아니라, 특별한 경험을 넘어서…" → "주말에 가족과 함께 쉬어 가세요. 조식과 키즈 풀 이용이 포함됩니다."' },
      { hotelId: 'aurora', title: 'VIP 환영 안내문', text: '과장·대조·번호 목록을 걷어내고 한 사람에게 건네는 문장으로 정리합니다.' },
      { hotelId: 'lumen', title: '연회 제안서 도입부', text: '"첫째, 둘째, 셋째" 구조를 필요한 곳만 남기고 자연스러운 문단으로 바꿉니다.' },
    ],
    prompts: [
      {
        title: 'AI 말투 제거 프롬프트 (Humanizer)',
        text: '아래 글에서 AI 말투를 걷어내 주세요.\n다음 10가지 패턴을 점검합니다: ① 불필요한 "~아니라" 대조 ② 따옴표·긴 하이픈 남용 ③ "단순히" 반복 ④ "또한/결과적으로" 연결어 남발 ⑤ Bold·의문문 남용 ⑥ "~을 넘어서/~로 이동한다" ⑦ "~임을 보여준다" ⑧ "하지만~다" 대조 ⑨ 불필요한 "첫째, 둘째, 셋째" ⑩ 과장 표현.\n규칙: 의미는 바꾸지 말고, 사실에 없는 내용은 추가하지 말 것. 존댓말, 짧고 구체적인 문장.\n출력: 1) 발견된 패턴과 횟수 2) 수정본 3) 바꾼 이유 한 줄씩.\n<원문>[원문 입력]</원문>',
        tip: '수정 결과도 사람이 최종 확인하세요. 사실 관계(요금·시간)는 바뀌면 안 됩니다.',
      },
    ],
    practice: {
      simId: 'humanizer',
      mission: 'AI 말투가 심한 안내문을 점검기에 넣고 점수를 낮춰 보세요. 자동 수정본을 사람이 다듬어 승인합니다.',
      steps: ['샘플 문구를 불러온다', '10패턴 탐지 결과를 확인한다', '자동 수정본을 비교한다', '직접 다듬어 승인한다'],
    },
    quiz: [
      { q: '"단순히 ~를 넘어서" 같은 표현은 10패턴 중 어디에 해당하나?', options: ['③ 무분별한 단순히 / ⑥ ~을 넘어서', '⑤ Bold체', '⑩ 과장', '해당 없음'], answer: 0, explain: '"단순히"의 반복과 "~을 넘어서"는 대표적인 AI 말투입니다.' },
      { q: '"이 결과는 만족도가 높음을 보여준다"의 자연스러운 표현은?', options: ['그대로 사용', '만족도가 높다는 것을 알 수 있다', '만족도가 놀랍도록 높음을 증명한다', '만족도! 높음!'], answer: 1, explain: '"~임을 보여준다" 대신 "알 수 있다/확인할 수 있다/나타났다"를 씁니다.' },
      { q: 'Humanizer 적용 시 지켜야 할 원칙은?', options: ['사실을 더 화려하게 추가', '의미·사실을 바꾸지 않고 간결하게', '번호 목록을 최대한 늘리기', '의문문으로 시작'], answer: 1, explain: '불필요한 장식을 줄이되 사실 관계는 바꾸지 않아야 합니다.' },
    ],
  },
  {
    id: 'L12',
    no: 12,
    title: 'Vibe Coding과 GitHub·Vercel 배포',
    subtitle: '아이디어 → 코드 → 배포 → 서비스, SPEC.md가 가장 중요한 단계',
    icon: '🚀',
    courseId: 'vibe',
    sources: ['VIBE_CODING_SKILLS 인포그래픽(바이브코딩)', '1부: 비전공자의 Vibe Coding', '3부: 실습 2 Claude Code · 신규 데이터 자동 인식의 한계', '2부: AX 3축(Supabase/Vercel/GitHub)'],
    objectives: [
      '바이브코딩 4대 원칙(명확한 의도·작은 단위 반복·즉시 검증·위임하되 통제)을 적용할 수 있다',
      'SPEC.md(요구사항·화면/데이터 구조·기술 스택·범위/우선순위)를 작성할 수 있다',
      'GitHub 버전 관리 → Vercel 자동 배포(CI/CD) 흐름을 이해하고 비밀정보(.env)를 안전하게 다룬다',
    ],
    theory: [
      { t: 'visual', kind: 'vibeflow', title: '아이디어 → 코드 → 배포 → 서비스 파이프라인' },
      {
        t: 'table',
        caption: '바이브코딩 7단계 (인포그래픽)',
        head: ['단계', '핵심', '도구/내용'],
        rows: [
          ['① 개발 환경 구축', 'LLM + 개발 도구 준비', 'ChatGPT·Gemini·Claude, Claude Code·Cursor·VS Code'],
          ['② 기획/설계 → SPEC.md', '★ 가장 중요한 단계', '기능 요구사항, 화면·데이터 구조, 기술 스택, 개발 범위 및 우선순위'],
          ['③ 프론트엔드', '사용자가 직접 보는 화면', 'HTML/CSS/JS, React, Vite, Next.js, TypeScript, Tailwind CSS'],
          ['④ 백엔드', '서버·데이터·보안 등 보이지 않는 핵심', 'Node.js, Express, Spring Boot, FastAPI, DB, 인증/권한, OWASP Top 10'],
          ['⑤ GitHub 버전 관리·협업', '코드를 안전하게 관리', '커밋·브랜치·Pull Request, .gitignore로 비밀정보 제외'],
          ['⑥ 자동 배포', '푸시하면 자동 빌드·공개', 'Vercel: GitHub 푸시 → 자동 빌드(CI/CD) → 배포 → URL 생성'],
          ['⑦ 사용자 접근', '다양한 기기에서 서비스 이용', 'PC·태블릿·스마트폰, HTTPS, 클라우드(AWS/Azure/GCP)'],
        ],
      },
      {
        t: 'table',
        caption: '바이브 코딩 4대 원칙',
        head: ['원칙', '의미'],
        rows: [
          ['① 명확한 의도(Clear Intent)', '무엇을 만들고 싶은지 분명하게 설명하기'],
          ['② 작은 단위 반복(Small Unit Iteration)', '작게 나누어 반복적으로 개발하기'],
          ['③ 즉시 검증(Immediate Validation)', '바로 실행하고 결과를 확인하기'],
          ['④ 위임하되 통제(Delegate but Control)', 'AI에게 맡기되 핵심은 직접 판단하기'],
        ],
      },
      {
        t: 'list',
        items: [
          'Git 흐름: main(안정 버전) ↔ feature(기능 개발) ↔ Pull Request(리뷰) ↔ Merge(배포)',
          '모든 코드 버전 관리, 커밋을 자주·명확한 메시지, 브랜치 활용, PR로 코드 리뷰, .gitignore로 비밀정보 제외',
          'Vercel: GitHub 푸시 시 자동 배포, 커스텀 도메인, HTTPS 기본 제공, 미리보기 URL 자동 생성',
          'Claude Code 설치(Windows PowerShell): irm https://claude.ai/install.ps1 | iex → claude --help',
        ],
      },
      {
        t: 'callout',
        tone: 'red',
        title: 'API Key·개인정보는 GitHub에 올리지 않습니다',
        text: '.env 파일은 .gitignore 로 제외하고, 키는 Vercel 환경변수에 저장합니다. VITE_ 접두사 변수는 브라우저에 노출되므로 비밀키 용도로 쓰면 안 됩니다.',
      },
      {
        t: 'callout',
        tone: 'cyan',
        title: '신규 데이터 자동 인식의 한계',
        text: '로컬 실행·정적 페이지 구조에서는 파일을 추가해도 화면이 스스로 갱신되지 않습니다. 절차: ① 파일 추가 → ② 집계 스크립트 재실행 → ③ 대시보드 반영. 완전 자동화를 원하면 대시보드가 JSON을 fetch로 읽어오는 구조로 리팩터링하세요. (이 교육 플랫폼도 data/*.ts 만 고치면 강의 내용이 바뀌도록 같은 원리로 설계되었습니다.)',
      },
    ],
    infographicId: 'vibe-coding',
    infographicNote: '1~7 단계 박스와 가운데 "바이브 코딩 4대 원칙"을 확대해 보세요. 2번 SPEC.md 단계가 ★ 가장 중요한 단계로 표시되어 있습니다.',
    hotelCases: [
      { hotelId: 'horizon', title: '비개발자 총지배인의 KPI 대시보드', text: '"어제 객실 점유율·ADR·RevPAR을 보여주는 대시보드"를 SPEC.md로 정의하고 Claude Code로 프로토타입을 만들어 Vercel에 배포합니다.' },
      { hotelId: 'nexus', title: '프로모션 랜딩페이지', text: '주말 패키지 랜딩페이지를 Next.js로 만들고 GitHub 푸시마다 미리보기 URL로 팀 검토를 받습니다.' },
      { hotelId: 'lumen', title: '연회 견적 계산기', text: '인원·메뉴를 입력하면 견적을 계산하는 간단한 웹 앱을 작은 단위로 반복 개발합니다.' },
    ],
    prompts: [
      {
        title: 'SPEC.md 생성 프롬프트',
        text: '당신은 시니어 프로덕트 매니저입니다.\n아이디어: "호텔 총지배인이 매일 아침 OCC·ADR·RevPAR을 확인하는 모바일 대시보드"\n아래 구조로 SPEC.md를 작성하세요.\n1. 목적과 사용자\n2. 기능 요구사항(우선순위 P0/P1/P2)\n3. 화면 구성과 데이터 구조\n4. 기술 스택(React + Vite + TypeScript + Tailwind CSS)\n5. 개발 범위와 제외 범위\n6. 보안·개인정보 원칙(API Key는 환경변수, 개인정보 미수집)\n7. 검증 체크리스트(빌드·반응형·접근성)\n가정한 내용은 "가정"으로 표시하세요.',
        tip: 'SPEC.md가 명확할수록 AI가 만든 코드의 방향이 틀어질 확률이 줄어듭니다.',
      },
      {
        title: 'Claude Code 개발 지시 예시',
        text: 'SPEC.md를 읽고 P0 기능부터 구현해 주세요.\n작은 단위로 나누어 진행하고, 각 단위마다 빌드와 실행을 확인한 뒤 결과를 요약해 주세요.\n.env 와 API Key는 절대 커밋하지 말고 .gitignore 에 포함해 주세요.\n완료되면 README에 실행·배포 방법을 정리해 주세요.',
      },
    ],
    practice: {
      simId: 'spec-generator',
      mission: '호텔 업무 도구 아이디어로 SPEC.md를 생성하고, 배포 전 체크리스트를 통과시키세요.',
      steps: ['도구 아이디어와 기능을 입력한다', 'SPEC.md 초안을 생성한다', '배포 체크리스트를 점검한다', '명령어를 복사해 GitHub·Vercel 흐름을 확인한다'],
    },
    quiz: [
      { q: '바이브코딩에서 "가장 중요한 단계"로 표시된 것은?', options: ['개발 환경 구축', '기획/설계 → SPEC.md 작성', 'HTTPS 설정', '클라우드 선택'], answer: 1, explain: '인포그래픽의 ★ 표시: 아이디어를 문서로 정리하고 개발을 준비하는 SPEC.md 단계입니다.' },
      { q: 'API Key와 비밀정보를 GitHub에 올리지 않기 위한 방법은?', options: ['README에 적기', '.gitignore로 .env 제외, Vercel 환경변수 사용', '코드에 직접 입력', '이미지로 저장'], answer: 1, explain: '.gitignore로 비밀정보를 제외하고 Vercel 환경변수에서 안전하게 관리합니다.' },
      { q: 'GitHub에 푸시하면 자동으로 빌드·배포하고 미리보기 URL을 만들어 주는 플랫폼은?', options: ['Vercel', 'Excel', 'PowerPoint', 'Notepad'], answer: 0, explain: 'Vercel은 GitHub 푸시 시 자동 빌드(CI/CD)·배포·URL 생성을 제공합니다.' },
    ],
  },
]
