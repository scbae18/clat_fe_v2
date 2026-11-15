/** 선택형·텍스트형 열 내용. 학생 값 뒤에 구분자를 붙여 전원 같은 내용을 둔다. */

const COLUMN_NOTE_SEP = '\u001e'

export function splitColumnNote(raw: string | null | undefined): { value: string; note: string } {
  const text = String(raw ?? '')
  const index = text.indexOf(COLUMN_NOTE_SEP)
  if (index < 0) return { value: text, note: '' }
  return { value: text.slice(0, index), note: text.slice(index + COLUMN_NOTE_SEP.length) }
}

export function joinColumnNote(value: string, note: string): string {
  if (note === '') return value
  return `${value}${COLUMN_NOTE_SEP}${note}`
}

export function columnNoteDraft(raw: string | null | undefined): string {
  return splitColumnNote(raw).note
}
