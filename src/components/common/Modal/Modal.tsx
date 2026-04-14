'use client'

import { ReactNode } from 'react'
import { overlayStyle, modalRecipe } from './Modal.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md'
  children: ReactNode
}

export default function Modal({ isOpen, onClose, size = 'md', children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className={overlayStyle} onClick={onClose}>
      <div
        className={modalRecipe({ size })}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}