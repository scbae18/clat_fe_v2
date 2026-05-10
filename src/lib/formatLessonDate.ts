import { format, parseISO, isValid } from 'date-fns'
import { ko } from 'date-fns/locale'

/** 수업 날짜 문자열(YYYY-MM-DD 등)을 카드·목록용 한글 표기로 */
export function formatLessonDateKo(raw: string): string {
  const s = raw?.trim()
  if (!s) return raw ?? ''
  try {
    const iso = s.includes('T') ? s : `${s}T12:00:00`
    const d = parseISO(iso)
    if (!isValid(d)) return raw
    return format(d, 'M월 d일 (E)', { locale: ko })
  } catch {
    return raw
  }
}
