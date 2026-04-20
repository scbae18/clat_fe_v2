import axiosInstance from '@/lib/api/axiosInstance'

export type ScorePeriod = 'recent5' | 'recent10' | '1month' | '3month' | 'all'

export interface ScoreHistoryPoint {
  lesson_record_id: number
  lesson_date: string
  class_name: string
  item_name: string
  value: string
  /** Same lesson + SCORE item: class average (numeric values only). */
  lesson_avg?: number | null
  /** Same lesson + SCORE item: class high score. */
  lesson_high?: number | null
}

export interface LessonHistoryRow {
  lesson_record_id: number
  lesson_date: string
  class_name: string
  template_name: string
  status: string
}

export interface AlimtalkHistoryRow {
  message_id: number
  phone_type: string
  sent_at: string
  batch_type: string
  delivery_mode: 'mock' | 'live'
  status: string
  preview: string
}

export const studentDashboardService = {
  async getScoreHistory(studentId: number, period: ScorePeriod) {
    const { data } = await axiosInstance.get(`/students/${studentId}/score-history`, {
      params: { period },
    })
    const payload = data.data as { data: ScoreHistoryPoint[] }
    return payload.data
  },

  async getLessonHistory(studentId: number, page = 1, limit = 20) {
    const { data } = await axiosInstance.get(`/students/${studentId}/lesson-history`, {
      params: { page, limit },
    })
    return data.data as { data: LessonHistoryRow[]; meta: { total: number; page: number; limit: number } }
  },

  async getAlimtalkHistory(studentId: number, page = 1, limit = 20) {
    const { data } = await axiosInstance.get(`/students/${studentId}/alimtalk`, {
      params: { page, limit },
    })
    return data.data as { data: AlimtalkHistoryRow[]; meta: { total: number; page: number; limit: number } }
  },

  async postAiAnalysis(studentId: number, refresh?: boolean) {
    const { data } = await axiosInstance.post(`/students/${studentId}/ai-analysis`, null, {
      params: refresh ? { refresh: 'true' } : {},
    })
    const payload = data.data as { data: { analysis: string; cached: boolean } }
    return payload.data
  },
}
