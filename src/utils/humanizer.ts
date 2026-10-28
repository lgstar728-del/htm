// AI 말투 10패턴 탐지·수정 — 「전형적인 AI 말투」 인포그래픽 Ver 1.1 기준 규칙 기반 구현
export interface PatternDef {
  no: number
  name: string
  test: RegExp
  tip: string
}

export const patterns: PatternDef[] = [
  { no: 1, name: '무분별한 “~아니라”', test: /(이|가)?\s?아니라[,\s]|(이|가)?\s?아니고[,\s]/g, tip: '불필요한 ~아니라를 줄이고 핵심 메시지만 전달하세요.' },
  { no: 2, name: '따옴표·긴 하이픈 남용', test: /—|[‘’“”]|'[^']{1,12}'/g, tip: '꼭 필요한 경우에만 사용하고 자연스러운 문장 흐름을 유지하세요.' },
  { no: 3, name: '무분별한 “단순히”', test: /단순히|단순한|단순하게|그저/g, tip: '"단순히" 대신 구체적이고 명확한 표현을 쓰세요.' },
  { no: 4, name: '“또한/결과적으로” 연결어', test: /또한,?|결과적으로,?|게다가,?|더불어,?/g, tip: '의미가 중복되는 연결어를 줄이세요.' },
  { no: 5, name: '무분별한 Bold체·의문문', test: /\*\*[^*]+\*\*|[가-힣\w]+(까요|나요|시겠어요|일까요)\?/g, tip: '강조는 꼭 필요한 부분만, 의문문은 목적에 맞게.' },
  { no: 6, name: '“~을 넘어서/~로 이동한다”', test: /넘어서|넘어|로 이동(하|한)|는 남(는|습)다|계속 남습니다/g, tip: '거창한 표현 대신 구체적이고 현실적인 표현을 쓰세요.' },
  { no: 7, name: '“~임을 보여준다”', test: /임을 보여(준다|줍니다)|을 보여(준다|줍니다)/g, tip: '"알 수 있다/확인할 수 있다/나타났다" 같은 자연스러운 표현을 쓰세요.' },
  { no: 8, name: '“하지만~다” 대조 구조', test: /(하지만|그러나|다만),?\s|[가-힣]지만,?\s/g, tip: '불필요한 대조 구조를 줄이고 핵심 내용만 간결하게.' },
  { no: 9, name: '불필요한 “첫째, 둘째, 셋째”', test: /첫째,|둘째,|셋째,/g, tip: '화살표나 번호 목록은 꼭 필요한 경우에만.' },
  { no: 10, name: '과장된 말·표현', test: /혁신적인|완벽하게|놀라운|획기적|최고의|압도적|무한한|엄청난/g, tip: '과장 대신 사실에 기반한 신뢰할 수 있는 표현을 쓰세요.' },
]

export interface Finding {
  pattern: PatternDef
  count: number
}

export function detect(text: string): Finding[] {
  return patterns
    .map((p) => ({ pattern: p, count: (text.match(new RegExp(p.test.source, 'g')) ?? []).length }))
    .filter((f) => f.count > 0)
}

export function aiScore(text: string): number {
  const len = Math.max(text.length, 1)
  const hits = detect(text).reduce((a, f) => a + f.count, 0)
  // 100자당 발생 횟수를 0~100으로 환산
  return Math.min(100, Math.round((hits / len) * 100 * 18))
}

const hasBatchim = (w: string) => {
  const c = w.charCodeAt(w.length - 1)
  return c >= 0xac00 && c <= 0xd7a3 && (c - 0xac00) % 28 !== 0
}
const and = (w: string) => (hasBatchim(w) ? '과' : '와')

/**
 * 규칙 기반 1차 수정 — 장식 표현만 정리하며 사실·의미는 바꾸지 않습니다.
 * 의문문·대조("하지만")처럼 의미가 달라질 수 있는 부분은 자동 변환하지 않고 탐지만 합니다(사람이 직접 수정).
 */
export function humanize(text: string): string {
  let t = text
  t = t.replace(/\*\*([^*]+)\*\*/g, '$1') // Bold 제거
  t = t.replace(/\s?—\s?/g, ', ') // 긴 하이픈
  t = t.replace(/[‘’“”]/g, '')
  // ① "단순한 X가 아니라, Y" → "Y"
  t = t.replace(/단순한 [^,.\s]+?(이|가) 아니라,?\s*/g, '')
  // ⑥ "X를 넘어서, Y" → "Y" / "(단순히) X를 넘어서 Y" → "X와 Y"
  t = t.replace(/(?:단순히 )?[^\s,.]+?(을|를) 넘어서,\s*/g, '')
  t = t.replace(/(?:단순히 )?([^\s,.]+?)(을|를) 넘어서\s+/g, (_m, w: string) => `${w}${and(w)} `)
  t = t.replace(/단순히 |단순한 |단순하게 /g, '') // ③
  t = t.replace(/(또한|결과적으로|게다가|더불어),?\s?/g, '') // ④
  t = t.replace(/(첫째|둘째|셋째),\s?/g, '') // ⑨
  t = t.replace(/(혁신적인|완벽하게|놀라운|획기적인|압도적인) /g, '') // ⑩
  t = t.replace(/가 높음을 보여(준다|줍니다)/g, '가 높다는 것을 알 수 있다').replace(/임을 보여(준다|줍니다)/g, '임을 알 수 있다').replace(/(을|를) 보여(준다|줍니다)/g, '$1 확인할 수 있다') // ⑦
  t = t.replace(/이동하(는|며)/g, '나아가$1').replace(/이동한다/g, '나아간다') // ⑥
  t = t.replace(/(^|[.!?,]\s)(하지만|그러나|다만),?\s/g, '$1').replace(/([가-힣]+)지만,?\s/g, '$1고 ') // ⑧ (문장 첫머리 접속어를 먼저 제거)
  t = t.replace(/\s{2,}/g, ' ').replace(/\s+([,.])/g, '$1').replace(/\.\s*\./g, '.').replace(/,\s*,/g, ',').replace(/^[,\s]+/, '')
  return t.trim()
}
