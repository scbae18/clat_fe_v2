'use client'

import { useEffect, useState } from 'react'
import SuccessIcon from '@/assets/icons/icon-success.svg'
import WarningIcon from '@/assets/icons/icon-warning.svg'
import ErrorIcon from '@/assets/icons/icon-error.svg'
import { useToastStore, type Toast as ToastType } from '@/stores/toastStore'
import { toastStyle, toastClosingStyle } from './Toast.css'

const ICON_MAP = {
  success: SuccessIcon,
  warning: WarningIcon,
  error: ErrorIcon,
}

const DURATION = 3000
const EXIT_DURATION = 250

export default function Toast({ id, variant, message }: ToastType) {
  const removeToast = useToastStore((s) => s.removeToast)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsClosing(true), DURATION)
    return () => clearTimeout(timer)
  }, [])

  const handleAnimationEnd = () => {
    if (isClosing) removeToast(id)
  }

  const Icon = ICON_MAP[variant]

  return (
    <div
      className={`${toastStyle}${isClosing ? ` ${toastClosingStyle}` : ''}`}
      onAnimationEnd={handleAnimationEnd}
    >
      <Icon width={24} height={24} style={{ flexShrink: 0 }} />
      {message}
    </div>
  )
}
