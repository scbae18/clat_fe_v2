'use client'

import { useEffect } from 'react'
import { useModalStore } from '@/stores/modalStore'

/** 열린 동안 배경 스크롤 잠금 카운트에 올린다. */
export function useRegisterModal(open: boolean) {
  const registerOpen = useModalStore((s) => s.registerOpen)
  const registerClose = useModalStore((s) => s.registerClose)

  useEffect(() => {
    if (!open) return
    registerOpen()
    return () => registerClose()
  }, [open, registerOpen, registerClose])
}
