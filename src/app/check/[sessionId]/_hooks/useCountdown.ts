import { useEffect, useState } from 'react'

export function useCountdown(iso: string | null) {
  const [sec, setSec] = useState(0)
  useEffect(() => {
    if (!iso) return
    const t = () => setSec(Math.max(0, Math.floor((new Date(iso).getTime() - Date.now()) / 1000)))
    t()
    const id = setInterval(t, 1000)
    return () => clearInterval(id)
  }, [iso])
  return sec
}
