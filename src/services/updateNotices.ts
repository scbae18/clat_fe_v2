import axiosInstance from '@/lib/api/axiosInstance'
import type { UpdateNotice } from '@/lib/whatsNew'

type Envelope<T> = { success: boolean; data: T }

export const updateNotices = {
  async getCurrent() {
    const { data } = await axiosInstance.get<Envelope<UpdateNotice | null>>('/update-notices/current')
    return data.data
  },
}
