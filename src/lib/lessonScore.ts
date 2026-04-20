/** SCORE 저장: "85" 또는 "85/100" (획득/만점) */

export type ParsedLessonScore = {
  earned: number | null
  max: number | null
  /** 만점이 있으면 0~100 환산 */
  percent: number | null
}

export function parseLessonScoreValue(raw: string | null | undefined): ParsedLessonScore | null {
  const s = String(raw ?? '').trim()
  if (!s) return null
  const parts = s.split(/\s*\/\s*/)
  if (parts.length >= 2) {
    const earned = parseFloat(String(parts[0]).replace(/[^0-9.-]/g, ''))
    const max = parseFloat(String(parts[1]).replace(/[^0-9.-]/g, ''))
    if (!Number.isFinite(earned) || !Number.isFinite(max) || max <= 0) return null
    return { earned, max, percent: (earned / max) * 100 }
  }
  const earned = parseFloat(s.replace(/[^0-9.-]/g, ''))
  if (!Number.isFinite(earned)) return null
  return { earned, max: null, percent: null }
}

/** 반 통계용: 만점 있으면 환산%, 없으면 원점수 */
export function cohortScoreMetric(raw: string | null | undefined): number | null {
  const p = parseLessonScoreValue(raw)
  if (!p || p.earned == null) return null
  return p.percent != null ? p.percent : p.earned
}

export function splitScoreStorage(raw: string): { earned: string; max: string } {
  const t = String(raw).trim()
  const p = t.split(/\s*\/\s*/)
  if (p.length >= 2) return { earned: (p[0] ?? '').trim(), max: (p[1] ?? '').trim() }
  return { earned: t, max: '' }
}

export function joinScoreStorage(earned: string, max: string): string {
  const e = earned.trim()
  const m = max.trim()
  if (m) return `${e === '' ? '0' : e}/${m}`
  return e
}
