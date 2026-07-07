import { tableStyle, thStyle, tdStyle } from './ClassInfoTable.css'
import { formatListLabel } from '@/lib/formatListLabel'

interface ClassInfo {
  academyName: string
  schedule: string
  status: '진행 중' | '종료'
  templates: { id: number; name: string }[]
}

export default function ClassInfoTable({ academyName, schedule, status, templates }: ClassInfo) {
  const templateLabel = formatListLabel(templates.map((t) => t.name))

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <table className={tableStyle}>
        <colgroup>
          <col style={{ width: '116px' }} />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th className={thStyle}>학원명</th>
            <td className={tdStyle} title={academyName}>
              {academyName}
            </td>
          </tr>
          <tr>
            <th className={thStyle}>수업 상태</th>
            <td className={tdStyle}>{status}</td>
          </tr>
        </tbody>
      </table>
      <table className={tableStyle}>
        <colgroup>
          <col style={{ width: '116px' }} />
          <col />
        </colgroup>
        <tbody>
          <tr>
            <th className={thStyle}>수업 요일</th>
            <td className={tdStyle} title={schedule}>
              {schedule}
            </td>
          </tr>
          <tr>
            <th className={thStyle}>수업 템플릿</th>
            <td className={tdStyle} title={templateLabel.full}>
              {templateLabel.display}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}