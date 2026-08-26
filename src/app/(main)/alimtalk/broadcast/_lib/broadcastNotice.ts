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
  MAKEUP: '예: 내일 오후 7시, 3층에서 보강합니다.',
  SCHEDULE: '예: 이번 주 수업은 토요일 오전 10시입니다.',
  PREP: '예: 자습서와 필기구를 챙겨 와 주세요.',
  PROGRESS: '예: 오늘은 3단원까지 나갔습니다.',
}

export function renderBroadcastPreviewHeader(noticeType: BroadcastNoticeType): string {
  const middle = BROADCAST_NOTICE_MIDDLE[noticeType]
  return `안녕하세요. {학원명} {강사명}입니다.\n{학생이름} 학생의 ${middle}입니다.`
}
