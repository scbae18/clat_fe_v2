'use client'

import { useEffect, useRef, useState } from 'react'
import Text from '@/components/common/Text'
import CloseIcon from '@/assets/icons/icon-close.svg'
import CheckIcon from '@/assets/icons/icon-check.svg'
import PlusIcon from '@/assets/icons/icon-plus.svg'
import AddItemForm from '../AddItemForm/AddItemForm'
import {
  sectionStyle,
  sectionHeaderStyle,
  itemListStyle,
  itemVariants,
  itemLabelVariants,
  itemInputVariants,
  deleteButtonStyle,
  checkButtonVariants,
  addButtonStyle,
} from './ContentSection.css'
import { colors } from '@/styles/tokens/colors'
import type { TemplateItem } from '../../_types/template'
import { reportTutorialAction } from '@/features/tutorial/tutorialEvents'
import { useTutorial } from '@/features/tutorial/TutorialProvider'

interface ContentSectionProps {
  title: string
  description: string
  items: TemplateItem[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  // 인라인 모드 (공통 내용): 항목 즉시 생성 후 인라인 편집
  onAddInline?: () => string
  onUpdate?: (id: string, label: string) => void
  // 폼 모드 (개별 내용): AddItemForm 표시
  onAdd?: (label: string, type: string, choices?: string[]) => void
  tourId?: 'common' | 'individual'
}

function renderLabel(label: string) {
  if (!label.includes('*')) return label
  return label.split('*').map((part, i, arr) =>
    i < arr.length - 1 ? (
      <span key={i}>{part}<span style={{ color: colors.error500 }}>*</span></span>
    ) : part
  )
}

export default function ContentSection({
  title,
  description,
  items,
  onToggle,
  onDelete,
  onAddInline,
  onUpdate,
  onAdd,
  tourId,
}: ContentSectionProps) {
  const tour = useTutorial()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const reopenSeen = useRef(tour.reopenTick)

  const handleInlineAdd = () => {
    if (!onAddInline) return
    const newId = onAddInline()
    setEditingId(newId)
    setEditingValue('')
  }

  useEffect(() => {
    if (tour.reopenTick === reopenSeen.current) return
    reopenSeen.current = tour.reopenTick
    if (tour.status !== 'in_progress' || tour.step !== 1) return
    if (tourId === 'individual') setIsFormOpen(true)
    if (tourId === 'common' && editingId == null) handleInlineAdd()
  }, [editingId, tour.reopenTick, tour.status, tour.step, tourId])

  const confirmEdit = (id: string) => {
    const trimmed = editingValue.trim()
    if (trimmed === '') {
      onDelete(id)
      setEditingId(null)
      return
    }
    const tourNeedsMore =
      tourId === 'common' && tour.status === 'in_progress' && tour.step === 1 && trimmed.length < 2
    onUpdate?.(id, trimmed)
    if (tourNeedsMore) return
    if (tourId === 'common') reportTutorialAction('common-added')
    setEditingId(null)
  }

  const cancelEdit = (id: string) => {
    onDelete(id)
    setEditingId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') confirmEdit(id)
    else if (e.key === 'Escape') cancelEdit(id)
  }

  return (
    <div
      className={sectionStyle}
      data-tour={tourId === 'common' ? 'template-common' : tourId === 'individual' ? 'template-individual' : undefined}
    >
      <div className={sectionHeaderStyle}>
        <Text variant="headingMd">{title}</Text>
        <Text variant="bodyMd" color="gray500">{description}</Text>
      </div>
      <div className={itemListStyle}>
        {items.map((item) => {
          const state = item.isActive ? 'active' : 'inactive'
          return (
            <div
              key={item.id}
              className={itemVariants[state]}
              data-tour={item.itemType === 'attendance' ? 'template-attendance' : undefined}
            >
              {item.id === editingId ? (
                <input
                  className={itemInputVariants[state]}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => confirmEdit(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  autoFocus
                  data-tour={tourId === 'common' ? 'template-common-input' : undefined}
                />
              ) : (
                <span className={itemLabelVariants[state]}>
                  {renderLabel(item.label)}
                </span>
              )}
              {!item.locked && (
                <button className={deleteButtonStyle} onClick={() => onDelete(item.id)}>
                  <CloseIcon width={16} height={16} />
                </button>
              )}
            </div>
          )
        })}

        {onAddInline ? (
          <button
            className={addButtonStyle}
            onClick={handleInlineAdd}
            data-tour={tourId === 'common' ? 'template-common-add' : undefined}
          >
            <PlusIcon width={14} height={14} />
            항목 추가
          </button>
        ) : (
          !isFormOpen && (
            <button
              className={addButtonStyle}
              onClick={() => setIsFormOpen(true)}
              data-tour={tourId === 'individual' ? 'template-individual-add' : undefined}
            >
              <PlusIcon width={14} height={14} />
              항목 추가
            </button>
          )
        )}
      </div>

      {isFormOpen && onAdd && (
        <AddItemForm
          onAdd={(label, type, choices) => {
            onAdd(label, type, choices)
            if (tourId === 'individual') reportTutorialAction('individual-added')
            setIsFormOpen(false)
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
