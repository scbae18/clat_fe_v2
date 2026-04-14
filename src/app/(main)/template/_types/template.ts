export type ItemCategory = 'common' | 'individual'
export type ItemType = 'number' | 'text' | 'choice' | 'completion' | 'inline' | 'attendance'

export interface TemplateItem {
  id: string
  label: string
  isActive: boolean // 왼쪽 섹션 체크 여부 → MessageSettings 표시 여부
  isInMessage: boolean // MessageSettings 토글 → 미리보기 포함 여부
  locked?: boolean
  category: ItemCategory
  itemType: ItemType
  choices?: string[]
}
