'use client'

import { useEffect, useState } from 'react'
import { useTutorial } from '@/features/tutorial/TutorialProvider'
import { billingService, type GrantNotice } from '@/services/billing'
import { useUserStore } from '@/stores/userStore'
import GrantNoticeModal from './GrantNoticeModal'

export default function GrantNoticeHost() {
  const user = useUserStore((s) => s.user)
  const hold = useTutorial().holdWhatsNew
  const [notice, setNotice] = useState<GrantNotice | null>(null)

  useEffect(() => {
    if (!user || hold) return
    let cancelled = false
    ;(async () => {
      try {
        const current = await billingService.grantNotice()
        if (!cancelled) setNotice(current)
      } catch {
        // 안내가 없어도 앱은 그대로 쓴다.
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, hold])

  return <GrantNoticeModal notice={hold ? null : notice} onDone={() => setNotice(null)} />
}
