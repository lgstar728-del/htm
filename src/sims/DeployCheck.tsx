import { useState } from 'react'
import { ApprovalGate, Card, Field, Pill } from './shared'
import { copyText } from '../utils/env'

const CHECKS = [
  ['.env와 API Key가 .gitignore에 포함되어 있다 (저장소에는 .env.example만)', '보안'],
  ['node_modules·dist 등 재생성 가능한 폴더가 .gitignore에 있다', 'Git'],
  ['npm run build 가 로컬에서 오류 없이 통과한다', '빌드'],
  ['모바일·PC에서 레이아웃이 깨지지 않는다 (반응형)', '표시'],
  ['핵심 기능(추가·삭제·저장)이 동작하고 빈 값·긴 값 입력이 처리된다', '기능'],
  ['입력 검증·에러 정보 노출·의존성(npm audit)을 점검했다', '보안'],
  ['README에 실행·배포 방법이 적혀 있다', '유지보수'],
  ['큰 변경 전에 커밋(세이브 포인트)을 남겼다', 'Git'],
] as const

const CMDS = `# 1) 로컬 검증
npm install
npm run build

# 2) GitHub 저장 (비밀정보는 .gitignore로 제외됨)
git init
git add .
git commit -m "feat: 첫 버전"
git branch -M main
git remote add origin https://github.com/<계정>/<저장소>.git
git push -u origin main

# 3) Vercel: Add New → Project → GitHub 저장소 Import (Vite 자동 감지)
#    환경변수는 Vercel > Settings > Environment Variables 에 등록
# 4) 수정 후 push 하면 자동 재배포 → 배포 URL을 폰으로 확인`

const CASES = [
  { id: 'env', sym: '로컬에서는 API가 되는데 배포에서는 "데이터를 불러올 수 없음"', cause: '환경변수 누락', fix: 'Vercel > Settings > Environment Variables 에 .env와 같은 값을 등록하고 재배포' },
  { id: 'build', sym: '로컬 dev 서버는 되는데 Vercel 빌드 로그에 타입 오류로 실패', cause: '빌드의 엄격한 검사', fix: '빌드 로그의 첫 오류를 AI에게 전달하고 로컬에서 npm run build 로 먼저 재현' },
  { id: 'case', sym: "로컬(Windows)에서는 import './Header' 가 되는데 배포(Linux)에서만 모듈을 찾을 수 없음", cause: '파일 경로 대소문자', fix: '실제 파일명(header.tsx)과 import 대소문자를 일치시킨다' },
]

export default function DeployCheck() {
  const [ticks, setTicks] = useState<boolean[]>(CHECKS.map(() => false))
  const [copied, setCopied] = useState(false)
  const [pick, setPick] = useState<Record<string, string>>({})
  const done = ticks.filter(Boolean).length
  const correct = CASES.filter((c) => pick[c.id] === c.cause).length
  const answered = Object.keys(pick).length === CASES.length
  const report = `[배포 준비 점검] 체크리스트 ${done}/${CHECKS.length}\n${CHECKS.map((c, i) => `${ticks[i] ? '[x]' : '[ ]'} ${c[0]}`).join('\n')}\n\n배포 실패 진단 연습: ${correct}/${CASES.length}\n\n※ 배포 후에는 다른 기기·다른 네트워크에서 접속해 기능·화면·속도를 확인합니다.`
  return (
    <div className="space-y-3">
      <Card title={`배포 전 체크리스트 (${done}/${CHECKS.length})`}>
        <ul className="space-y-1.5">
          {CHECKS.map((c, i) => (
            <li key={c[0]}><label className="flex cursor-pointer items-start gap-2 text-[13.5px]"><input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-400" checked={ticks[i]} onChange={() => setTicks(ticks.map((v, k) => (k === i ? !v : v)))} /><span className="flex-1">{c[0]}</span><Pill>{c[1]}</Pill></label></li>
          ))}
        </ul>
        <div className="mt-2 text-sm font-semibold">{done === CHECKS.length ? <span className="text-emerald-300">✅ 배포 준비 완료</span> : <span className="text-slate-400">모두 체크하면 배포 준비 완료</span>}</div>
      </Card>
      <Card title="GitHub → Vercel 명령어 (복사해서 사용)">
        <pre className="overflow-x-auto whitespace-pre rounded-lg bg-black/40 p-3 text-[12.5px] text-emerald-200">{CMDS}</pre>
        <button className="btn mt-2" onClick={async () => { setCopied(await copyText(CMDS)); setTimeout(() => setCopied(false), 1500) }}>{copied ? '복사됨 ✓' : '📋 명령어 복사'}</button>
      </Card>
      <Card title="배포 실패 진단 — 증상별 원인을 고르세요">
        <div className="space-y-3">
          {CASES.map((c) => (
            <Field key={c.id} label={c.sym}>
              <select className="field" value={pick[c.id] ?? ''} onChange={(e) => setPick({ ...pick, [c.id]: e.target.value })}>
                <option value="">원인 선택…</option>
                {['환경변수 누락', '빌드의 엄격한 검사', '파일 경로 대소문자'].map((o) => <option key={o}>{o}</option>)}
              </select>
              {pick[c.id] && <span className={`mt-1 block text-[12.5px] ${pick[c.id] === c.cause ? 'text-emerald-300' : 'text-rose-300'}`}>{pick[c.id] === c.cause ? '✅ 정답 — ' : `❌ 정답은 "${c.cause}" — `}{c.fix}</span>}
            </Field>
          ))}
        </div>
        {answered && <div className="mt-2"><Pill tone={correct === CASES.length ? 'green' : 'gold'}>{correct}/{CASES.length} 정답</Pill></div>}
      </Card>
      <ApprovalGate simId="deploy-check" title={`배포 준비 점검 승인 (${done}/${CHECKS.length})`} text={report} checks={['배포 후 폰으로 접속해 확인한다', '환경변수를 Vercel에 등록했다', '공개해도 되는 데이터만 포함되어 있다']} />
    </div>
  )
}
