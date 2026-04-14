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

export const alimtalkService = {
  async getSettings(): Promise<AlimtalkSettings> {
    const { data } = await axiosInstance.get('/alimtalk/settings')
    return unwrapAlimtalkSettings(data)
  },

  async putSettings(dto: PutAlimtalkSettingsDto): Promise<AlimtalkSettings> {
    const { data } = await axiosInstance.put('/alimtalk/settings', dto)
    return unwrapAlimtalkSettings(data)
  },
}
