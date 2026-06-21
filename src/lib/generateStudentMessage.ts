import type { LessonStudent } from '@/types/lessonStudent'
import { itemRef } from '@/lib/lessonItemRef'

export interface MessageContext {
  academyName: string
  teacherName: string
  className: string
  lessonDate: string
}

interface ItemMeta {
  id: number
  source?: 'template' | 'adhoc'
  label: string
}

export function generateStudentMessage(
  student: LessonStudent,
  commonItems: ItemMeta[],
  commonValues: Record<string, string>,
  individualItems: ItemMeta[],
  context: MessageContext,
): string {
  const commonLines = commonItems
    .map(
      (item) =>
        `• ${item.label}: ${commonValues[itemRef(item.source ?? 'template', item.id)] || '-'}`,
    )
    .join('\n')

  const individualLines = individualItems
    .map((meta) => {
      const found = student.items.find(
        (i) => i.item_id === meta.id && i.source === (meta.source ?? 'template'),
      )
      if (!found) return `• ${meta.label}: -`
      if (found.is_completed === true) return `• ${meta.label}: 완료`
      if (found.is_completed === false) return `• ${meta.label}: 미완료`
      return `• ${meta.label}: ${found.value || '-'}`
    })
    .join('\n')

  const header = `안녕하세요, ${context.academyName} ${context.teacherName ? context.teacherName + ' 강사' : ''}입니다.\n${context.className} ${context.lessonDate} 수업 결과입니다.`

  const sections = [header]
  if (commonLines) sections.push(commonLines)
  if (individualLines) sections.push(`• 출결: ${student.attendance || '미입력'}\n${individualLines}`)
  else sections.push(`• 출결: ${student.attendance || '미입력'}`)
  sections.push('감사합니다.')

  return sections.join('\n\n')
}