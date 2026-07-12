import { useEffect, useState } from 'react'

export function formatAttendanceRemaining(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function useRemainingSeconds(expiresAtIso: string | null) {
  const [sec, setSec] = useState(0)
  useEffect(() => {
    if (!expiresAtIso) return
    const tick = () => {
      const end = new Date(expiresAtIso).getTime()
      if (!Number.isFinite(end)) {
        setSec(0)
        return
      }
      setSec(Math.max(0, Math.floor((end - Date.now()) / 1000)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [expiresAtIso])
  return sec
}
