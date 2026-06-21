import type { IncompleteItem } from '@/types/student'

export function incompleteItemKey(item: IncompleteItem): string {
  const source = item.source ?? 'template'
  const id =
    source === 'adhoc' ? item.lesson_adhoc_student_data_id : item.lesson_student_data_id
  return `${source}:${id}`
}

export function incompleteItemCompleteTarget(item: IncompleteItem): {
  id: number
  source: 'template' | 'adhoc'
} {
  if (item.source === 'adhoc' || item.lesson_adhoc_student_data_id != null) {
    return { id: item.lesson_adhoc_student_data_id!, source: 'adhoc' }
  }
  return { id: item.lesson_student_data_id!, source: 'template' }
}
