'use client'

import { useEffect, useState } from 'react'
import WhatsNewModal from '@/components/whats-new/WhatsNewModal/WhatsNewModal'
import { updateNotices } from '@/services/updateNotices'
import { useUserStore } from '@/stores/userStore'
import { whatsNewStorageKey, type UpdateNotice } from '@/lib/whatsNew'

export default function WhatsNewModalHost() {
  const user = useUserStore((s) => s.user)
  const [notice, setNotice] = useState<UpdateNotice | null>(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      try {
        const current = await updateNotices.getCurrent()
        if (cancelled || !current) return
        const seen = window.localStorage.getItem(whatsNewStorageKey(user.id, current.id))
        if (seen === '1') return
        setNotice(current)
      } catch {
        // ignore: 모달은 부가 기능
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const dismiss = () => {
    if (user && notice) {
      window.localStorage.setItem(whatsNewStorageKey(user.id, notice.id), '1')
    }
    setNotice(null)
  }

  return (
    <WhatsNewModal
      isOpen={Boolean(notice)}
      content={notice}
      onClose={dismiss}
    />
  )
}
