'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useToastStore } from '@/stores/toastStore'
import Toast from './Toast'
import { containerStyle } from './Toast.css'

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div className={containerStyle}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    document.body,
  )
}
