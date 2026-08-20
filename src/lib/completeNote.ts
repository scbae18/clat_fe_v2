/** COMPLETE column memo. Status labels are not treated as a note. */
export function completeItemNote(raw: string | null | undefined): string | null {
  const s = String(raw ?? '').trim()
  if (!s) return null
  if (s === '완료' || s === '미완료') return null
  return s
}
