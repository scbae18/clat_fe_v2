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

export type AlimtalkBatchType = 'LESSON' | 'ATTENDANCE' | 'BROADCAST'

export type BroadcastChannel = 'STUDENT' | 'PARENT' | 'BOTH'

export type BroadcastNoticeType = 'MAKEUP' | 'SCHEDULE' | 'PREP' | 'PROGRESS'

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
  body_text?: string | null
  notice_type?: BroadcastNoticeType | null
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
  body_text?: string | null
  notice_type?: BroadcastNoticeType | null
  messages: AlimtalkBatchMessage[]
}

export interface BroadcastSendResult {
  batch_id: number
  total_count: number
  success_count: number
  fail_count: number
  delivery_mode: AlimtalkDeliveryMode
}

function unwrapBatchList(res: { data?: unknown }): {
  data: AlimtalkBatchListItem[]
  meta: AlimtalkBatchesMeta
} {
  const empty: { data: AlimtalkBatchListItem[]; meta: AlimtalkBatchesMeta } = {
    data: [],
    meta: { total: 0, page: 1, limit: 20 },
  }
  const inner = res.data
  if (Array.isArray(inner)) {
    return { data: inner, meta: { total: inner.length, page: 1, limit: inner.length } }
  }
  if (!inner || typeof inner !== 'object') return empty

  const obj = inner as { data?: unknown; meta?: AlimtalkBatchesMeta }
  if (Array.isArray(obj.data)) {
    return {
      data: obj.data,
      meta: obj.meta ?? { total: obj.data.length, page: 1, limit: obj.data.length },
    }
  }
  if (obj.data && typeof obj.data === 'object' && 'data' in obj.data) {
    const nested = obj.data as { data?: AlimtalkBatchListItem[]; meta?: AlimtalkBatchesMeta }
    if (Array.isArray(nested.data)) {
      return {
        data: nested.data,
        meta: nested.meta ?? { total: nested.data.length, page: 1, limit: nested.data.length },
      }
    }
  }
  return empty
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
    from?: string
    to?: string
  }): Promise<{ data: AlimtalkBatchListItem[]; meta: AlimtalkBatchesMeta }> {
    const { data } = await axiosInstance.get('/alimtalk/batches', { params })
    return unwrapBatchList(data)
  },

  async getBatchDetail(batchId: number): Promise<AlimtalkBatchDetail> {
    const { data } = await axiosInstance.get(`/alimtalk/batches/${batchId}`)
    return unwrapBatchDetail(data)
  },

  async sendBroadcast(dto: {
    student_ids: number[]
    channel: BroadcastChannel
    notice_type: BroadcastNoticeType
    body: string
  }): Promise<BroadcastSendResult> {
    const { data } = await axiosInstance.post('/alimtalk/broadcast', dto)
    const inner = data.data as BroadcastSendResult | { data: BroadcastSendResult } | undefined
    if (inner && typeof inner === 'object' && 'data' in inner && inner.data) {
      return inner.data as BroadcastSendResult
    }
    return inner as BroadcastSendResult
  },
}
