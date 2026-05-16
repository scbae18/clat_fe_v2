/** API completion_rate는 0~1. 표시용 정수 퍼센트(0~100). */
export function formatCompletionRatePercent(rate: number | null | undefined): number {
  if (rate == null || Number.isNaN(rate)) return 0
  return Math.round(rate * 100)
}

/**
 * 명시적 완료/미완료 건수로 완료율(0~1) 계산.
 * 미완료 0건이면 1(100%). null(미선택)은 분모에서 제외.
 */
export function completionRateFromCounts(completed: number, incomplete: number): number {
  if (incomplete <= 0) return 1
  const tracked = completed + incomplete
  if (tracked <= 0) return 1
  return Math.round((completed / tracked) * 100) / 100
}
