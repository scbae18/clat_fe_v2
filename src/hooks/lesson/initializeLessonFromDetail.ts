import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonDetail } from '@/services/lesson'
import type { Student } from '@/types/student'
import { itemRef } from '@/lib/lessonItemRef'

export function buildCommonValuesFromDetail(data: LessonDetail): Record<string, string> {
  const commonValues: Record<string, string> = {}
  data.common_data.forEach((item) => {
    const source = item.source ?? (item.adhoc_item_id != null ? 'adhoc' : 'template')
    const id = item.adhoc_item_id ?? item.template_item_id!
    commonValues[itemRef(source, id)] = item.value ?? ''
  })
  return commonValues
}

/** Map API lesson + class roster → student table rows (sorted by name). */
export function buildStudentsFromDetail(
  data: LessonDetail,
  classStudents: Student[],
): LessonStudent[] {
  const individualItems = data.items.filter(
    (i) => !i.is_common && i.item_type !== 'ATTENDANCE',
  )
  const attendanceItems = data.items.filter((i) => i.item_type === 'ATTENDANCE')

  const nameMap = new Map(classStudents.map((s) => [s.id, s.name]))
  const apiNameMap = new Map(
    data.student_data.map((sd) => [sd.student_id, sd.student_name ?? '']),
  )

  const baseStudentIds = classStudents.map((s) => s.id)

  const students: LessonStudent[] = baseStudentIds.map((studentId) => {
    const sd = data.student_data.find((row) => row.student_id === studentId)
    const sdItems = sd?.items ?? []

    const attendanceItem =
      attendanceItems.find((ai) => sdItems.some((si) => si.template_item_id === ai.id)) ??
      attendanceItems[0]

    const attendanceRaw = attendanceItem
      ? (sdItems.find((si) => si.template_item_id === attendanceItem.id)?.value ?? null)
      : null
    const attendance: LessonStudent['attendance'] =
      attendanceRaw === '출석' || attendanceRaw === '지각' || attendanceRaw === '결석'
        ? attendanceRaw
        : null

    return {
      id: studentId,
      name: nameMap.get(studentId) ?? apiNameMap.get(studentId) ?? '',
      attendance,
      items: individualItems.map((item) => {
        const existing = sdItems.find((si) => {
          const siSource = si.source ?? (si.adhoc_item_id != null ? 'adhoc' : 'template')
          const siId = si.adhoc_item_id ?? si.template_item_id!
          return (item.source ?? 'template') === siSource && item.id === siId
        })
        return {
          item_id: item.id,
          source: item.source ?? 'template',
          value: existing?.value ?? '',
          is_completed:
            typeof existing?.is_completed === 'boolean' ? existing.is_completed : null,
        }
      }),
    }
  })

  students.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  return students
}
