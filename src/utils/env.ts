// 실행 환경 판별 — 저사양/WebGL 미지원 기기는 2D 대체 화면으로 자동 전환
export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')))
  } catch {
    return false
  }
}

export function isLowEnd(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const lowMem = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2
  const lowCpu = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  return lowMem || lowCpu || !!reduced
}

export function isMobile(): boolean {
  return window.matchMedia?.('(max-width: 767px)').matches ?? false
}

export function safeStorage() {
  return {
    get(key: string): string | null {
      try {
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    set(key: string, value: string) {
      try {
        localStorage.setItem(key, value)
      } catch {
        /* 저장소 사용 불가 환경 — 무시 */
      }
    },
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(ta)
      return ok
    } catch {
      return false
    }
  }
}
