import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail, StudentData, StudentDataItem, UpdateLessonBody } from '@/services/lesson'
import {
  itemRef,
  parseStudentCellKey,
  studentCellKey,
  type ItemSource,
} from '@/lib/lessonItemRef'

export { studentCellKey, parseStudentCellKey }

export function findChangedStudentCells(
  prev: LessonStudent[],
  next: LessonStudent[],
  attendanceItem?: Pick<LessonItemDetail, 'id' | 'source'>,
): string[] {
  const prevMap = new Map(prev.map((s) => [s.id, s]))
  const keys: string[] = []
  const attSource = attendanceItem?.source ?? 'template'
  const attendanceItemId = attendanceItem?.id

  for (const student of next) {
    const before = prevMap.get(student.id)

    if (!before) {
      if (attendanceItemId) keys.push(studentCellKey(student.id, attSource, attendanceItemId))
      for (const item of student.items) {
        keys.push(studentCellKey(student.id, item.source, item.item_id))
      }
      continue
    }

    if (before.attendance !== student.attendance && attendanceItemId) {
      keys.push(studentCellKey(student.id, attSource, attendanceItemId))
    }

    const beforeItems = new Map(
      before.items.map((i) => [`${i.source}:${i.item_id}`, i] as const),
    )
    for (const item of student.items) {
      const prevItem = beforeItems.get(`${item.source}:${item.item_id}`)
      if (
        !prevItem ||
        prevItem.value !== item.value ||
        prevItem.is_completed !== item.is_completed
      ) {
        keys.push(studentCellKey(student.id, item.source, item.item_id))
      }
    }
  }

  return keys
}

function groupDirtyCellsByStudent(
  dirtyCells: Iterable<string>,
): Map<number, Set<string>> {
  const byStudent = new Map<number, Set<string>>()
  for (const key of dirtyCells) {
    const { studentId, source, itemId } = parseStudentCellKey(key)
    const itemKey = itemRef(source, itemId)
    if (!byStudent.has(studentId)) byStudent.set(studentId, new Set())
    byStudent.get(studentId)!.add(itemKey)
  }
  return byStudent
}

function toStudentDataItem(
  source: ItemSource,
  itemId: number,
  value: string,
  is_completed?: boolean | null,
): StudentDataItem {
  if (source === 'adhoc') {
    return {
      adhoc_item_id: itemId,
      value,
      ...(is_completed !== undefined ? { is_completed } : {}),
    }
  }
  return {
    template_item_id: itemId,
    value,
    ...(is_completed !== undefined ? { is_completed } : {}),
  }
}

function buildItemsForDirtyCells(
  student: LessonStudent,
  dirtyItemRefs: Set<string>,
  attendanceItem?: Pick<LessonItemDetail, 'id' | 'source'>,
): StudentDataItem[] {
  const items: StudentDataItem[] = []
  const attSource = attendanceItem?.source ?? 'template'
  const attendanceItemId = attendanceItem?.id

  for (const ref of dirtyItemRefs) {
    const sep = ref.indexOf(':')
    const source = ref.slice(0, sep) as ItemSource
    const itemId = Number(ref.slice(sep + 1))

    if (attendanceItemId && source === attSource && itemId === attendanceItemId) {
      items.push(
        toStudentDataItem(source, itemId, String(student.attendance ?? ''), false),
      )
      continue
    }

    const item = student.items.find((i) => i.source === source && i.item_id === itemId)
    if (!item) continue

    items.push(
      toStudentDataItem(source, itemId, String(item.value ?? ''), item.is_completed),
    )
  }

  return items
}

export function buildLessonUpdateBodyForTargets(params: {
  commonIds: string[]
  studentCells: string[]
  commonValues: Record<string, string>
  students: LessonStudent[]
  lessonItems: LessonItemDetail[]
  status?: 'DRAFT' | 'SAVED'
}): UpdateLessonBody | null {
  if (params.commonIds.length === 0 && params.studentCells.length === 0) return null

  const attendanceItem = params.lessonItems.find((i) => i.item_type === 'ATTENDANCE')
  const byStudent = groupDirtyCellsByStudent(params.studentCells)
  const studentMap = new Map(params.students.map((s) => [s.id, s]))

  const body: UpdateLessonBody = {}
  if (params.status) body.status = params.status

  if (params.commonIds.length > 0) {
    body.common_data = params.commonIds.map((ref) => {
      const sep = ref.indexOf(':')
      const source = ref.slice(0, sep) as ItemSource
      const id = Number(ref.slice(sep + 1))
      const value = String(params.commonValues[ref] ?? '')
      if (source === 'adhoc') {
        return { adhoc_item_id: id, value }
      }
      return { template_item_id: id, value }
    })
  }

  if (byStudent.size > 0) {
    body.student_data = []
    for (const [studentId, dirtyItemRefs] of byStudent) {
      const student = studentMap.get(studentId)
      if (!student) continue
      const items = buildItemsForDirtyCells(student, dirtyItemRefs, attendanceItem)
      if (items.length === 0) continue
      body.student_data.push({ student_id: studentId, items })
    }
    if (body.student_data.length === 0) delete body.student_data
  }

  if (!body.common_data && !body.student_data) return null
  return body
}

export function buildPartialLessonUpdateBody(params: {
  dirtyCommonIds: Iterable<string>
  dirtyStudentCells: Iterable<string>
  commonValues: Record<string, string>
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
