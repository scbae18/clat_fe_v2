import axiosInstance from '@/lib/api/axiosInstance'
import type { HomeToday } from '@/types/home'

export const homeService = {
  async today(): Promise<HomeToday> {
    const { data } = await axiosInstance.get('/home/today')
    return data.data as HomeToday
  },
}
