'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CommonSuggestionItem } from '@/types/commonSuggestion'
import { hasSuggestionContent } from '@/types/commonSuggestion'
import { lessonService } from '@/services/lesson'
import CommonSuggestionPopover from './CommonSuggestionPopover'
import {
  tableStyle,
  thStyle,
  tdStyle,
  inputStyle,
  inputCellWrapStyle,
  addRowButtonStyle,
  removeItemButtonStyle,
  nameInputInlineStyle,
} from './CommonContent.css'
import { itemRef, type ItemSource } from '@/lib/lessonItemRef'

interface CommonItem {
  id: number
  source: ItemSource
  label: string
}

interface CommonContentSectionProps {
  lessonId: number
  items: CommonItem[]
  values: Record<string, string>
  onChange: (ref: string, value: string) => void
  onAddCommon?: (name: string) => void | Promise<void>
  onRemoveItem?: (item: CommonItem) => void
}

export default function CommonContent({
  lessonId,
  items,
  values,
  onChange,
  onAddCommon,
  onRemoveItem,
}: CommonContentSectionProps) {
  const [suggestions, setSuggestions] = useState<CommonSuggestionItem[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!lessonId) {
      setSuggestions([])
      return
    }
    let cancelled = false
    lessonService
      .getCommonSuggestions(lessonId)
      .then((res) => {
        if (!cancelled) setSuggestions(res.items)
      })
      .catch(() => {
        if (!cancelled) setSuggestions([])
      })
    return () => {
      cancelled = true
    }
  }, [lessonId])

  const suggestionByItemId = useMemo(() => {
    const m = new Map<number, CommonSuggestionItem>()
    for (const s of suggestions) {
      m.set(s.template_item_id, s)
    }
    return m
  }, [suggestions])

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setFocusedId(null)
      }
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  const applyValue = useCallback(
    (itemRefKey: string, value: string) => {
      onChange(itemRefKey, value)
      setFocusedId(null)
    },
    [onChange],
  )

  const submitNewCommon = async () => {
    const trimmed = newName.trim()
    if (!trimmed || !onAddCommon) return
    await onAddCommon(trimmed)
    setNewName('')
    setIsAdding(false)
  }

  return (
    <div ref={wrapRef}>
      <table className={tableStyle}>
        <tbody>
          {items.map((item) => {
            const refKey = itemRef(item.source, item.id)
            const current = values[refKey] ?? ''
            const isEmpty = !current.trim()
            const suggestion =
              item.source === 'template' ? suggestionByItemId.get(item.id) : undefined
            const showPopover =
              focusedId === refKey && isEmpty && suggestion && hasSuggestionContent(suggestion)

            return (
              <tr key={refKey}>
                <th className={thStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{item.label}</span>
                    {onRemoveItem ? (
                      <button
                        type="button"
                        className={removeItemButtonStyle}
                        aria-label={`${item.label} 항목 제거`}
                        onClick={() => onRemoveItem(item)}
                      >
                        ×
                      </button>
                    ) : null}
                  </div>
                </th>
                <td className={tdStyle}>
                  <div className={inputCellWrapStyle}>
                    <textarea
                      className={inputStyle}
                      value={current}
                      onChange={(e) => onChange(refKey, e.target.value)}
                      onFocus={() => setFocusedId(refKey)}
                      placeholder="내용을 입력해주세요"
                    />
                    {showPopover && suggestion ? (
                      <CommonSuggestionPopover
                        suggestion={suggestion}
                        onApplyLastClass={(value) => applyValue(refKey, value)}
                        onApplySuggestion={(value) => applyValue(refKey, value)}
                      />
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
          {isAdding ? (
            <tr>
              <th className={thStyle}>
                <input
                  className={nameInputInlineStyle}
                  value={newName}
                  maxLength={10}
                  placeholder="항목 이름"
                  autoFocus
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void submitNewCommon()
                    if (e.key === 'Escape') {
                      setIsAdding(false)
                      setNewName('')
                    }
                  }}
                  onBlur={() => {
                    if (newName.trim()) void submitNewCommon()
                    else setIsAdding(false)
                  }}
                />
              </th>
              <td className={tdStyle} />
            </tr>
          ) : null}
        </tbody>
      </table>
      {onAddCommon ? (
        <button type="button" className={addRowButtonStyle} onClick={() => setIsAdding(true)}>
          + 항목 추가
        </button>
      ) : null}
    </div>
  )
}
