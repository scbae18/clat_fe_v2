export type Attendance = '출석' | '지각' | '결석' | null
export type CompletionStatus = '완료' | '미완료' | null

export interface LessonStudentItem {
  template_item_id: number
  value: string
  is_completed?: boolean | null
}

export interface LessonStudent {
  id: number
  name: string
  attendance: Attendance  // 고정
  items: LessonStudentItem[]  // 동적 아이템
}