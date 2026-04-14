import axiosInstance from '@/lib/api/axiosInstance'

export type AlimtalkDeliveryMode = 'mock' | 'live'

export interface AlimtalkSettings {
  intro_text: string | null
  outro_text: string | null
  delivery_mode: AlimtalkDeliveryMode
}

export interface PutAlimtalkSettingsDto {
  intro_text?: string | null
  outro_text?: string | null
}

/** API envelope: { success, data: AlimtalkSettings }. Legacy BE nested an extra `{ data: settings }` inside. */
function unwrapAlimtalkSettings(res: { data?: unknown }): AlimtalkSettings {
  const inner = res.data as AlimtalkSettings | { data: AlimtalkSettings } | undefined
  if (inner && typeof inner === 'object' && 'data' in inner && inner.data && typeof inner.data === 'object') {
    const nested = inner.data as AlimtalkSettings
    if ('delivery_mode' in nested) return nested
  }
  return inner as AlimtalkSettings
}

export type AlimtalkBatchType = 'LESSON' | 'ATTENDANCE'

export interface AlimtalkBatchListItem {
  batch_id: number
  type: AlimtalkBatchType
  delivery_mode: AlimtalkDeliveryMode
  sent_at: string
  total_count: number
  success_count: number
  fail_count: number
  lesson_record_id: number | null
  attendance_session_id: number | null
  class_name: string | null
  template_name: string | null
}

export interface AlimtalkBatchesMeta {
  total: number
  page: number
  limit: number
}

export interface AlimtalkBatchMessage {
  message_id: number
  student_id: number
  student_name: string
  phone_type: 'STUDENT' | 'PARENT'
  phone: string
  message_body: string
  status: 'SUCCESS' | 'FAIL'
  error_message: string | null
  parent_dashboard_token: string | null
  token_expires_at: string | null
  ai_feedback: string | null
}

export interface AlimtalkBatchDetail {
  batch_id: number
  type: AlimtalkBatchType
  delivery_mode: AlimtalkDeliveryMode
  sent_at: string
  total_count: number
  success_count: number
  fail_count: number
  lesson_record_id: number | null
  attendance_session_id: number | null
  messages: AlimtalkBatchMessage[]
}

function unwrapBatchDetail(res: { data?: unknown }): AlimtalkBatchDetail {
  const inner = res.data as AlimtalkBatchDetail | { data: AlimtalkBatchDetail } | undefined
  if (
    inner &&
    typeof inner === 'object' &&
    'data' in inner &&
    inner.data &&
    typeof inner.data === 'object' &&
    'batch_id' in inner.data &&
    'messages' in inner.data
  ) {
    return inner.data as AlimtalkBatchDetail
  }
  return inner as AlimtalkBatchDetail
}

export const alimtalkService = {
  async getSettings(): Promise<AlimtalkSettings> {
    const { data } = await axiosInstance.get('/alimtalk/settings')
    return unwrapAlimtalkSettings(data)
  },

  async putSettings(dto: PutAlimtalkSettingsDto): Promise<AlimtalkSettings> {
    const { data } = await axiosInstance.put('/alimtalk/settings', dto)
    return unwrapAlimtalkSettings(data)
  },

  async getBatches(params?: {
    page?: number
    limit?: number
    type?: AlimtalkBatchType
    class_id?: number
  }): Promise<{ data: AlimtalkBatchListItem[]; meta: AlimtalkBatchesMeta }> {
    const { data } = await axiosInstance.get('/alimtalk/batches', { params })
    return data.data as { data: AlimtalkBatchListItem[]; meta: AlimtalkBatchesMeta }
  },

  async getBatchDetail(batchId: number): Promise<AlimtalkBatchDetail> {
    const { data } = await axiosInstance.get(`/alimtalk/batches/${batchId}`)
    return unwrapBatchDetail(data)
  },
}
