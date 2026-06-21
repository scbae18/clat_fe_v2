import type { LessonItemDetail } from '@/services/lesson'

export type ItemSource = 'template' | 'adhoc'

export function itemRef(source: ItemSource, id: number): string {
  return `${source}:${id}`
}

export function parseItemRef(ref: string): { source: ItemSource; id: number } {
  const sep = ref.indexOf(':')
  return {
    source: ref.slice(0, sep) as ItemSource,
    id: Number(ref.slice(sep + 1)),
  }
}

export function lessonItemRef(item: Pick<LessonItemDetail, 'id' | 'source'>): string {
  return itemRef(item.source ?? 'template', item.id)
}

export function studentCellKey(studentId: number, source: ItemSource, itemId: number): string {
  return `${studentId}:${source}:${itemId}`
}

export function parseStudentCellKey(key: string): {
  studentId: number
  source: ItemSource
  itemId: number
} {
  const first = key.indexOf(':')
  const second = key.indexOf(':', first + 1)
  return {
    studentId: Number(key.slice(0, first)),
    source: key.slice(first + 1, second) as ItemSource,
    itemId: Number(key.slice(second + 1)),
  }
}

export function matchesLessonItem(
  studentItem: { item_id: number; source: ItemSource },
  lessonItem: Pick<LessonItemDetail, 'id' | 'source'>,
): boolean {
  const source = lessonItem.source ?? 'template'
  return studentItem.item_id === lessonItem.id && studentItem.source === source
}
