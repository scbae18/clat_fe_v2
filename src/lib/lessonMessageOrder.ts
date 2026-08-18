import type { TemplateItem } from '@/app/(main)/template/_types/template'
import type { LessonItemDetail } from '@/services/lesson'
import { lessonItemRef } from '@/lib/lessonItemRef'

function mapLessonItemType(item: LessonItemDetail): TemplateItem['itemType'] {
  switch (item.item_type) {
    case 'SCORE':
    case 'NUMBER':
      return 'number'
    case 'SELECT':
      return 'choice'
    case 'COMPLETE':
      return 'completion'
    case 'ATTENDANCE':
      return 'attendance'
    default:
      return 'text'
  }
}

export function lessonItemToTemplateItem(item: LessonItemDetail): TemplateItem {
  const source = item.source ?? 'template'
  return {
    id: lessonItemRef(item),
    label: item.name,
    isActive: true,
    isInMessage: item.include_in_message || source === 'adhoc',
    sendToParent: item.send_to_parent !== false,
    sendToStudent: item.send_to_student !== false,
    locked: item.item_type === 'ATTENDANCE' || source === 'adhoc',
    category: item.is_common ? 'common' : 'individual',
    itemType: mapLessonItemType(item),
    choices: item.options?.map((o) => o.label),
  }
}

export function buildLessonMessageOrderState(items: LessonItemDetail[]) {
  const sorted = [...items].sort((a, b) => a.sort_order - b.sort_order)
  const messageOrder = sorted.map((item) => lessonItemRef(item))
  const allItemsMap = new Map<string, TemplateItem>()
  for (const item of sorted) {
    allItemsMap.set(lessonItemRef(item), lessonItemToTemplateItem(item))
  }
  return { messageOrder, allItemsMap }
}

export function messageOrderToApiItems(messageOrder: string[]) {
  return messageOrder.map((ref) => {
    const sep = ref.indexOf(':')
    return {
      source: ref.slice(0, sep) as 'template' | 'adhoc',
      id: Number(ref.slice(sep + 1)),
    }
  })
}
