import type { LessonItemDetail } from '@/services/lesson'
import { lessonItemRef } from '@/lib/lessonItemRef'

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
  source: 'template' | 'adhoc',
  itemId: number,
): LessonItemDetail['item_type'] | undefined {
  return items.find((i) => (i.source ?? 'template') === source && i.id === itemId)?.item_type
}

export function getLessonItemTypeByRef(
  items: LessonItemDetail[],
  ref: string,
): LessonItemDetail['item_type'] | undefined {
  const item = items.find((i) => lessonItemRef(i) === ref)
  return item?.item_type
}
