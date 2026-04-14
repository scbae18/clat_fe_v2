import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ResolvedStudentCheckLink } from '@/lib/attendanceUrls'

export interface ActiveAttendanceSession {
  sessionId: number
  lessonRecordId: number
  className: string
  code: string
  expiresAt: string
  /** Resolved per-student URLs (server student_links or client-built). */
  studentLinks?: ResolvedStudentCheckLink[]
}

interface AttendanceSessionStore {
  active: ActiveAttendanceSession | null
  setActive: (session: ActiveAttendanceSession | null) => void
  /** Increment to request opening the attendance detail modal (e.g. "출결 진행 중" on lesson page). */
  attendanceDetailNonce: number
  bumpAttendanceDetail: () => void
}

export const useAttendanceSessionStore = create<AttendanceSessionStore>()(
  persist(
    (set) => ({
      active: null,
      attendanceDetailNonce: 0,
      setActive: (active) => set({ active }),
      bumpAttendanceDetail: () =>
        set((s) => ({ attendanceDetailNonce: s.attendanceDetailNonce + 1 })),
    }),
    {
      name: 'clat-attendance-session',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ active: s.active }),
    }
  )
)

export const ATTENDANCE_SESSION_ENDED_EVENT = 'clat-attendance-ended'

export function dispatchAttendanceSessionEnded(lessonRecordId: number) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent(ATTENDANCE_SESSION_ENDED_EVENT, { detail: { lessonRecordId } })
  )
}
