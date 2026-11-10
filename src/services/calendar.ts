import axiosInstance from '@/lib/api/axiosInstance'
import type { CalendarEvent } from '@/types/calendar'

export const calendarService = {
  async list(from: string, to: string): Promise<CalendarEvent[]> {
    const { data } = await axiosInstance.get('/calendar', { params: { from, to } })
    return data.data as CalendarEvent[]
  },

  async create(input: {
    event_date: string
    body: string
    student_ids: number[]
  }): Promise<CalendarEvent> {
    const { data } = await axiosInstance.post('/calendar', input)
    return data.data as CalendarEvent
  },

  async update(
    id: number,
    input: { body?: string; student_ids?: number[] },
  ): Promise<CalendarEvent> {
    const { data } = await axiosInstance.patch(`/calendar/${id}`, input)
    return data.data as CalendarEvent
  },

  async remove(id: number): Promise<void> {
    await axiosInstance.delete(`/calendar/${id}`)
  },
}
