import axiosInstance from '@/lib/api/axiosInstance'
import type { Student, StudentDetail } from '@/types/student'

export interface StudentClass {
  id: number
  name: string
  academy_name?: string
}

export interface CreateStudentDto {
  name: string
  phone?: string
  parent_phone?: string
  school_name?: string
  class_ids?: number[]
}

export interface UpdateStudentDto {
  name?: string
  phone?: string
  parent_phone?: string
  school_name?: string
  class_ids?: number[]
}

export interface StudentListResponse {
  data: Student[]
  meta: { total: number }
}

export interface BulkCreateStudentDto {
  name: string
  phone: string
  parent_phone: string
  school_name: string
}

export interface BulkUploadResult {
  success_count: number
  fail_count: number
  errors: Array<{ row: number; reason: string }>
}

export const studentService = {
  async getStudents(params?: { search?: string; school?: string }): Promise<StudentListResponse> {
    const { data } = await axiosInstance.get('/students', { params })
    return data.data
  },

  async getStudent(id: number): Promise<StudentDetail> {
    const { data } = await axiosInstance.get(`/students/${id}`)
    return data.data
  },

  async createStudent(dto: CreateStudentDto): Promise<Student> {
    const { data } = await axiosInstance.post('/students', dto)
    return data.data
  },

  async updateStudent(id: number, dto: UpdateStudentDto): Promise<Student> {
    const { data } = await axiosInstance.put(`/students/${id}`, dto)
    return data.data
  },

  async deleteStudent(id: number): Promise<void> {
    await axiosInstance.delete(`/students/${id}`)
  },

  async completeItem(itemId: number): Promise<void> {
    await axiosInstance.patch(`/lesson-student-data/${itemId}/complete`, {
      is_completed: true,
    })
  },

  async bulkCreateStudents(file: File): Promise<BulkUploadResult> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await axiosInstance.post('/students/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data.data as BulkUploadResult
  },
}
