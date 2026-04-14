/** Path only — use with `window.location.origin` or Router when copying full URL. */
export function studentCheckPath(sessionId: number, studentId: number) {
  return `/check/${sessionId}?studentId=${studentId}`
}

export function studentCheckFullUrl(sessionId: number, studentId: number) {
  if (typeof window === 'undefined') {
    const base = process.env.NEXT_PUBLIC_APP_ORIGIN ?? ''
    return `${base.replace(/\/$/, '')}${studentCheckPath(sessionId, studentId)}`
  }
  return `${window.location.origin}${studentCheckPath(sessionId, studentId)}`
}

/** Shape of `student_links[]` from `POST /attendance/sessions` (canonical URLs for Alimtalk). */
export type ApiStudentCheckLink = {
  student_id: number
  url: string
}

export type ResolvedStudentCheckLink = {
  student_id: number
  student_name: string
  url: string
}

/**
 * Prefer server URLs from `student_links`; otherwise build `/check/:sessionId?studentId=:id`
 * (v2-attendance-requirements §3.2, §9).
 */
export function resolveStudentCheckLinks(
  sessionId: number,
  roster: { id: number; name: string }[],
  apiLinks?: ApiStudentCheckLink[] | null
): ResolvedStudentCheckLink[] {
  const byId = new Map<number, string>()
  for (const l of apiLinks ?? []) {
    if (l.student_id != null && l.url) byId.set(l.student_id, l.url)
  }
  return roster.map((s) => ({
    student_id: s.id,
    student_name: s.name,
    url: byId.get(s.id) ?? studentCheckFullUrl(sessionId, s.id),
  }))
}

/** TSV: student name + tab + URL (spreadsheets / Alimtalk prep). */
export function formatStudentLinksTsv(links: ResolvedStudentCheckLink[]) {
  return links.map((l) => `${l.student_name}\t${l.url}`).join('\n')
}
