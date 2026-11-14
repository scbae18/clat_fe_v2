/** SCORE 저장: "85" 또는 "85/100" (획득/만점). 열 내용은 구분자 뒤. */

const SCORE_NOTE_SEP = '\u001e'

export function splitScoreRecord(raw: string | null | undefined): { score: string; note: string } {
  const text = String(raw ?? '')
  const index = text.indexOf(SCORE_NOTE_SEP)
  if (index < 0) return { score: text, note: '' }
  return { score: text.slice(0, index), note: text.slice(index + SCORE_NOTE_SEP.length) }
}

export function joinScoreRecord(score: string, note: string): string {
  if (note === '') return score
  return `${score}${SCORE_NOTE_SEP}${note}`
}

export function scoreNoteDraft(raw: string | null | undefined): string {
  return splitScoreRecord(raw).note
}

export function formatScoreStorageLabel(raw: string | null | undefined): string {
  const { score, note } = splitScoreRecord(raw)
  const scoreText = score.trim()
  const noteText = note.trim()
  if (scoreText && noteText) return `${scoreText} (${noteText})`
  return scoreText || noteText
}

export type ParsedLessonScore = {
  earned: number | null
  max: number | null
  /** 만점이 있으면 0~100 환산 */
  percent: number | null
}

export function parseLessonScoreValue(raw: string | null | undefined): ParsedLessonScore | null {
  const s = splitScoreRecord(raw).score.trim()
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

/** 반 통계(평균·최고): 항상 획득 점수. 4/10이면 4 — 환산% 아님 */
export function cohortScoreMetric(raw: string | null | undefined): number | null {
  const p = parseLessonScoreValue(raw)
  if (!p || p.earned == null) return null
  return p.earned
}

export function splitScoreStorage(raw: string): { earned: string; max: string } {
  const t = splitScoreRecord(raw).score.trim()
  const p = t.split(/\s*\/\s*/)
  if (p.length >= 2) return { earned: (p[0] ?? '').trim(), max: (p[1] ?? '').trim() }
  return { earned: t, max: '' }
}

export function joinScoreStorage(earned: string, max: string, note = ''): string {
  const e = earned.trim()
  const m = max.trim()
  const score = m ? (e === '' ? `/${m}` : `${e}/${m}`) : e
  return joinScoreRecord(score, note)
}

/** 만점만 있거나 비어 있으면 미입력(문자 미응시와 동일) */
export function isScoreUnanswered(raw: string | null | undefined): boolean {
  const s = String(raw ?? '').trim()
  if (!s) return true
  const { earned } = splitScoreStorage(s)
  return earned === ''
}
