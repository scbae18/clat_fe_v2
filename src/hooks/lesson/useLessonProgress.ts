import { useMemo } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import { computeLessonInputProgress } from '@/lib/lessonProgress'

export function useLessonProgress(students: LessonStudent[]) {
  return useMemo(() => computeLessonInputProgress(students), [students])
}
