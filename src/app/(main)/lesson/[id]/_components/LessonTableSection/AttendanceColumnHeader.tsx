'use client'

import { useEffect, useRef, useState } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import CloseIcon from '@/assets/icons/icon-close.svg'
import ConfirmModal from '@/components/common/ConfirmModal'
import useDisclosure from '@/hooks/useDisclosure'
import {
  MAX_ATTENDANCE_EXTRA_LABEL_LENGTH,
  MAX_ATTENDANCE_EXTRA_OPTIONS,
} from '@/lib/attendanceLabels'
import {
  attendanceExtraChipRemoveStyle,
  attendanceExtraChipStyle,
  attendanceExtraInputStyle,
  attendanceExtraRowStyle,
  attendanceThInnerStyle,
  attendanceThStyle,
  checkboxLabelActiveStyle,
  checkboxLabelStyle,
  colHeaderTitleBlockStyle,
  partialChipRecipe,
  thInnerStyle,
} from './LessonTable.css'

type ExtraOption = { id: number; label: string }

interface AttendanceColumnHeaderProps {
  extraOptions: ExtraOption[]
  allAttend: boolean
  onToggleAllAttend: () => void
  onAddOption?: (label: string) => void
  onRemoveOption?: (optionId: number, label: string) => void
}

export function AttendanceColumnHeader({
  extraOptions,
  allAttend,
  onToggleAllAttend,
  onAddOption,
  onRemoveOption,
}: AttendanceColumnHeaderProps) {
  const [draft, setDraft] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [pending, setPending] = useState<ExtraOption | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const confirmModal = useDisclosure()
  const canAdd = Boolean(onAddOption) && extraOptions.length < MAX_ATTENDANCE_EXTRA_OPTIONS

  useEffect(() => {
    if (isAdding) inputRef.current?.focus()
  }, [isAdding])

  const closeAdd = () => {
    setIsAdding(false)
    setDraft('')
  }

  const submitDraft = () => {
    const label = draft.trim()
    if (!label) {
      closeAdd()
      return
    }
    if (!onAddOption) return
    onAddOption(label)
    setDraft('')
  }

  return (
    <th className={attendanceThStyle}>
      <div className={attendanceThInnerStyle}>
        <div className={thInnerStyle}>
          <div className={colHeaderTitleBlockStyle}>
            출결
            {canAdd ? (
              <button
                type="button"
                className={partialChipRecipe({ on: isAdding })}
                aria-pressed={isAdding}
                aria-label="출결 선택지 추가"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (isAdding) {
                    closeAdd()
                    return
                  }
                  setIsAdding(true)
                }}
              >
                추가
              </button>
            ) : null}
          </div>
          <div
            className={`${checkboxLabelStyle}${allAttend ? ` ${checkboxLabelActiveStyle}` : ''}`}
            onClick={onToggleAllAttend}
          >
            <CheckIcon width={14} height={14} />
            전체 출석
          </div>
        </div>
        {extraOptions.length > 0 || isAdding ? (
          <div className={attendanceExtraRowStyle}>
            {extraOptions.map((opt) => (
              <span key={opt.id} className={attendanceExtraChipStyle}>
                {opt.label}
                {onRemoveOption ? (
                  <button
                    type="button"
                    className={attendanceExtraChipRemoveStyle}
                    aria-label={`${opt.label} 삭제`}
                    onClick={() => {
                      setPending(opt)
                      confirmModal.open()
                    }}
                  >
                    <CloseIcon width={12} height={12} />
                  </button>
                ) : null}
              </span>
            ))}
            {isAdding && canAdd ? (
              <input
                ref={inputRef}
                className={attendanceExtraInputStyle}
                value={draft}
                maxLength={MAX_ATTENDANCE_EXTRA_LABEL_LENGTH}
                placeholder="선택지 이름"
                aria-label="출결 선택지 이름"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    e.preventDefault()
                    closeAdd()
                    return
                  }
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    submitDraft()
                  }
                }}
                onBlur={() => {
                  if (draft.trim() === '') closeAdd()
                }}
              />
            ) : null}
          </div>
        ) : null}
      </div>
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => {
          confirmModal.close()
          setPending(null)
        }}
        onConfirm={() => {
          if (pending && onRemoveOption) onRemoveOption(pending.id, pending.label)
          confirmModal.close()
          setPending(null)
        }}
        title="이 선택지를 삭제할까요?"
        descriptions={[
          pending
            ? `'${pending.label}'을 쓰는 학생 출결은 비워집니다.`
            : '선택한 출결 값이 비워질 수 있어요.',
        ]}
        confirmLabel="삭제"
        confirmVariant="danger"
      />
    </th>
  )
}
