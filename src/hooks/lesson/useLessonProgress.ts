import { useMemo } from 'react'

import type { LessonStudent } from '@/types/lessonStudent'
import type { LessonItemDetail } from '@/services/lesson'
import { computeLessonInputProgress } from '@/lib/lessonProgress'

export function useLessonProgress(students: LessonStudent[], items?: LessonItemDetail[]) {
  return useMemo(() => computeLessonInputProgress(students, items), [students, items])
}
