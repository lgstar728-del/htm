import { Suspense, lazy } from 'react'
import { simById } from '../data/simulations'
import { SimBanner } from '../sims/shared'

const registry = {
  'reservation-reply': lazy(() => import('../sims/Reservation')),
  complaint: lazy(() => import('../sims/Complaint')),
  demand: lazy(() => import('../sims/Demand')),
  'adr-revpar': lazy(() => import('../sims/AdrRevpar')),
  marketing: lazy(() => import('../sims/Marketing')),
  banquet: lazy(() => import('../sims/Banquet')),
  'ops-report': lazy(() => import('../sims/OpsReport')),
  'agent-automation': lazy(() => import('../sims/Agent')),
  housekeeping: lazy(() => import('../sims/Housekeeping')),
  humanizer: lazy(() => import('../sims/HumanizerSim')),
  'spec-generator': lazy(() => import('../sims/SpecGen')),
} as const

export const simulationIds = Object.keys(registry)

export function SimulationPanel({ simId }: { simId: string }) {
  const meta = simById(simId)
  const Comp = registry[simId as keyof typeof registry]
  if (!meta || !Comp) return <div className="rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm">실습 모듈 “{simId}”을(를) 찾을 수 없습니다. data/simulations.ts 와 SimulationPanel.tsx 를 확인하세요.</div>
  return (
    <section aria-label={meta.title} className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-2xl">{meta.icon}</span>
        <div>
          <div className="text-lg font-bold text-white">{meta.title}</div>
          <div className="text-[13px] text-slate-300">{meta.desc}</div>
        </div>
      </div>
      <SimBanner />
      <Suspense fallback={<div className="p-6 text-center text-slate-300">실습 모듈을 불러오는 중…</div>}>
        <Comp />
      </Suspense>
    </section>
  )
}
