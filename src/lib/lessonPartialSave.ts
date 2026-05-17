import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail, StudentData, StudentDataItem, UpdateLessonBody } from '@/services/lesson'

export function findChangedStudentIds(prev: LessonStudent[], next: LessonStudent[]): number[] {
  const prevMap = new Map(prev.map((s) => [s.id, s]))
  const changed: number[] = []

  for (const student of next) {
    const before = prevMap.get(student.id)
    if (!before) {
      changed.push(student.id)
      continue
    }
    if (before.attendance !== student.attendance) {
      changed.push(student.id)
      continue
    }
    if (before.items.length !== student.items.length) {
      changed.push(student.id)
      continue
    }
    let itemChanged = false
    for (let i = 0; i < student.items.length; i++) {
      const a = before.items[i]
      const b = student.items[i]
      if (
        a.template_item_id !== b.template_item_id ||
        a.value !== b.value ||
        a.is_completed !== b.is_completed
      ) {
        itemChanged = true
        break
      }
    }
    if (itemChanged) changed.push(student.id)
  }

  return changed
}

function buildStudentItems(
  student: LessonStudent,
  attendanceItem: LessonItemDetail | undefined,
): StudentDataItem[] {
  return [
    ...(attendanceItem
      ? [
          {
            template_item_id: attendanceItem.id,
            value: String(student.attendance ?? ''),
            is_completed: false as const,
          },
        ]
      : []),
    ...student.items.map((item) => ({
      template_item_id: item.template_item_id,
      value: String(item.value ?? ''),
      is_completed: item.is_completed ?? undefined,
    })),
  ]
}

export function buildPartialLessonUpdateBody(params: {
  dirtyCommonIds: Iterable<number>
  dirtyStudentIds: Iterable<number>
  commonValues: Record<number, string>
  students: LessonStudent[]
  lessonItems: LessonItemDetail[]
  status?: 'DRAFT' | 'SAVED'
}): UpdateLessonBody | null {
  const dirtyCommon = [...params.dirtyCommonIds]
  const dirtyStudents = [...params.dirtyStudentIds]
  if (dirtyCommon.length === 0 && dirtyStudents.length === 0) return null

  const attendanceItem = params.lessonItems.find((i) => i.item_type === 'ATTENDANCE')
  const dirtyStudentSet = new Set(dirtyStudents)

  const body: UpdateLessonBody = {}
  if (params.status) body.status = params.status

  if (dirtyCommon.length > 0) {
    body.common_data = dirtyCommon.map((id) => ({
      template_item_id: id,
      value: String(params.commonValues[id] ?? ''),
    }))
  }

  if (dirtyStudents.length > 0) {
    body.student_data = params.students
      .filter((s) => dirtyStudentSet.has(s.id))
      .map(
        (s): StudentData => ({
          student_id: s.id,
          items: buildStudentItems(s, attendanceItem),
        }),
      )
  }

  return body
}
