export interface StudentClass {
  id: number
  name: string
  academy_name?: string
}

export interface StudentStats {
  total_complete_items: number
  total_incomplete_items: number
  completion_rate: number
  monthly_completion_rate?: number
  monthly_attendance_rate?: number
  recent_scores?: unknown[]
}

export interface Student {
  id: number
  name: string
  phone: string
  parent_phone: string
  school_name?: string
  memo?: string
  classes: StudentClass[]
  completion_rate: number
  total_incomplete_items: number
}

export interface IncompleteItem {
  lesson_student_data_id: number
  item_name: string
  lesson_date: string
  class_name: string
  template_name: string
}

export interface StudentDetail {
  id: number
  name: string
  phone: string
  parent_phone: string
  school_name: string
  classes: StudentClass[]
  stats: StudentStats
  incomplete_items: IncompleteItem[]
}