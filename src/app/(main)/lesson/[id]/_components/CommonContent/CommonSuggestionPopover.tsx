'use client'

import type { CommonSuggestionItem } from '@/types/commonSuggestion'
import {
  getSuggestionApplyValue,
  overlapsWithAnalysisSuggestion,
} from '@/types/commonSuggestion'
import {
  popoverStyle,
  popoverHeaderStyle,
  popoverHeaderTitleStyle,
  popoverHeaderHintStyle,
  optionListStyle,
  optionCardStyle,
  optionCardTopStyle,
  optionBadgeGroupStyle,
  optionBadgeLastClassStyle,
  optionBadgeAiStyle,
  optionAiAssistantBadgeStyle,
  optionMetaStyle,
  optionPreviewStyle,
  optionSubPreviewStyle,
  optionFooterStyle,
} from './CommonSuggestionPopover.css'

function SparkleIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4L12 2zM5 16l.8 2.6L8.4 19.4 5.8 20.2 5 23l-.8-2.8L1.6 19.4 4.2 18.6 5 16zm14 0l.8 2.6 2.6.8-2.6.8-.8 2.8-.8-2.8-2.6-.8 2.6-.8.8-2.6z"
        fill="currentColor"
      />
    </svg>
  )
}

interface CommonSuggestionPopoverProps {
  suggestion: CommonSuggestionItem
  onApplyLastClass: (value: string) => void
  onApplySuggestion: (value: string) => void
}

interface SuggestionOption {
  id: string
  badge: string
  badgeVariant: 'lastClass' | 'ai'
  showAiAssistant?: boolean
  meta?: string
  preview: string
  subPreview?: string
  applyLabel: string
  onApply: () => void
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function buildOptions(
  suggestion: CommonSuggestionItem,
  onApplyLastClass: (value: string) => void,
  onApplySuggestion: (value: string) => void,
): SuggestionOption[] {
  const options: SuggestionOption[] = []

  const lastClassValue = suggestion.last_class_value?.trim()
  const suggestionValue = getSuggestionApplyValue(suggestion)
  const isLiteral = suggestion.mode === 'literal'
  const isPattern = suggestion.mode === 'pattern'
  const patternTemplate = suggestion.pattern_template?.trim()
  const patternExample = suggestion.pattern_example?.trim()

  const overlaps =
    lastClassValue != null &&
    suggestion.mode !== 'none' &&
    overlapsWithAnalysisSuggestion(lastClassValue, suggestion)

  const analysisOption: SuggestionOption | null =
    suggestion.mode !== 'none' && suggestionValue
      ? {
          id: 'analysis',
          badge: isLiteral ? '내용 추천' : '자주 쓰는 형식',
          badgeVariant: 'ai',
          showAiAssistant: true,
          meta: suggestion.source_label,
          preview: isLiteral
            ? suggestion.suggested_value!
            : patternTemplate ?? suggestionValue,
          subPreview:
            isPattern && patternExample ? `예: ${patternExample}` : undefined,
          applyLabel: isLiteral ? '추천 내용 넣기' : '형식 넣기',
          onApply: () => onApplySuggestion(suggestionValue),
        }
      : null

  if (analysisOption && overlaps) {
    options.push(analysisOption)
    return options
  }

  if (lastClassValue) {
    options.push({
      id: 'last-class',
      badge: '지난번 입력',
      badgeVariant: 'lastClass',
      meta: suggestion.last_class_source_label,
      preview: lastClassValue,
      applyLabel: '지난번 내용 넣기',
      onApply: () => onApplyLastClass(lastClassValue),
    })
  }

  if (analysisOption) {
    options.push(analysisOption)
  }

  return options
}

export default function CommonSuggestionPopover({
  suggestion,
  onApplyLastClass,
  onApplySuggestion,
}: CommonSuggestionPopoverProps) {
  const options = buildOptions(suggestion, onApplyLastClass, onApplySuggestion)

  if (options.length === 0) return null

  return (
    <div
      className={popoverStyle}
      role="listbox"
      aria-label="빠른 입력 제안"
      onMouseDown={(e) => e.preventDefault()}
    >
      <header className={popoverHeaderStyle}>
        <p className={popoverHeaderTitleStyle}>
          <SparkleIcon size={15} />
          <span>빠른 입력</span>
        </p>
        <p className={popoverHeaderHintStyle}>원하는 항목을 누르면 바로 채워집니다</p>
      </header>

      <div className={optionListStyle}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            role="option"
            className={optionCardStyle}
            onClick={option.onApply}
          >
            <div className={optionCardTopStyle}>
              <div className={optionBadgeGroupStyle}>
                <span
                  className={
                    option.badgeVariant === 'ai'
                      ? optionBadgeAiStyle
                      : optionBadgeLastClassStyle
                  }
                >
                  {option.badge}
                </span>
                {option.showAiAssistant ? (
                  <span className={optionAiAssistantBadgeStyle}>
                    <SparkleIcon size={12} />
                    AI 조교
                  </span>
                ) : null}
              </div>
              {option.meta ? (
                <span className={optionMetaStyle}>{option.meta}</span>
              ) : null}
            </div>
            <p className={optionPreviewStyle}>{option.preview}</p>
            {option.subPreview ? (
              <p className={optionSubPreviewStyle}>{option.subPreview}</p>
            ) : null}
            <div className={optionFooterStyle}>
              <span>{option.applyLabel}</span>
              <ChevronRightIcon />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
