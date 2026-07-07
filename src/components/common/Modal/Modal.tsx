'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useModalStore } from '@/stores/modalStore'
import { overlayStyle, modalRecipe, modalBodyStyle } from './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Modal({ isOpen, onClose, size = 'md', children }: ModalProps) {
  const registerOpen = useModalStore((s) => s.registerOpen)
  const registerClose = useModalStore((s) => s.registerClose)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    registerOpen()
    return () => registerClose()
  }, [isOpen, registerOpen, registerClose])

  if (!isOpen || !mounted) return null

  return createPortal(
    <div className={overlayStyle} onClick={onClose} role="presentation">
      <div
        className={modalRecipe({ size })}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={modalBodyStyle}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
