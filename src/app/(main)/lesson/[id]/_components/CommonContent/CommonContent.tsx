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
} from './CommonContent.css'

interface CommonItem {
  id: number
  label: string
}

interface CommonContentSectionProps {
  lessonId: number
  isAdhoc: boolean
  items: CommonItem[]
  values: Record<number, string>
  onChange: (id: number, value: string) => void
}

export default function CommonContent({
  lessonId,
  items,
  values,
  onChange,
}: CommonContentSectionProps) {
  const [suggestions, setSuggestions] = useState<CommonSuggestionItem[]>([])
  const [focusedId, setFocusedId] = useState<number | null>(null)
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
    (itemId: number, value: string) => {
      onChange(itemId, value)
      setFocusedId(null)
    },
    [onChange],
  )

  return (
    <div ref={wrapRef}>
      <table className={tableStyle}>
        <tbody>
          {items.map((item) => {
            const current = values[item.id] ?? ''
            const isEmpty = !current.trim()
            const suggestion = suggestionByItemId.get(item.id)
            const showPopover =
              focusedId === item.id &&
              isEmpty &&
              suggestion &&
              hasSuggestionContent(suggestion)

            return (
              <tr key={item.id}>
                <th className={thStyle}>{item.label}</th>
                <td className={tdStyle}>
                  <div className={inputCellWrapStyle}>
                    <textarea
                      className={inputStyle}
                      value={current}
                      onChange={(e) => onChange(item.id, e.target.value)}
                      onFocus={() => setFocusedId(item.id)}
                      placeholder="내용을 입력해주세요"
                    />
                    {showPopover && suggestion ? (
                      <CommonSuggestionPopover
                        suggestion={suggestion}
                        onApplyLastClass={(value) => applyValue(item.id, value)}
                        onApplySuggestion={(value) => applyValue(item.id, value)}
                      />
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
