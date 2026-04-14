import axiosInstance from '@/lib/api/axiosInstance'

export interface LessonSummary {
  id?: number | null
  lesson_record_id: number | null
  class_id: number
  class_name: string
  academy_name: string
  template_id: number
  template_name: string
  progress_rate: number
  total_students: number
  status: 'DRAFT' | 'SAVED'
  is_adhoc: boolean
}

export interface LessonItemDetail {
  id: number
  name: string
  item_type: 'TEXT' | 'NUMBER' | 'SELECT' | 'COMPLETE' | 'ATTENDANCE'
  is_common: boolean
  include_in_message: boolean
  sort_order: number
  options?: { id: number; label: string; sort_order: number }[]
}

export interface LessonDetail {
  id: number
  class_id: number
  class_name: string
  academy_name: string
  template_id: number
  template_name: string
  lesson_date: string
  status: 'DRAFT' | 'SAVED'
  is_adhoc: boolean
  common_data: CommonDataItem[]
  student_data: StudentData[]
  items: LessonItemDetail[]
}

export interface LessonListResponse {
  data: LessonSummary[]
  meta: { total: number }
}

export interface CommonDataItem {
  template_item_id: number
  value: string
}

export interface StudentDataItem {
  template_item_id: number
  value: string
  is_completed?: boolean
}

export interface StudentData {
  student_id: number
  items: StudentDataItem[]
}

export interface CreateLessonDto {
  class_id: number
  template_id: number
  lesson_date: string
  is_adhoc: boolean
  status: 'DRAFT' | 'SAVED'
  common_data: CommonDataItem[]
  student_data: StudentData[]
}

export interface UpdateLessonDto {
  lesson_id: number
  class_id: number
  lesson_date: string
  template_id?: number
  status?: 'DRAFT' | 'SAVED'
  common_data: CommonDataItem[]
  student_data: StudentData[]
}

export const lessonService = {
  async getLessons(date: string): Promise<LessonListResponse> {
    const { data } = await axiosInstance.get('/lessons', { params: { date } })
    return data.data
  },

  async getLesson(id: number): Promise<LessonDetail> {
    const { data } = await axiosInstance.get(`/lessons/${id}`)
    return data.data
  },

  async createLesson(dto: CreateLessonDto): Promise<LessonDetail> {
    const { data } = await axiosInstance.post('/lessons', dto)
    return data.data
  },

  async updateLesson(dto: UpdateLessonDto): Promise<LessonDetail> {
    const { data } = await axiosInstance.post('/lessons', dto)
    return data.data
  },

  async saveLesson(id: number): Promise<void> {
    await axiosInstance.post(`/lessons/${id}/save`)
  },

  async previewLesson(id: number): Promise<any> {
    const { data } = await axiosInstance.get(`/lessons/${id}/preview`)
    return data.data
  },

  async exportLesson(id: number): Promise<Blob> {
    const { data } = await axiosInstance.get(`/lessons/${id}/export`, {
      responseType: 'blob',
    })
    return data
  },
}
