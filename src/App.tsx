import { Component, Suspense, lazy, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from './components/Header'
import { HotelSelector } from './components/HotelSelector'
import { LearningPanel } from './components/LearningPanel'
import { KnowledgeGraphModal } from './components/KnowledgeGraph'
import { Dashboard } from './components/Dashboard'
import { Fallback2D } from './components/Fallback2D'
import { hotelById } from './data/hotels'
import { useStore } from './utils/store'

const HotelScene3D = lazy(() => import('./components/HotelScene3D').then((m) => ({ default: m.HotelScene3D })))

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(err: unknown) {
    console.error('3D 장면 오류 — 2D 모드로 전환합니다', err)
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function Loading3D() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#050a1c]">
      <div className="text-center">
        <div className="mx-auto mb-3 h-12 w-12 animate-spin rounded-full border-4 border-gold/30 border-t-gold" />
        <div className="text-sm font-semibold text-slate-200">3D 호텔 광장을 불러오는 중…</div>
      </div>
    </div>
  )
}

function TransitionOverlay() {
  const fade = useStore((s) => s.fade)
  const hotelId = useStore((s) => s.hotelId)
  const screen = useStore((s) => s.screen)
  const h = hotelById(hotelId ?? '')
  return (
    <AnimatePresence>
      {fade && (
        <motion.div key="fade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }} className="pointer-events-none absolute inset-0 z-[60] grid place-items-center bg-[#030714]">
          <div className="text-center">
            <div className="text-[11px] font-bold tracking-[0.35em] text-gold">{screen === 'world' ? 'ENTERING LOBBY' : 'BACK TO PLAZA'}</div>
            <div className="mt-1 text-2xl font-extrabold text-white">{h?.name}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const mode3d = useStore((s) => s.mode3d)
  const setMode3d = useStore((s) => s.setMode3d)
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#050a1c]">
      {mode3d ? (
        <SceneBoundary onError={() => setMode3d(false)}>
          <Suspense fallback={<Loading3D />}>
            <HotelScene3D />
          </Suspense>
        </SceneBoundary>
      ) : (
        <Fallback2D />
      )}
      <Header />
      {mode3d && <HotelSelector />}
      {!mode3d && <HotelSelectorSpacer />}
      <LearningPanel />
      <KnowledgeGraphModal />
      <Dashboard />
      <TransitionOverlay />
    </div>
  )
}

/** 2D 모드에서는 Fallback2D 가 선택 UI를 제공하므로 별도 HUD가 필요 없음 */
function HotelSelectorSpacer() {
  return null
}
