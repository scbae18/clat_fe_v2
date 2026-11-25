import type { AlimtalkBatchMessage } from '@/services/alimtalk'
import { colors } from '@/styles/tokens/colors'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

export type ChipFilter = 'all' | 'complete' | 'fail' | 'LESSON' | 'ATTENDANCE' | 'BROADCAST'

export type GroupedStudentMessages = {
  name: string
  messages: AlimtalkBatchMessage[]
}

export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 10) return phone || '—'
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`
}

function groupHasFailure(group: GroupedStudentMessages): boolean {
  return group.messages.some((message) => message.status === 'FAIL')
}

export function groupMessages(messages: AlimtalkBatchMessage[]) {
  const m = new Map<number, GroupedStudentMessages>()
  for (const msg of messages) {
    const studentId = msg.student_id ?? 0
    const cur = m.get(studentId) ?? { name: msg.student_name, messages: [] }
    cur.name = msg.student_name
    cur.messages.push(msg)
    m.set(studentId, cur)
  }
  for (const group of m.values()) {
    group.messages.sort((a, b) => {
      if (a.phone_type !== b.phone_type) return a.phone_type === 'STUDENT' ? -1 : 1
      return a.message_id - b.message_id
    })
  }
  return Array.from(m.entries()).sort((a, b) => {
    const aFail = groupHasFailure(a[1])
    const bFail = groupHasFailure(b[1])
    if (aFail !== bFail) return aFail ? -1 : 1
    return a[1].name.localeCompare(b[1].name, 'ko')
  })
}

export function channelLabel(phoneType: AlimtalkBatchMessage['phone_type']): string {
  return phoneType === 'STUDENT' ? '학생' : '학부모'
}

export function previewTitle(phoneType: AlimtalkBatchMessage['phone_type']): string {
  return phoneType === 'STUDENT' ? '[학생용 문자]' : '[학부모용 문자]'
}

export function guidanceText(message: AlimtalkBatchMessage): string | null {
  if (message.status !== 'FAIL') return null
  if (message.kakao_unavailable) return MANUAL_TEXT_LABEL
  const raw = message.error_message?.trim() ?? ''
  if (!raw) return null
  const fail = raw.match(/^SOLAPI_FAIL\s+\d+\s*(.*)$/)
  if (fail) return fail[1].trim() || raw
  const named = raw.match(/^SOLAPI_[^:]+:\s*(.*)$/)
  if (named) return named[1].trim() || '발송 결과를 확인하지 못했어요.'
  return raw
}

export function deliveryNote(message: AlimtalkBatchMessage): string {
  if (message.status === 'SUCCESS') return '카카오톡으로 전달됨'
  if (message.status === 'PENDING') return '보내는 중'
  if (message.kakao_unavailable) return MANUAL_TEXT_LABEL
  return '전달되지 않음'
}

export function canResendMessage(message: AlimtalkBatchMessage): boolean {
  if (typeof message.resendable === 'boolean') return message.resendable
  return message.status === 'FAIL' && !message.kakao_unavailable
}

export function batchStatusView(row: {
  fail_count: number
  fail_student_count?: number
  status?: 'queued' | 'sending' | 'done' | 'partial_fail'
}): { label: string; tone: 'success' | 'fail' | 'pending' } {
  const fails = row.fail_student_count ?? row.fail_count
  if (fails > 0) return { label: `${fails}명 실패`, tone: 'fail' }
  if (row.status === 'queued' || row.status === 'sending') {
    return { label: '보내는 중', tone: 'pending' }
  }
  return { label: '발송 완료', tone: 'success' }
}

export function isBatchComplete(row: {
  fail_count: number
  status?: 'queued' | 'sending' | 'done' | 'partial_fail'
}): boolean {
  if (row.fail_count > 0) return false
  if (row.status === 'queued' || row.status === 'sending') return false
  return true
}

export const MANUAL_TEXT_LABEL = '직접 문자 발송 필요'

export function statusLabel(s: 'SUCCESS' | 'FAIL' | 'PENDING'): string {
  if (s === 'SUCCESS') return '성공'
  if (s === 'PENDING') return '보내는 중'
  return '실패'
}

export function messageStatusLabel(message: {
  status: 'SUCCESS' | 'FAIL' | 'PENDING'
  kakao_unavailable?: boolean
}): string {
  if (message.kakao_unavailable) return MANUAL_TEXT_LABEL
  return statusLabel(message.status)
}

export function messageStatusStyle(message: {
  status: 'SUCCESS' | 'FAIL' | 'PENDING'
  kakao_unavailable?: boolean
}): {
  color: string
  backgroundColor: string
} {
  if (message.kakao_unavailable) {
    return { color: colors.warning500, backgroundColor: colors.warning50 }
  }
  return statusPillStyle(message.status)
}

export function needsManualTextOnly(messages: Array<{
  status: 'SUCCESS' | 'FAIL' | 'PENDING'
  kakao_unavailable?: boolean
}>): boolean {
  const fails = messages.filter((message) => message.status === 'FAIL')
  return fails.length > 0 && fails.every((message) => message.kakao_unavailable)
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
