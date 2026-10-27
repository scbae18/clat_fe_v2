import type { AlimtalkBatchMessage } from '@/services/alimtalk'
import { colors } from '@/styles/tokens/colors'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export type ChipFilter = 'all' | 'complete' | 'fail' | 'LESSON' | 'ATTENDANCE' | 'BROADCAST'

export type GroupedStudentMessages = {
  name: string
  student?: AlimtalkBatchMessage
  parent?: AlimtalkBatchMessage
}

export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 10) return phone || '—'
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`
}

export function groupMessages(messages: AlimtalkBatchMessage[]) {
  const m = new Map<number, GroupedStudentMessages>()
  for (const msg of messages) {
    const studentId = msg.student_id ?? 0
    const cur = m.get(studentId) ?? { name: msg.student_name }
    cur.name = msg.student_name
    if (msg.phone_type === 'STUDENT') cur.student = msg
    else cur.parent = msg
    m.set(studentId, cur)
  }
  return Array.from(m.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name, 'ko'))
}

export function statusLabel(s: 'SUCCESS' | 'FAIL' | 'PENDING'): string {
  if (s === 'SUCCESS') return '성공'
  if (s === 'PENDING') return '보내는 중'
  return '실패'
}

export function statusPillStyle(status: 'SUCCESS' | 'FAIL' | 'PENDING'): {
  color: string
  backgroundColor: string
} {
  if (status === 'SUCCESS') return { color: colors.success500, backgroundColor: colors.success50 }
  if (status === 'PENDING') return { color: colors.gray500, backgroundColor: colors.gray50 }
  return { color: colors.error500, backgroundColor: colors.error50 }
}

export function formatSent(iso: string) {
  try {
    return format(new Date(iso), "M'월' d'일' (E) HH:mm", { locale: ko })
  } catch {
    return iso
  }
}

export function recipientLabel(n: number) {
  return `${n}명`
}
