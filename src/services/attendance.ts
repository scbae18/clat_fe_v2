import axiosInstance from '@/lib/api/axiosInstance'
import publicAxios from '@/lib/api/publicAxios'
import type { ApiStudentCheckLink } from '@/lib/attendanceUrls'

export type AttendanceCheckStatus = 'PRESENT' | 'LATE' | 'ABSENT'

export interface AttendanceSessionByLesson {
  session_id: number | null
  code?: string
  expires_at?: string
  is_active?: boolean
}

export interface CreateAttendanceSessionBody {
  lesson_record_id: number
  duration_minutes: number
}

export interface CreateAttendanceSessionResult {
  session_id: number
  code: string
  expires_at: string
  student_count: number
  /** Optional: server-built per-student URLs for Alimtalk; FE falls back if omitted. */
  student_links?: ApiStudentCheckLink[]
}

export interface AttendanceSessionStudentRow {
  student_id: number
  student_name: string
  status: AttendanceCheckStatus
  checked_at: string | null
  is_manual: boolean
  /** Optional: from GET session when BE provides it */
  check_url?: string | null
}

export interface AttendanceSessionDetail {
  session_id: number
  code: string
  started_at: string
  expires_at: string
  is_active: boolean
  total_count: number
  present_count: number
  late_count: number
  absent_count: number
  students: AttendanceSessionStudentRow[]
}

type AnyRecord = Record<string, unknown>

function unwrapApiData(input: unknown): AnyRecord {
  let cur: unknown = input
  for (let i = 0; i < 4; i += 1) {
    if (
      cur &&
      typeof cur === 'object' &&
      'data' in (cur as Record<string, unknown>) &&
      (cur as Record<string, unknown>).data
    ) {
      cur = (cur as Record<string, unknown>).data
      continue
    }
    break
  }
  return (cur && typeof cur === 'object' ? cur : {}) as AnyRecord
}

function parseSessionBase(raw: AnyRecord) {
  const sessionIdRaw = raw.session_id ?? raw.sessionId ?? null
  const codeRaw = raw.code ?? ''
  const expiresRaw = raw.expires_at ?? raw.expiresAt ?? null
  const isActiveRaw = raw.is_active ?? raw.isActive
  return {
    session_id: typeof sessionIdRaw === 'number' ? sessionIdRaw : Number(sessionIdRaw || 0),
    code: String(codeRaw ?? ''),
    expires_at: expiresRaw ? String(expiresRaw) : '',
    is_active: typeof isActiveRaw === 'boolean' ? isActiveRaw : undefined,
  }
}

export const attendanceService = {
  async getSessionByLesson(lessonRecordId: number): Promise<AttendanceSessionByLesson> {
    const { data } = await axiosInstance.get(`/attendance/sessions/by-lesson/${lessonRecordId}`)
    const raw = unwrapApiData(data)
    const base = parseSessionBase(raw)
    return {
      session_id: Number.isFinite(base.session_id) && base.session_id > 0 ? base.session_id : null,
      code: base.code || undefined,
      expires_at: base.expires_at || undefined,
      is_active: base.is_active,
    }
  },

  async createSession(body: CreateAttendanceSessionBody): Promise<CreateAttendanceSessionResult> {
    const { data } = await axiosInstance.post('/attendance/sessions', body)
    const raw = unwrapApiData(data)
    const base = parseSessionBase(raw)
    if (!Number.isFinite(base.session_id) || base.session_id <= 0 || !base.expires_at) {
      throw new Error('INVALID_ATTENDANCE_SESSION_RESPONSE')
    }
    return {
      session_id: base.session_id,
      code: base.code,
      expires_at: base.expires_at,
      student_count: Number(raw.student_count ?? raw.studentCount ?? 0),
      student_links: (raw.student_links ?? raw.studentLinks ?? []) as ApiStudentCheckLink[],
    }
  },

  async getSession(sessionId: number): Promise<AttendanceSessionDetail> {
    const { data } = await axiosInstance.get(`/attendance/sessions/${sessionId}`)
    const raw = unwrapApiData(data)
    const base = parseSessionBase(raw)
    return {
      session_id: base.session_id,
      code: base.code,
      started_at: String(raw.started_at ?? raw.startedAt ?? ''),
      expires_at: base.expires_at,
      is_active: base.is_active ?? true,
      total_count: Number(raw.total_count ?? raw.totalCount ?? 0),
      present_count: Number(raw.present_count ?? raw.presentCount ?? 0),
      late_count: Number(raw.late_count ?? raw.lateCount ?? 0),
      absent_count: Number(raw.absent_count ?? raw.absentCount ?? 0),
      students: (raw.students ?? []) as AttendanceSessionStudentRow[],
    }
  },

  async endSession(sessionId: number): Promise<void> {
    try {
      await axiosInstance.post(`/attendance/sessions/${sessionId}/end`)
      return
    } catch {
      // Compatibility fallback for servers using PATCH style endpoints.
      await axiosInstance.patch(`/attendance/sessions/${sessionId}`, { is_active: false })
    }
  },

  async patchStudentStatus(
    sessionId: number,
    studentId: number,
    status: AttendanceCheckStatus
  ): Promise<void> {
    await axiosInstance.patch(`/attendance/sessions/${sessionId}/students/${studentId}`, { status })
  },

  /** Public student check-in screen */
  async getPublicCheckSession(
    sessionId: number,
    studentId: number
  ): Promise<{
    ok: boolean
    class_name?: string
    expires_at?: string
    student_name?: string | null
    already_checked?: boolean
    closed?: boolean
    message?: string
  }> {
    const { data } = await publicAxios.get(`/attendance/public/sessions/${sessionId}`, {
      params: { student_id: studentId },
    })
    const raw = unwrapApiData(data)
    return raw as {
      ok: boolean
      class_name?: string
      expires_at?: string
      student_name?: string | null
      already_checked?: boolean
      closed?: boolean
      message?: string
    }
  },

  async submitPublicCheckCode(
    sessionId: number,
    studentId: number,
    code: string
  ): Promise<{
    status: AttendanceCheckStatus
    class_name?: string
    lesson_date?: string
    checked_at?: string
  }> {
    const { data } = await publicAxios.post(`/attendance/public/sessions/${sessionId}/check`, {
      student_id: studentId,
      code,
    })
    const raw = unwrapApiData(data)
    return raw as {
      status: AttendanceCheckStatus
      class_name?: string
      lesson_date?: string
      checked_at?: string
    }
  },
}
