import { useMemo, useState } from 'react'
import { specIdeas } from '../data/simulations'
import { copyText } from '../utils/env'
import { ApprovalGate, Card, Field, Thinking, useRun } from './shared'

const CHECKS = [
  '.env 와 API Key 를 .gitignore 에 포함했다',
  '모바일·PC에서 레이아웃이 깨지지 않는다 (반응형)',
  '개인정보(이름·연락처·카드번호)를 저장·전송하지 않는다',
  'npm run build 가 오류 없이 통과한다',
  '이미지·데이터 파일 경로를 검증했다 (npm run validate)',
  'README 에 실행·배포 방법을 적었다',
]

const CMDS = `# 1) 로컬 검증
npm install
npm run validate && npm run build

# 2) GitHub 저장 (비밀정보는 .gitignore 로 제외됨)
git init
git add .
git commit -m "feat: 초기 버전"
git branch -M main
git remote add origin https://github.com/<계정>/hotel-ai-transformation.git
git push -u origin main

# 3) Vercel: GitHub 저장소 Import → 이후 push 마다 자동 빌드·배포
#    환경변수는 Vercel > Settings > Environment Variables 에 등록`

export default function SpecGen() {
  const [idea, setIdea] = useState(specIdeas[0].id)
  const base = specIdeas.find((i) => i.id === idea)!
  const [name, setName] = useState(base.label)
  const [features, setFeatures] = useState(base.features.join('\n'))
  const [checks, setChecks] = useState<boolean[]>(CHECKS.map(() => false))
  const [copied, setCopied] = useState(false)
  const { phase, run, reset } = useRun()

  const pick = (id: string) => {
    const i = specIdeas.find((x) => x.id === id)!
    setIdea(id)
    setName(i.label)
    setFeatures(i.features.join('\n'))
    reset()
  }

  const spec = useMemo(() => {
    const f = features.split('\n').map((s) => s.trim()).filter(Boolean)
    return `# SPEC.md — ${name}\n\n## 1. 목적과 사용자\n- 목적: ${name}을(를) 통해 호텔 업무의 반복 작업을 줄이고 의사결정을 빠르게 한다.\n- 사용자: 호텔 매니저·부서 담당자 (비개발자)\n\n## 2. 기능 요구사항\n${f.map((x, i) => `- [${i < 2 ? 'P0' : i < 4 ? 'P1' : 'P2'}] ${x}`).join('\n')}\n\n## 3. 화면 · 데이터 구조\n- 화면: 메인(요약) / 상세 / 설정\n- 데이터: data/*.ts(또는 JSON) — 코드 수정 없이 내용만 교체 가능\n\n## 4. 기술 스택\n- React + Vite + TypeScript + Tailwind CSS\n- 배포: GitHub → Vercel (push 시 자동 빌드)\n\n## 5. 개발 범위\n- 포함: 위 P0~P1 기능, 반응형, 가상 데이터\n- 제외: 실제 결제, 개인정보 수집, 실시간 외부 API 연동(후속 단계)\n\n## 6. 보안·개인정보 원칙\n- API Key는 환경변수(.env는 .gitignore 제외, Vercel에 등록)\n- 개인정보 미수집, 입력값 검증, OWASP Top 10 점검\n\n## 7. 검증 체크리스트\n- 빌드 통과 · 모바일/PC 확인 · 접근성 · 데이터 경로 검증\n\n## 8. 개발 원칙(바이브 코딩 4대 원칙)\n1. 명확한 의도  2. 작은 단위 반복  3. 즉시 검증  4. 위임하되 통제\n\n> 가정: 요구사항 중 우선순위(P0/P1/P2)는 입력 순서 기준의 가정입니다. 담당자가 확정하세요.`
  }, [name, features])

  const allChecked = checks.every(Boolean)
  return (
    <div className="space-y-3">
      <Field label="호텔 업무 도구 아이디어">
        <div className="flex flex-wrap gap-2">
          {specIdeas.map((i) => (<button key={i.id} className={`btn ${idea === i.id ? 'btn-cyan' : ''}`} onClick={() => pick(i.id)}>{i.label}</button>))}
        </div>
      </Field>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="도구 이름"><input className="field" value={name} onChange={(e) => { setName(e.target.value); reset() }} /></Field>
        <Field label="기능 목록 (한 줄에 하나, 위쪽이 높은 우선순위)"><textarea className="field min-h-[88px]" value={features} onChange={(e) => { setFeatures(e.target.value); reset() }} /></Field>
      </div>
      <button className="btn btn-gold" onClick={() => run(700)} disabled={phase === 'thinking'}>▶ SPEC.md 생성 (시뮬레이션)</button>
      {phase === 'thinking' && <Thinking label="요구사항 정리 → 화면·데이터 구조 → 기술 스택 → 범위 확정…" />}
      {phase === 'done' && (
        <>
          <ApprovalGate simId="spec-generator" title={`SPEC.md 승인: ${name}`} text={spec} checks={['목적·사용자가 명확하다', '개발 범위와 제외 범위를 구분했다', '보안·개인정보 원칙이 포함되어 있다']} onReject={reset} />
          <Card title="배포 전 체크리스트 (모두 체크하면 배포 준비 완료)">
            <ul className="space-y-1.5">
              {CHECKS.map((c, i) => (
                <li key={c}><label className="flex cursor-pointer items-start gap-2 text-[13px]"><input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-400" checked={checks[i]} onChange={() => setChecks(checks.map((v, k) => (k === i ? !v : v)))} />{c}</label></li>
              ))}
            </ul>
            <div className="mt-2 text-sm font-semibold">{allChecked ? <span className="text-emerald-300">✅ 배포 준비 완료</span> : <span className="text-slate-400">{checks.filter(Boolean).length}/{CHECKS.length} 완료</span>}</div>
          </Card>
          <Card title="GitHub · Vercel 배포 명령어 (복사해서 사용)">
            <pre className="overflow-x-auto whitespace-pre rounded-lg bg-black/40 p-3 text-[12.5px] text-emerald-200">{CMDS}</pre>
            <button className="btn mt-2" onClick={async () => { setCopied(await copyText(CMDS)); setTimeout(() => setCopied(false), 1500) }}>{copied ? '복사됨 ✓' : '📋 명령어 복사'}</button>
          </Card>
        </>
      )}
    </div>
  )
}
