/** 학생 이름 가나다순 (한국어 locale) */
export function sortStudentsByNameKo<T extends { name: string }>(students: T[]): T[] {
  return [...students].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}
