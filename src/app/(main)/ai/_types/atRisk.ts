/**
 * AI 조교 — 퇴원 위험 감지 도메인 타입 정의 (FE 전용 / 목업 단계)
 * 추후 백엔드 연동 시 동일한 형태로 매핑되도록 설계.
 */

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'NEW'
export type RiskDecision = 'ACTED' | 'SNOOZED' | 'DISMISSED'

export type SignalCode =
  | 'ABSENCE_RATE'
  | 'SCORE_TREND'
  | 'HOMEWORK_MISS'
  | 'NEGATIVE_NOTE'
  | 'INACTIVITY'

export interface RiskSignal {
  code: SignalCode
  label: string
  value: string
  threshold: string
  points: number
  detail?: string
}

export interface RiskActionSuggestion {
  id: string
  label: string
  type: 'memo' | 'note' | 'praise' | 'review'
}

export interface RiskBrief {
  oneLiner: string
  causes: string[]
  actions: RiskActionSuggestion[]
}

export interface RiskSnapshot {
  studentId: number
  studentName: string
  className: string
  schoolName?: string
  grade?: string
  joinedDays: number
  level: RiskLevel
  score: number
  scoreDelta: number
  signals: RiskSignal[]
  topSignalCodes: SignalCode[]
  brief: RiskBrief
  computedAt: string
}

export interface RiskHistoryPoint {
  date: string
  score: number
  level: RiskLevel
}

export interface RiskTimelineItem {
  date: string
  score: number
  level: RiskLevel
  oneLiner: string
  decision?: RiskDecision
}

export interface RecentLessonSummary {
  date: string
  templateName: string
  score?: number | null
  homeworkCompleted?: boolean | null
  attendance: '출석' | '지각' | '결석' | null
  note?: string
}

export interface DismissedStudent {
  studentId: number
  studentName: string
  className: string
  dismissedAt: string
  snoozeUntil: string | null
}
