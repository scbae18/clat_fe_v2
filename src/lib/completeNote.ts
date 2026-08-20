const STATUS_LABELS = new Set(['완료', '미완료'])

/** COMPLETE column memo. Status labels are not treated as a note. */
export function completeItemNote(raw: string | null | undefined): string | null {
  const s = String(raw ?? '').trim()
  if (!s) return null
  if (STATUS_LABELS.has(s)) return null
  return s
}

/**
 * Draft shown in the COMPLETE header input.
 * Does not trim so spaces can be typed; still hides exact status labels.
 */
export function completeItemNoteDraft(raw: string | null | undefined): string | null {
  const s = String(raw ?? '')
  if (!s) return null
  if (s === '완료' || s === '미완료') return null
  return s
}
