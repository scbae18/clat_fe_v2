import axiosInstance from '@/lib/api/axiosInstance'
import type { TutorialAction } from './tutorialEvents'

export type TutorialScreen = 'management' | 'student' | 'home' | 'alimtalk' | 'me'

export interface TutorialState {
  status: 'none' | 'in_progress' | 'completed'
  step: number
  auto_open: boolean
  template_id: number | null
  class_id: number | null
  student_id: number | null
  lesson_id: number | null
  student_name: string | null
  seen_screens: string[]
  fixture_ok: boolean
}

export interface TutorialApiError {
  code?: string
  message: string
}

const EMPTY: TutorialState = {
  status: 'none',
  step: 0,
  auto_open: false,
  template_id: null,
  class_id: null,
  student_id: null,
  lesson_id: null,
  student_name: null,
  seen_screens: [],
  fixture_ok: false,
}

function readError(error: unknown): TutorialApiError {
  const body = (error as { response?: { data?: { error?: { code?: string; message?: string } } } })
    .response?.data?.error
  return {
    code: body?.code,
    message: body?.message || '체험을 처리하지 못했어요.',
  }
}

async function post(url: string, body?: unknown): Promise<TutorialState> {
  const { data } = await axiosInstance.post(url, body ?? {}, { timeout: 20000 })
  return data.data as TutorialState
}

export const tutorialApi = {
  empty: EMPTY,
  readError,
  async get(): Promise<TutorialState> {
    const { data } = await axiosInstance.get('/tutorial')
    return data.data as TutorialState
  },
  start: () => post('/tutorial/start'),
  resume: () => post('/tutorial/resume'),
  restart: (force = false) => post('/tutorial/restart', { force }),
  complete: (force = false) => post('/tutorial/complete', { force }),
  skip: () => post('/tutorial/skip'),
  advance: (action: TutorialAction, studentId?: number) =>
    post('/tutorial/advance', { action, student_id: studentId }),
  seen: (screen: TutorialScreen) => post('/tutorial/seen', { screen }),
}

export function stepPath(state: TutorialState): string | null {
  switch (state.step) {
    case 1:
      return state.template_id ? `/template/${state.template_id}/edit` : null
    case 2:
      return '/ai'
    case 3:
    case 4:
    case 5:
      return state.lesson_id ? `/lesson/${state.lesson_id}` : null
    case 6:
      return state.student_id ? `/students/${state.student_id}` : null
    default:
      return null
  }
}
