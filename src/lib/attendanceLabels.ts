export const CORE_ATTENDANCE_LABELS = ['출석', '지각', '결석'] as const
export const MAX_ATTENDANCE_EXTRA_OPTIONS = 5
export const MAX_ATTENDANCE_EXTRA_LABEL_LENGTH = 10

export type CoreAttendance = (typeof CORE_ATTENDANCE_LABELS)[number]

export function isCoreAttendanceLabel(value: string): boolean {
  return (CORE_ATTENDANCE_LABELS as readonly string[]).includes(value)
}

export function parseAttendanceValue(raw: string | null | undefined): string | null {
  const value = (raw ?? '').trim()
  return value === '' ? null : value
}
