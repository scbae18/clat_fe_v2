import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail, StudentData, StudentDataItem, UpdateLessonBody } from '@/services/lesson'

/** 학생 + 템플릿 항목(칸) 단위 dirty 키 */
export function studentCellKey(studentId: number, templateItemId: number): string {
  return `${studentId}:${templateItemId}`
}

export function parseStudentCellKey(key: string): { studentId: number; templateItemId: number } {
  const sep = key.indexOf(':')
  return {
    studentId: Number(key.slice(0, sep)),
    templateItemId: Number(key.slice(sep + 1)),
  }
}

export function findChangedStudentCells(
  prev: LessonStudent[],
  next: LessonStudent[],
  attendanceItemId?: number,
): string[] {
  const prevMap = new Map(prev.map((s) => [s.id, s]))
  const keys: string[] = []

  for (const student of next) {
    const before = prevMap.get(student.id)

    if (!before) {
      if (attendanceItemId) keys.push(studentCellKey(student.id, attendanceItemId))
      for (const item of student.items) {
        keys.push(studentCellKey(student.id, item.template_item_id))
      }
      continue
    }

    if (before.attendance !== student.attendance && attendanceItemId) {
      keys.push(studentCellKey(student.id, attendanceItemId))
    }

    const beforeItems = new Map(before.items.map((i) => [i.template_item_id, i]))
    for (const item of student.items) {
      const prevItem = beforeItems.get(item.template_item_id)
      if (
        !prevItem ||
        prevItem.value !== item.value ||
        prevItem.is_completed !== item.is_completed
      ) {
        keys.push(studentCellKey(student.id, item.template_item_id))
      }
    }
  }

  return keys
}

function groupDirtyCellsByStudent(
  dirtyCells: Iterable<string>,
): Map<number, Set<number>> {
  const byStudent = new Map<number, Set<number>>()
  for (const key of dirtyCells) {
    const { studentId, templateItemId } = parseStudentCellKey(key)
    if (!byStudent.has(studentId)) byStudent.set(studentId, new Set())
    byStudent.get(studentId)!.add(templateItemId)
  }
  return byStudent
}

function buildItemsForDirtyCells(
  student: LessonStudent,
  dirtyItemIds: Set<number>,
  attendanceItemId?: number,
): StudentDataItem[] {
  const items: StudentDataItem[] = []

  for (const templateItemId of dirtyItemIds) {
    if (attendanceItemId && templateItemId === attendanceItemId) {
      items.push({
        template_item_id: templateItemId,
        value: String(student.attendance ?? ''),
        is_completed: false,
      })
      continue
    }

    const item = student.items.find((i) => i.template_item_id === templateItemId)
    if (!item) continue

    items.push({
      template_item_id: templateItemId,
      value: String(item.value ?? ''),
      is_completed: item.is_completed ?? undefined,
    })
  }

  return items
}

export function buildLessonUpdateBodyForTargets(params: {
  commonIds: number[]
  studentCells: string[]
  commonValues: Record<number, string>
  students: LessonStudent[]
  lessonItems: LessonItemDetail[]
  status?: 'DRAFT' | 'SAVED'
}): UpdateLessonBody | null {
  if (params.commonIds.length === 0 && params.studentCells.length === 0) return null

  const attendanceItem = params.lessonItems.find((i) => i.item_type === 'ATTENDANCE')
  const attendanceItemId = attendanceItem?.id
  const byStudent = groupDirtyCellsByStudent(params.studentCells)
  const studentMap = new Map(params.students.map((s) => [s.id, s]))

  const body: UpdateLessonBody = {}
  if (params.status) body.status = params.status

  if (params.commonIds.length > 0) {
    body.common_data = params.commonIds.map((id) => ({
      template_item_id: id,
      value: String(params.commonValues[id] ?? ''),
    }))
  }

  if (byStudent.size > 0) {
    body.student_data = []
    for (const [studentId, dirtyItemIds] of byStudent) {
      const student = studentMap.get(studentId)
      if (!student) continue
      const items = buildItemsForDirtyCells(student, dirtyItemIds, attendanceItemId)
      if (items.length === 0) continue
      body.student_data.push({ student_id: studentId, items })
    }
    if (body.student_data.length === 0) delete body.student_data
  }

  if (!body.common_data && !body.student_data) return null
  return body
}

export function buildPartialLessonUpdateBody(params: {
  dirtyCommonIds: Iterable<number>
  dirtyStudentCells: Iterable<string>
  commonValues: Record<number, string>
  students: LessonStudent[]
  lessonItems: LessonItemDetail[]
  status?: 'DRAFT' | 'SAVED'
}): UpdateLessonBody | null {
  return buildLessonUpdateBodyForTargets({
    commonIds: [...params.dirtyCommonIds],
    studentCells: [...params.dirtyStudentCells],
    commonValues: params.commonValues,
    students: params.students,
    lessonItems: params.lessonItems,
    status: params.status,
  })
}
