import type { ItemSource } from '@/lib/lessonItemRef'

export type Attendance = '출석' | '지각' | '결석' | null
export type CompletionStatus = '완료' | '미완료' | null

export interface LessonStudentItem {
  item_id: number
  source: ItemSource
  value: string
  is_completed?: boolean | null
}

export interface LessonStudent {
  id: number
  name: string
  attendance: Attendance
  items: LessonStudentItem[]
}
