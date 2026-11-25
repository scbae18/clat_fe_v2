import type { BroadcastNoticeType } from '@/services/alimtalk'

export type { BroadcastNoticeType }

export const BROADCAST_NOTICE_TYPES: readonly BroadcastNoticeType[] = [
  'MAKEUP',
  'SCHEDULE',
  'PREP',
  'PROGRESS',
] as const

export const BROADCAST_NOTICE_LABEL: Record<BroadcastNoticeType, string> = {
  MAKEUP: '수업 보강 안내',
  SCHEDULE: '수업 시간 안내',
  PREP: '수업 전 준비 사항 안내',
  PROGRESS: '수업 진도 안내',
}

/** 승인 템플릿 중간 문장 (`{학생} 학생의 …입니다.` 중 종류 부분) */
export const BROADCAST_NOTICE_MIDDLE: Record<BroadcastNoticeType, string> = {
  MAKEUP: '수업 보강 시간 안내',
  SCHEDULE: '수업 시간 안내',
  PREP: '수업 전 준비 사항 안내',
  PROGRESS: '수업 진도 안내',
}

export const BROADCAST_NOTICE_HINT: Record<BroadcastNoticeType, string> = {
  MAKEUP: '예: 내일 13시, 3층 강의실에서 보강합니다.',
  SCHEDULE: '예: 이번 주 수업은 토요일 오전 10시예요.',
  PREP: '예: 학습지와 필기구를 꼭 챙겨 주세요.',
  PROGRESS: '예: 오늘은 3단원까지 진행했어요.',
}

export const BROADCAST_CHAR_LIMIT = 1000

/** 서버 `renderBroadcastMessage`와 같은 본문. 버튼은 세지 않는다. */
export function renderBroadcastMessage(
  academyName: string,
  teacherName: string,
  studentName: string,
  noticeType: BroadcastNoticeType,
  body: string,
): string {
  const middle = BROADCAST_NOTICE_MIDDLE[noticeType]
  return `안녕하세요. ${academyName} ${teacherName}입니다.\n${studentName} 학생의 ${middle}입니다.\n\n${body}`
}

export function broadcastCharCount(text: string): number {
  return Array.from(text).length
}

/** 서버 `academyNameForMemberships`와 같다. 진행 중 소속 반이 여러 개면 id가 가장 작은 반. */
export function academyNameForStudent(
  studentId: number,
  classes: ReadonlyArray<{ id: number; academy_name: string }>,
  classStudentIds: Readonly<Record<number, readonly number[]>>,
): string {
  const memberships = classes
    .filter((cls) => (classStudentIds[cls.id] ?? []).includes(studentId))
    .sort((a, b) => a.id - b.id)
  return memberships.find((cls) => cls.academy_name.trim())?.academy_name.trim() ?? ''
}
