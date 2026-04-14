import publicAxios from '@/lib/api/publicAxios'

type ParentLessonSummary = {
  attendance: string | null
  scores: Array<{ name: string; value: string }>
  extra_items: Array<{ name: string; value: string }>
}

export type ParentDashboardData = {
  student_name: string
  class_name: string
  academy_name: string
  lesson_date: string
  lesson_summary: ParentLessonSummary
  ai_feedback: string | null
  ai_feedback_status: 'ready' | 'pending' | 'failed'
  incomplete_items: Array<{
    item_name: string
    lesson_date: string
    class_name: string
    template_name: string
  }>
  recent_lessons: Array<{
    lesson_date: string
    class_name: string
    template_name: string
  }>
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

export const parentDashboardService = {
  async getByToken(token: string): Promise<ParentDashboardData> {
    const { data } = await publicAxios.get(`/parent/${encodeURIComponent(token)}`)
    return unwrapData<ParentDashboardData>(data)
  },
}

