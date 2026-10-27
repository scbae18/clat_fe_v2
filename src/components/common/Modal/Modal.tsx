'use client'

import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { overlayStyle, modalRecipe, modalBodyStyle } from './Modal.css'
import { useRegisterModal } from './useRegisterModal'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Modal({ isOpen, onClose, size = 'md', children }: ModalProps) {
  const [mounted, setMounted] = useState(false)
  useRegisterModal(isOpen)

  useEffect(() => {
    setMounted(true)
  }, [])

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
