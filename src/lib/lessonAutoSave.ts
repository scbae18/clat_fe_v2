import type { LessonItemDetail } from '@/services/lesson'

/** 텍스트·숫자 입력 후 자동 저장 대기 시간 */
export const TEXT_INPUT_DEBOUNCE_MS = 800

const IMMEDIATE_SAVE_TYPES = new Set<LessonItemDetail['item_type']>([
  'ATTENDANCE',
  'SELECT',
  'COMPLETE',
])

export function isImmediateSaveItemType(itemType: LessonItemDetail['item_type'] | undefined): boolean {
  if (!itemType) return false
  return IMMEDIATE_SAVE_TYPES.has(itemType)
}

export function getLessonItemType(
  items: LessonItemDetail[],
  templateItemId: number,
): LessonItemDetail['item_type'] | undefined {
  return items.find((i) => i.id === templateItemId)?.item_type
}
