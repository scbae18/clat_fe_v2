import { useEffect, useState } from 'react'

const CODE_TTL_MS = 10 * 60 * 1000

export function formatCodeTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/** 인증번호를 보낸 뒤 10분 제한. 다시 보내면 처음부터 센다. */
export function useCodeTimer() {
  const [expiresAt, setExpiresAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (expiresAt == null) return
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [expiresAt])

  const remaining = expiresAt == null ? 0 : Math.max(0, Math.ceil((expiresAt - now) / 1000))

  return {
    remaining,
    label: remaining > 0 ? formatCodeTimer(remaining) : null,
    start: () => {
      setNow(Date.now())
      setExpiresAt(Date.now() + CODE_TTL_MS)
    },
    clear: () => setExpiresAt(null),
  }
}
