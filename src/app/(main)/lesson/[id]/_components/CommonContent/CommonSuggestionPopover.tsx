'use client'

import type { CommonSuggestionItem } from '@/types/commonSuggestion'
import {
  popoverStyle,
  popoverTitleStyle,
  popoverAiLabelStyle,
  popoverSourceStyle,
  popoverPreviewStyle,
  popoverExampleStyle,
  popoverActionsStyle,
  applyButtonStyle,
} from './CommonSuggestionPopover.css'

interface CommonSuggestionPopoverProps {
  suggestion: CommonSuggestionItem
  onApply: () => void
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2zM5 16l.8 2.6L8.4 19.4 5.8 20.2 5 23l-.8-2.8L1.6 19.4 4.2 18.6 5 16zm14 0l.8 2.6 2.6.8-2.6.8-.8 2.8-.8-2.8-2.6-.8 2.6-.8.8-2.6z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function CommonSuggestionPopover({
  suggestion,
  onApply,
}: CommonSuggestionPopoverProps) {
  if (suggestion.mode === 'none') return null

  const isLiteral = suggestion.mode === 'literal'
  const preview = isLiteral
    ? suggestion.suggested_value
    : suggestion.pattern_template

  if (!preview?.trim()) return null

  return (
    <div
      className={popoverStyle}
      role="dialog"
      aria-label="입력 제안"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className={popoverTitleStyle}>
        <SparkleIcon />
        <span>{isLiteral ? '지난 내용' : '자주 쓰는 형식'}</span>
        <span className={popoverAiLabelStyle}>AI 조교</span>
      </div>
      {suggestion.source_label ? (
        <p className={popoverSourceStyle}>{suggestion.source_label}</p>
      ) : null}
      <div className={popoverPreviewStyle}>{preview}</div>
      {!isLiteral && suggestion.pattern_example ? (
        <p className={popoverExampleStyle}>
          예: {suggestion.pattern_example}
        </p>
      ) : null}
      <div className={popoverActionsStyle}>
        <button type="button" className={applyButtonStyle} onClick={onApply}>
          {isLiteral ? '이걸로 채우기' : '형식 넣기'}
        </button>
      </div>
    </div>
  )
}
