import type { AlimtalkBatchMessage } from '@/services/alimtalk'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export type ChipFilter = 'all' | 'complete' | 'fail' | 'LESSON' | 'ATTENDANCE'

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
    const cur = m.get(msg.student_id) ?? { name: msg.student_name }
    cur.name = msg.student_name
    if (msg.phone_type === 'STUDENT') cur.student = msg
    else cur.parent = msg
    m.set(msg.student_id, cur)
  }
  return Array.from(m.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name, 'ko'))
}

export function statusLabel(s: 'SUCCESS' | 'FAIL'): string {
  return s === 'SUCCESS' ? '성공' : '실패'
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
