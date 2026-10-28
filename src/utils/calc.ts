// 호텔 핵심 지표 계산 — 실제 공식으로 동작합니다.
export interface RoomMetrics {
  occ: number // 0~1
  adr: number
  revpar: number
}

export function roomMetrics(roomsAvail: number, roomsSold: number, roomRevenue: number): RoomMetrics {
  const occ = roomsAvail > 0 ? roomsSold / roomsAvail : 0
  const adr = roomsSold > 0 ? roomRevenue / roomsSold : 0
  const revpar = roomsAvail > 0 ? roomRevenue / roomsAvail : 0
  return { occ, adr, revpar }
}

/** 요금 변경 시 수요 탄력성을 반영한 가상 시나리오 (elasticity: 요금 1% 상승 시 판매객실 감소 %) */
export function priceScenario(base: { roomsAvail: number; roomsSold: number; adr: number }, pricePct: number, elasticity: number) {
  const newAdr = base.adr * (1 + pricePct / 100)
  const soldFactor = Math.max(0, 1 - (pricePct / 100) * elasticity)
  const newSold = Math.min(base.roomsAvail, Math.round(base.roomsSold * soldFactor))
  const revenue = newAdr * newSold
  return { ...roomMetrics(base.roomsAvail, newSold, revenue), sold: newSold, revenue }
}

export const won = (n: number) => `${Math.round(n).toLocaleString('ko-KR')}원`
export const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`
export const man = (n: number) => `${(n / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`

/** 이동평균 + 요일 계절성 + 이벤트 가산으로 7일 예측 (설명 가능한 단순 모델) */
export function forecastOccupancy(history: number[], uplifts: number[]): { forecast: number[]; mape: number } {
  const n = history.length
  // 요일 계절성: 7일 전 값과의 비율 평균
  const seasonal = (i: number) => history[n - 7 + (i % 7)] ?? history[n - 1]
  const level = history.slice(-7).reduce((a, b) => a + b, 0) / 7
  const prevLevel = history.slice(-14, -7).reduce((a, b) => a + b, 0) / 7 || level
  const trend = (level - prevLevel) / 7
  const forecast = Array.from({ length: 7 }, (_, i) => {
    const base = 0.6 * seasonal(i) + 0.4 * (level + trend * (i + 1))
    return Math.min(1, Math.max(0.3, base + (uplifts[i] ?? 0)))
  })
  // 백테스트: 최근 7일을 직전 7일 이동평균으로 예측했을 때의 오차(MAPE)
  const test = history.slice(-7)
  const prev = history.slice(-14, -7)
  const mapeSum = test.reduce((acc, actual, i) => acc + Math.abs(actual - (prev[i] ?? actual)) / actual, 0)
  return { forecast, mape: mapeSum / test.length }
}
