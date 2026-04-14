'use client'

import { useState } from 'react'
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
}: ContentSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingValue, setEditingValue] = useState('')

  const handleInlineAdd = () => {
    if (!onAddInline) return
    const newId = onAddInline()
    setEditingId(newId)
    setEditingValue('')
  }

  const confirmEdit = (id: string) => {
    const trimmed = editingValue.trim()
    if (trimmed === '') {
      onDelete(id)
    } else {
      onUpdate?.(id, trimmed)
    }
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
    <div className={sectionStyle}>
      <div className={sectionHeaderStyle}>
        <Text variant="headingMd">{title}</Text>
        <Text variant="bodyMd" color="gray500">{description}</Text>
      </div>
      <div className={itemListStyle}>
        {items.map((item) => {
          const state = item.isActive ? 'active' : 'inactive'
          return (
            <div key={item.id} className={itemVariants[state]}>
              {item.id === editingId ? (
                <input
                  className={itemInputVariants[state]}
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => confirmEdit(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  autoFocus
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
          <button className={addButtonStyle} onClick={handleInlineAdd}>
            <PlusIcon width={14} height={14} />
            항목 추가
          </button>
        ) : (
          !isFormOpen && (
            <button className={addButtonStyle} onClick={() => setIsFormOpen(true)}>
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
            setIsFormOpen(false)
          }}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
