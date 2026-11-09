export const ADMIN_NOTICE_CHAR_LIMIT = 1000

export function todayKstYmd(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

export function formatAdminNoticeDateLabel(dateYmd: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateYmd.trim())
  if (!match) return dateYmd
  return `${Number(match[2])}월 ${Number(match[3])}일`
}

export function renderAdminNoticeMessage(dateLabel: string, body: string): string {
  return `안녕하세요. 선생님! 클랫 운영진입니다.\n이번 ${dateLabel} 클랫의 업데이트 사항 안내드립니다.\n\n${body}`
}

export function adminNoticeCharCount(text: string): number {
  return Array.from(text).length
}
