export type StudentSortKey = 'name' | 'school' | 'grade'

type SortableStudent = {
  name: string
  school_name?: string
  grade?: string
}

const GRADE_RANK: Record<string, number> = {
  '1학년': 1,
  '2학년': 2,
  '3학년': 3,
  '4학년': 4,
  '5학년': 5,
  '6학년': 6,
}

function compareName(a: string, b: string): number {
  return a.localeCompare(b, 'ko')
}

function schoolKey(school: string | undefined): string {
  const value = school?.trim() ?? ''
  if (!value || value === '-') return ''
  return value
}

/** 학생 이름 가나다순 (한국어 locale) */
export function sortStudentsByNameKo<T extends { name: string }>(students: T[]): T[] {
  return [...students].sort((a, b) => compareName(a.name, b.name))
}

/** 이름·학교 가나다순, 학년은 1학년→6학년. 같은 값이면 이름으로 가른다. */
export function sortStudents<T extends SortableStudent>(
  students: T[],
  key: StudentSortKey,
): T[] {
  return [...students].sort((a, b) => {
    if (key === 'school') {
      const left = schoolKey(a.school_name)
      const right = schoolKey(b.school_name)
      if (!left && right) return 1
      if (left && !right) return -1
      if (left && right) {
        const bySchool = left.localeCompare(right, 'ko')
        if (bySchool !== 0) return bySchool
      }
    }
    if (key === 'grade') {
      const left = GRADE_RANK[a.grade?.trim() ?? ''] ?? 99
      const right = GRADE_RANK[b.grade?.trim() ?? ''] ?? 99
      if (left !== right) return left - right
    }
    return compareName(a.name, b.name)
  })
}
