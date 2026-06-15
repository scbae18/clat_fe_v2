export type CommonSuggestionMode = 'literal' | 'pattern' | 'none'



export interface CommonSuggestionItem {

  template_item_id: number

  item_name: string

  mode: CommonSuggestionMode

  suggested_value?: string

  pattern_template?: string

  pattern_example?: string

  source_label?: string

  source_lesson_date?: string

  last_class_value?: string

  last_class_source_label?: string

  last_class_lesson_date?: string

}



export interface CommonSuggestionsResponse {

  items: CommonSuggestionItem[]

}



export function hasSuggestionContent(item: CommonSuggestionItem): boolean {

  if (item.last_class_value?.trim()) return true

  if (item.mode === 'literal' && item.suggested_value?.trim()) return true

  if (item.mode === 'pattern' && item.pattern_template?.trim()) return true

  return false

}



export function getSuggestionApplyValue(item: CommonSuggestionItem): string | null {

  if (item.mode === 'literal' && item.suggested_value?.trim()) {

    return item.suggested_value

  }

  if (item.mode === 'pattern') {
    return item.pattern_template?.trim() || null
  }

  return null

}



export function normalizeSuggestionText(value: string): string {

  return value.replace(/\s+/g, ' ').trim()

}



export function isSameSuggestionText(a: string, b: string): boolean {
  return normalizeSuggestionText(a) === normalizeSuggestionText(b)
}

/** 이 반 지난번과 literal/pattern 제안 내용이 겹치면 AI 제안 우선 */
export function overlapsWithAnalysisSuggestion(
  lastClassValue: string,
  item: CommonSuggestionItem,
): boolean {
  if (item.mode === 'literal' && item.suggested_value?.trim()) {
    return isSameSuggestionText(lastClassValue, item.suggested_value)
  }
  if (item.mode === 'pattern') {
    const example = item.pattern_example?.trim()
    const template = item.pattern_template?.trim()
    if (example && isSameSuggestionText(lastClassValue, example)) return true
    if (template && isSameSuggestionText(lastClassValue, template)) return true
  }
  return false
}

