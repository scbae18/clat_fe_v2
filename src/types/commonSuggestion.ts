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
}

export interface CommonSuggestionsResponse {
  items: CommonSuggestionItem[]
}
