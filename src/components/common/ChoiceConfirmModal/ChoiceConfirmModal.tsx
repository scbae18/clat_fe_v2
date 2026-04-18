'use client'

import Modal from '@/components/common/Modal'
import {
  bodyStyle,
  titleStyle,
  descBlockStyle,
  descLineStyle,
  actionsStyle,
  cancelBtnStyle,
  confirmPrimaryStyle,
  confirmDangerStyle,
} from './ChoiceConfirmModal.css'

export interface ChoiceConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  descriptions?: string[]
  cancelLabel?: string
  confirmLabel?: string
  /** primary: brand blue; danger: Figma delete #e54351 */
  confirmTone?: 'primary' | 'danger'
  confirmDisabled?: boolean
}

export default function ChoiceConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  descriptions,
  cancelLabel = '\u{CDE8}\u{C18C}',
  confirmLabel = '\u{D655}\u{C778}',
  confirmTone = 'primary',
  confirmDisabled = false,
}: ChoiceConfirmModalProps) {
  const confirmClass = confirmTone === 'danger' ? confirmDangerStyle : confirmPrimaryStyle

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className={bodyStyle}>
        <h2 className={titleStyle}>{title}</h2>
        {descriptions && descriptions.length > 0 && (
          <div className={descBlockStyle}>
            {descriptions.map((line, i) => (
              <p key={i} className={descLineStyle}>
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
      <div className={actionsStyle}>
        <button type="button" className={cancelBtnStyle} onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={confirmClass}
          disabled={confirmDisabled}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
