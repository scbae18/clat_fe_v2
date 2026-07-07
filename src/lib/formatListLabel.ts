/** Short label for lists (e.g. "A반 외 2") with full text for tooltips */
export function formatListLabel(
  items: string[],
  emptyLabel = '-',
): { display: string; full: string } {
  const filtered = items.map((s) => s.trim()).filter(Boolean)
  const full = filtered.length > 0 ? filtered.join(', ') : emptyLabel
  if (filtered.length <= 1) {
    return { display: full, full }
  }
  return { display: `${filtered[0]} 외 ${filtered.length - 1}`, full }
}
