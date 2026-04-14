import axiosInstance from '@/lib/api/axiosInstance'

export type AiTonePreset = 'WARM' | 'ANALYTICAL' | 'CONCISE' | 'CUSTOM'
export type AiDataPeriod = 'THIS_LESSON' | 'RECENT_3' | 'RECENT_5' | 'RECENT_1MONTH'
export type AiFeedbackLength = 'SHORT' | 'MEDIUM' | 'LONG'

export interface AiSettings {
  tone_preset: AiTonePreset
  custom_tone_description: string | null
  custom_tone_messages: string | null
  data_period: AiDataPeriod
  feedback_length: AiFeedbackLength
  include_score: boolean
  include_homework: boolean
  include_attendance: boolean
  include_improvement: boolean
  include_praise: boolean
}

export interface PutAiSettingsDto {
  tone_preset?: AiTonePreset
  custom_tone_description?: string | null
  custom_tone_messages?: string | null
  data_period?: AiDataPeriod
  feedback_length?: AiFeedbackLength
  include_score?: boolean
  include_homework?: boolean
  include_attendance?: boolean
  include_improvement?: boolean
  include_praise?: boolean
}

export interface AnalyzeToneDto {
  tone_description?: string
  sample_messages?: string[]
}

function unwrapData<T>(input: unknown): T {
  let cur: unknown = input
  for (let i = 0; i < 4; i += 1) {
    if (cur && typeof cur === 'object' && 'data' in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>).data
      continue
    }
    break
  }
  return cur as T
}

export const aiSettingsService = {
  async getSettings(): Promise<AiSettings> {
    const { data } = await axiosInstance.get('/ai-settings')
    return unwrapData<AiSettings>(data)
  },

  async putSettings(dto: PutAiSettingsDto): Promise<AiSettings> {
    const { data } = await axiosInstance.put('/ai-settings', dto)
    return unwrapData<AiSettings>(data)
  },

  async analyzeTone(dto: AnalyzeToneDto): Promise<{ sample_feedback: string }> {
    const { data } = await axiosInstance.post('/ai-settings/analyze-tone', dto)
    return unwrapData<{ sample_feedback: string }>(data)
  },
}

