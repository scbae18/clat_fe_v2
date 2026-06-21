import * as XLSX from 'xlsx'
import type { LessonStudent } from '@/types/lessonStudent'
import { generateStudentMessage } from './generateStudentMessage'
import { itemRef } from '@/lib/lessonItemRef'

interface CommonItem {
  id: number
  source?: 'template' | 'adhoc'
  label: string
}

interface LessonExportOptions {
  title: string
  commonItems: CommonItem[]
  commonValues: Record<string, string>
  students: LessonStudent[]
  individualItems: CommonItem[]
  context: {
    academyName: string
    teacherName: string
    className: string
    lessonDate: string
  }
}

export function exportLessonExcel({
  title,
  commonItems,
  commonValues,
  students,
  individualItems,
  context,
}: LessonExportOptions) {
  const commonRows = commonItems.map((item) => [
    item.label,
    commonValues[itemRef(item.source ?? 'template', item.id)] ?? '',
  ])

  const individualHeaders = ['이름', '출결', ...individualItems.map((i) => i.label)]

  const studentRows = students.map((s) => {
    const itemValues = individualItems.map((meta) => {
      const found = s.items.find(
        (i) => i.item_id === meta.id && i.source === (meta.source ?? 'template'),
      )
      if (!found) return ''
      if (found.is_completed === true) return '완료'
      if (found.is_completed === false) return '미완료'
      return found.value || ''
    })
    return [s.name, s.attendance ?? '미입력', ...itemValues]
  })

  const ws = XLSX.utils.aoa_to_sheet([
    [title],
    [],
    ['공통 내용'],
    ...commonRows,
    [],
    ['개별 내용'],
    individualHeaders,
    ...studentRows,
  ])

  const wsMessages = XLSX.utils.aoa_to_sheet([
    ['이름', '문자 내용'],
    ...students.map((s) => [
      s.name,
      generateStudentMessage(s, commonItems, commonValues, individualItems, context),
    ]),
  ])

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '수업 결과')
  XLSX.utils.book_append_sheet(wb, wsMessages, '문자 내용')
  XLSX.writeFile(wb, '수업결과.xlsx')
}