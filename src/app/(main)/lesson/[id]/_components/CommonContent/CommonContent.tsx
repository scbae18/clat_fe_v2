'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CommonSuggestionItem } from '@/types/commonSuggestion'
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

  const applySuggestion = useCallback(
    (itemId: number, suggestion: CommonSuggestionItem) => {
      if (suggestion.mode === 'literal' && suggestion.suggested_value) {
        onChange(itemId, suggestion.suggested_value)
      } else if (suggestion.mode === 'pattern' && suggestion.pattern_template) {
        onChange(itemId, suggestion.pattern_template)
      }
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
              suggestion.mode !== 'none'

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
                        onApply={() => applySuggestion(item.id, suggestion)}
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
