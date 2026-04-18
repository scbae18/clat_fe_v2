import axiosInstance from '@/lib/api/axiosInstance'
import type { TemplateItem as EditorItem } from '@/app/(main)/template/_types/template'

export interface TemplateItemDetail {
  id: number
  name: string
   item_type: 'TEXT' | 'SELECT' | 'COMPLETE' | 'ATTENDANCE' | 'SCORE'
  is_common: boolean
  include_in_message: boolean
  is_default_attendance: boolean
  sort_order: number
  options?: string[]
}

export interface TemplateClass {
  id: number
  name: string
}

export interface Template {
  id: number
  name: string
  item_count: number
  class_count: number
  class_list: TemplateClass[]
  created_at: string
}

export interface TemplateDetail extends Template {
  id: number
  name: string
  items: TemplateItemDetail[]
}

export interface CreateTemplateItemDto {
  id?: number
  name: string
  item_type: string
  is_common: boolean
  include_in_message: boolean
  sort_order: number
  options: string[]
}

export interface CreateTemplateDto {
  name: string
  items: CreateTemplateItemDto[]
}

export interface UpdateTemplateItemDto {
  id?: number
  name?: string
  item_type?: string
  is_common?: boolean
  include_in_message?: boolean
  sort_order?: number
  options?: string[]
}

export interface UpdateTemplateDto {
  name?: string
  items?: UpdateTemplateItemDto[]
  deleted_item_ids?: number[]
}

// API item_type → 에디터 itemType 매핑
const API_TO_ITEM_TYPE: Record<string, EditorItem['itemType']> = {
  TEXT: 'text',
  NUMBER: 'number',
  SCORE: 'number',
  SELECT: 'choice',
  COMPLETE: 'completion',
}

// API 응답 → useTemplateEditor 초기값 변환
export const toEditorItems = (detail: TemplateDetail) => {
  const sorted = [...detail.items].sort((a, b) => a.sort_order - b.sort_order)
  const attendanceItems = sorted.filter((i) => i.item_type === 'ATTENDANCE')
  const attendanceItemIds = attendanceItems.map((i) => i.id)
  const nonAttendance = sorted.filter((i) => i.item_type !== 'ATTENDANCE')

  const toItem = (item: TemplateItemDetail): EditorItem => ({
    id: String(item.id),
    label: item.name,
    isActive: true,
    isInMessage: item.include_in_message,
    category: item.is_common ? 'common' : 'individual',
    itemType: API_TO_ITEM_TYPE[item.item_type] ?? 'text',
    choices: item.options?.map((o: any) => (typeof o === 'string' ? o : o.label)) ?? [],
  })

  // sort_order 기준으로 messageOrder 복원 (출결은 __attendance__로 치환)
  const messageOrder = sorted
    .map((i) => (i.item_type === 'ATTENDANCE' ? '__attendance__' : String(i.id)))
    .filter((id, index, self) => self.indexOf(id) === index) // 중복 제거

  return {
    name: detail.name,
    commonItems: nonAttendance.filter((i) => i.is_common).map(toItem),
    individualItems: nonAttendance.filter((i) => !i.is_common).map(toItem),
    attendanceItemIds,
    messageOrder,
  }
}

export const templateService = {
  // 목록 조회
  async getTemplates(): Promise<Template[]> {
    const { data } = await axiosInstance.get('/templates')
    return data.data.data
  },

  // 상세 조회
  async getTemplate(id: number): Promise<TemplateDetail> {
    const { data } = await axiosInstance.get(`/templates/${id}`)
    return data.data
  },

  // 생성
  async createTemplate(dto: CreateTemplateDto): Promise<TemplateDetail> {
    const { data } = await axiosInstance.post('/templates', dto)
    return data.data
  },

  // 수정
  async updateTemplate(id: number, dto: UpdateTemplateDto): Promise<TemplateDetail> {
    const { data } = await axiosInstance.put(`/templates/${id}`, dto)
    return data.data
  },

  // 삭제
  async deleteTemplate(id: number): Promise<void> {
    await axiosInstance.delete(`/templates/${id}`)
  },
}