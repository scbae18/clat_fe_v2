'use client'

import { useEffect, useMemo, useState } from 'react'
import Text from '@/components/common/Text'
import Button from '@/components/common/Button'
import Modal from '@/components/common/Modal'
import CloseIcon from '@/assets/icons/icon-close.svg'
import MessageSettings from '@/app/(main)/template/_components/MessageSettings/MessageSettings'
import type { LessonItemDetail } from '@/services/lesson'
import type { LessonStudent } from '@/types/lessonStudent'
import {
  buildLessonMessageOrderState,
  messageOrderToApiItems,
} from '@/lib/lessonMessageOrder'
import { useToastStore } from '@/stores/toastStore'
import LessonMessagePreview from './LessonMessagePreview'
import {
  modalHeaderStyle,
  closeButtonStyle,
  columnsStyle,
  columnStyle,
  footerStyle,
} from './LessonMessageOrderModal.css'

interface LessonMessageOrderModalProps {
  isOpen: boolean
  onClose: () => void
  lesson: {
    class_name: string
    academy_name?: string
    lesson_date: string
    items: LessonItemDetail[]
  }
  commonValues: Record<string, string>
  students: LessonStudent[]
  onSave: (items: Array<{ source: 'template' | 'adhoc'; id: number }>) => Promise<void>
}

export default function LessonMessageOrderModal({
  isOpen,
  onClose,
  lesson,
  commonValues,
  students,
  onSave,
}: LessonMessageOrderModalProps) {
  const addToast = useToastStore((s) => s.addToast)
  const initial = useMemo(
    () => buildLessonMessageOrderState(lesson.items),
    [lesson.items],
  )
  const [messageOrder, setMessageOrder] = useState<string[]>(initial.messageOrder)
  const allItemsMap = useMemo(
    () => buildLessonMessageOrderState(lesson.items).allItemsMap,
    [lesson.items],
  )
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const next = buildLessonMessageOrderState(lesson.items)
    setMessageOrder(next.messageOrder)
  }, [isOpen, lesson.items])

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(messageOrderToApiItems(messageOrder))
      addToast({ variant: 'success', message: '문자 순서를 저장했어요.' })
      onClose()
    } catch {
      addToast({ variant: 'error', message: '문자 순서 저장에 실패했어요.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className={modalHeaderStyle}>
        <Text variant="headingMd" as="h2">
          문자 순서 설정
        </Text>
        <button type="button" className={closeButtonStyle} aria-label="닫기" onClick={onClose}>
          <CloseIcon width={24} height={24} />
        </button>
      </div>

      <div className={columnsStyle}>
        <div className={columnStyle}>
          <MessageSettings
            messageOrder={messageOrder}
            allItemsMap={allItemsMap}
            onToggle={() => {}}
            onReorder={setMessageOrder}
            toggleDisabled
          />
        </div>
        <div className={columnStyle}>
          <LessonMessagePreview
            messageOrder={messageOrder}
            allItemsMap={allItemsMap}
            className={lesson.class_name}
            academyName={lesson.academy_name}
            lessonDate={lesson.lesson_date}
            commonValues={commonValues}
            students={students}
            lessonItems={lesson.items}
          />
        </div>
      </div>

      <div className={footerStyle}>
        <Button variant="secondary" size="sm" onClick={onClose} disabled={saving}>
          취소
        </Button>
        <Button variant="primary" size="sm" onClick={() => void handleSave()} disabled={saving}>
          {saving ? '저장 중…' : '적용'}
        </Button>
      </div>
    </Modal>
  )
}
