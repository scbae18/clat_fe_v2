import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import { itemRef } from '@/lib/lessonItemRef'

export function canMarkLessonItemPartial(
  item: Pick<LessonItemDetail, 'is_common' | 'item_type'>,
): boolean {
  if (item.is_common) return false
  if (item.item_type === 'ATTENDANCE' || item.item_type === 'COMPLETE') return false
  return true
}

function partialRefsFromItems(items?: LessonItemDetail[]): Set<string> | undefined {
  if (!items) return undefined
  const refs = new Set<string>()
  for (const item of items) {
    if (item.is_partial) refs.add(itemRef(item.source ?? 'template', item.id))
  }
  return refs
}

/** 수업 입력 진행도 — 입력 화면 하단 ProgressBar와 동일 규칙. 일부만 항목은 분모에서 제외. */
export function isLessonStudentInputComplete(
  student: LessonStudent,
  partialRefs?: Set<string>,
): boolean {
  if (student.attendance === null) return false
  return student.items.every((item) => {
    if (partialRefs?.has(itemRef(item.source, item.item_id))) return true
    if (item.is_completed !== null && item.is_completed !== undefined) return true
    return item.value.trim() !== ''
  })
}

export function computeLessonInputProgress(
  students: LessonStudent[],
  items?: LessonItemDetail[],
): {
  inputCount: number
  totalStudents: number
  progressRate: number
} {
  const partialRefs = partialRefsFromItems(items)
  const totalStudents = students.length
  const inputCount = students.filter((s) => isLessonStudentInputComplete(s, partialRefs)).length
  const progressRate =
    totalStudents === 0 ? 0 : Math.round((inputCount / totalStudents) * 100) / 100
  return { inputCount, totalStudents, progressRate }
}
