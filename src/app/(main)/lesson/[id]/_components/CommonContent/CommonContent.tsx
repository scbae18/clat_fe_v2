import { tableStyle, thStyle, tdStyle, inputStyle } from './CommonContent.css'

interface CommonItem {
  id: number
  label: string
}

interface CommonContentSectionProps {
  items: CommonItem[]
  values: Record<number, string>
  onChange: (id: number, value: string) => void
}

export default function CommonContent({ items, values, onChange }: CommonContentSectionProps) {
  return (
    <table className={tableStyle}>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <th className={thStyle}>{item.label}</th>
            <td className={tdStyle}>
              <textarea
                className={inputStyle}
                value={values[item.id] ?? ''}
                onChange={(e) => onChange(item.id, e.target.value)}
                placeholder="내용을 입력해주세요"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}