import type { LessonStudent } from '@/types/lessonStudent'

/** 수업 입력 진행도 — 입력 화면 하단 ProgressBar와 동일 규칙 */
export function isLessonStudentInputComplete(student: LessonStudent): boolean {
  if (student.attendance === null) return false
  return student.items.every((item) => {
    if (item.is_completed !== null && item.is_completed !== undefined) return true
    return item.value.trim() !== ''
  })
}

export function computeLessonInputProgress(students: LessonStudent[]): {
  inputCount: number
  totalStudents: number
  progressRate: number
} {
  const totalStudents = students.length
  const inputCount = students.filter(isLessonStudentInputComplete).length
  const progressRate =
    totalStudents === 0 ? 0 : Math.round((inputCount / totalStudents) * 100) / 100
  return { inputCount, totalStudents, progressRate }
}
