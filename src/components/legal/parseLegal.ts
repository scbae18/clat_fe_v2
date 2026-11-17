export type ListItem = { text: string; children: string[] }

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string; id: string }
  | { type: 'ol'; items: ListItem[] }
  | { type: 'ul'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

export type ParsedLegal = {
  title: string
  effectiveDate: string | null
  blocks: LegalBlock[]
}

function headingId(text: string, used: Map<string, number>): string {
  const base = text.includes('처리 위탁과 재위탁')
    ? 'entrust'
    : text.replace(/[^\w가-힣]+/g, '-').replace(/^-|-$/g, '') || 'section'
  const seen = used.get(base) ?? 0
  used.set(base, seen + 1)
  return seen === 0 ? base : `${base}-${seen + 1}`
}

function splitRow(line: string): string[] {
  const cells = line.split('|').map((cell) => cell.trim())
  if (cells[0] === '') cells.shift()
  if (cells[cells.length - 1] === '') cells.pop()
  return cells
}

function isSeparator(line: string): boolean {
  const cells = splitRow(line)
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

export function parseLegal(source: string): ParsedLegal {
  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const used = new Map<string, number>()
  let title = ''
  let effectiveDate: string | null = null
  const blocks: LegalBlock[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    if (!line.trim()) {
      index += 1
      continue
    }
    if (line.startsWith('# ')) {
      title = line.slice(2).trim()
      index += 1
      continue
    }
    if (line.startsWith('시행일:')) {
      effectiveDate = line.slice('시행일:'.length).trim()
      index += 1
      continue
    }
    if (line.startsWith('## ')) {
      const text = line.slice(3).trim()
      blocks.push({ type: 'h2', text, id: headingId(text, used) })
      index += 1
      continue
    }
    if (line.startsWith('### ')) {
      const text = line.slice(4).trim()
      blocks.push({ type: 'h3', text, id: headingId(text, used) })
      index += 1
      continue
    }
    if (line.startsWith('|') && index + 1 < lines.length && isSeparator(lines[index + 1])) {
      const headers = splitRow(line)
      index += 2
      const rows: string[][] = []
      while (index < lines.length && lines[index].startsWith('|')) {
        rows.push(splitRow(lines[index]))
        index += 1
      }
      blocks.push({ type: 'table', headers, rows })
      continue
    }
    if (/^\d+\.\s/.test(line)) {
      const items: ListItem[] = []
      while (index < lines.length && /^\d+\.\s/.test(lines[index])) {
        const text = lines[index].replace(/^\d+\.\s/, '').trim()
        const children: string[] = []
        index += 1
        while (index < lines.length && /^\s+-\s/.test(lines[index])) {
          children.push(lines[index].replace(/^\s+-\s/, '').trim())
          index += 1
        }
        items.push({ text, children })
      }
      blocks.push({ type: 'ol', items })
      continue
    }
    if (/^-\s/.test(line)) {
      const items: string[] = []
      while (index < lines.length && /^-\s/.test(lines[index])) {
        items.push(lines[index].replace(/^-\s/, '').trim())
        index += 1
      }
      blocks.push({ type: 'ul', items })
      continue
    }
    blocks.push({ type: 'p', text: line.trim() })
    index += 1
  }

  return { title, effectiveDate, blocks }
}
