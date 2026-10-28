// 코드·콘텐츠·이미지 간 연결 오류 자동 점검 (npm run validate, 빌드 전에 자동 실행)
import { build } from 'esbuild'
import { existsSync, readFileSync, mkdirSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = join(root, 'node_modules', '.cache', 'validate')
mkdirSync(tmp, { recursive: true })
const entry = join(tmp, 'entry.ts')
const out = join(tmp, 'data.mjs')

import { writeFileSync } from 'node:fs'
writeFileSync(
  entry,
  `export { hotels } from '${join(root, 'src/data/hotels.ts').replace(/\\/g, '/')}'
export { lessons } from '${join(root, 'src/data/lessons.ts').replace(/\\/g, '/')}'
export { courses } from '${join(root, 'src/data/courses.ts').replace(/\\/g, '/')}'
export { infographics } from '${join(root, 'src/data/infographics.ts').replace(/\\/g, '/')}'
export { simulations } from '${join(root, 'src/data/simulations.ts').replace(/\\/g, '/')}'
`,
)
await build({ entryPoints: [entry], outfile: out, bundle: true, format: 'esm', platform: 'node', logLevel: 'silent' })
const { hotels, lessons, courses, infographics, simulations } = await import(pathToFileURL(out).href + `?t=${Date.now()}`)

const errors = []
const warns = []
const err = (m) => errors.push(m)
const warn = (m) => warns.push(m)

const lessonIds = new Set(lessons.map((l) => l.id))
const simIds = new Set(simulations.map((s) => s.id))
const hotelIds = new Set(hotels.map((h) => h.id))
const infoIds = new Set(infographics.map((i) => i.id))

if (lessonIds.size !== lessons.length) err('강의 id 중복')
if (hotelIds.size !== hotels.length) err('호텔 id 중복')
if (hotels.length !== 5) warn(`호텔이 ${hotels.length}개입니다 (요구사항: 5개)`)

// 코스 ↔ 강의
for (const c of courses) for (const id of c.lessonIds) if (!lessonIds.has(id)) err(`코스 ${c.id}: 존재하지 않는 강의 ${id}`)
const inCourse = new Set(courses.flatMap((c) => c.lessonIds))
for (const l of lessons) if (!inCourse.has(l.id)) err(`강의 ${l.id} 가 어떤 코스에도 속하지 않음`)

// 호텔 ↔ 부서 ↔ 강의·실습
const reachable = new Set()
const deptIds = new Set()
const registrySrc = readFileSync(join(root, 'src/components/SimulationPanel.tsx'), 'utf8')
for (const h of hotels) {
  if (h.departments.length < 3) warn(`${h.id}: 부서가 3개 미만`)
  for (const d of h.departments) {
    if (deptIds.has(d.id)) err(`부서 id 중복: ${d.id}`)
    deptIds.add(d.id)
    if (!lessonIds.has(d.lessonId)) err(`${h.id}/${d.id}: 존재하지 않는 강의 ${d.lessonId}`)
    else reachable.add(d.lessonId)
    if (!simIds.has(d.simId)) err(`${h.id}/${d.id}: 존재하지 않는 실습 ${d.simId}`)
  }
}
for (const l of lessons) if (!reachable.has(l.id)) warn(`강의 ${l.id}(${l.title}) 는 3D 부서에서 바로 열 수 없음 (지식그래프/목록으로만 접근)`)

// 실습 모듈 연결
for (const s of simulations) {
  if (!registrySrc.includes(`'${s.id}'`) && !new RegExp(`\\b${s.id}:`).test(registrySrc)) err(`실습 ${s.id}: SimulationPanel.tsx 에 컴포넌트가 연결되지 않음`)
}

// 강의 내용
const required = ['Prompt Engineering', 'Context Engineering', 'Harness Engineering', 'Loop Engineering', 'Graph Engineering', 'Humanizer', 'Vibe Coding', 'GitHub', 'Vercel', 'DX', 'AX', 'Agent', 'Cowork']
const corpus = JSON.stringify(lessons)
for (const k of required) if (!corpus.includes(k)) err(`필수 교육 키워드 누락: ${k}`)

for (const l of lessons) {
  if (!l.objectives?.length) err(`${l.id}: 학습목표 없음`)
  if (!l.theory?.length) err(`${l.id}: 핵심 이론 없음`)
  if (!l.hotelCases?.length) err(`${l.id}: 호텔 적용사례 없음`)
  if (!l.prompts?.length) err(`${l.id}: AI 프롬프트 없음`)
  if (!l.quiz?.length) err(`${l.id}: 퀴즈 없음`)
  if (l.practice?.simId && !simIds.has(l.practice.simId)) err(`${l.id}: 존재하지 않는 실습 ${l.practice.simId}`)
  if (l.infographicId && !infoIds.has(l.infographicId)) err(`${l.id}: 존재하지 않는 인포그래픽 ${l.infographicId}`)
  for (const c of l.hotelCases ?? []) if (!hotelIds.has(c.hotelId)) err(`${l.id}: 사례의 호텔 ${c.hotelId} 없음`)
  for (const q of l.quiz ?? []) if (q.answer < 0 || q.answer >= q.options.length) err(`${l.id}: 퀴즈 정답 인덱스 오류 "${q.q}"`)
}

// 인포그래픽 이미지 파일 (PNG 시그니처·크기 일치)
for (const i of infographics) {
  const p = join(root, 'public', i.src.replace(/^\//, ''))
  if (!existsSync(p)) {
    err(`이미지 파일 없음: ${i.src}`)
    continue
  }
  const b = readFileSync(p)
  if (b.readUInt32BE(0) !== 0x89504e47) err(`${i.src}: PNG 형식이 아님`)
  else {
    const w = b.readUInt32BE(16)
    const h = b.readUInt32BE(20)
    if (w !== i.width || h !== i.height) warn(`${i.src}: 실제 크기 ${w}x${h} ≠ 데이터 ${i.width}x${i.height} → data/infographics.ts 수정 권장`)
  }
  for (const id of i.lessonIds) if (!lessonIds.has(id)) err(`인포그래픽 ${i.id}: 존재하지 않는 강의 ${id}`)
}
for (const f of ['index.html', 'vercel.json', '.gitignore']) if (!existsSync(join(root, f))) err(`필수 파일 없음: ${f}`)
const gi = readFileSync(join(root, '.gitignore'), 'utf8')
if (!/^\.env$/m.test(gi)) err('.gitignore 에 .env 가 없음 (API Key 유출 위험)')

// 비밀정보 패턴 스캔 (src, scripts, public 제외 이미지)
const secretRe = /(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/
import { readdirSync, statSync } from 'node:fs'
function walk(d) {
  for (const n of readdirSync(d)) {
    if (n === 'node_modules' || n === 'dist' || n === '.git') continue
    const p = join(d, n)
    const s = statSync(p)
    if (s.isDirectory()) walk(p)
    else if (/\.(ts|tsx|js|mjs|json|md|html|css|yml)$/.test(n) && secretRe.test(readFileSync(p, 'utf8'))) err(`비밀정보로 보이는 문자열 발견: ${p}`)
  }
}
walk(join(root, 'src'))
walk(join(root, 'scripts'))

rmSync(tmp, { recursive: true, force: true })

console.log(`\n콘텐츠 검증: 호텔 ${hotels.length} · 부서 ${deptIds.size} · 강의 ${lessons.length} · 실습 ${simulations.length} · 인포그래픽 ${infographics.length}`)
for (const w of warns) console.log('  ⚠ ', w)
for (const e of errors) console.log('  ✖ ', e)
if (errors.length) {
  console.log(`\n실패: 오류 ${errors.length}건`)
  process.exit(1)
}
console.log('통과: 오류 없음\n')
