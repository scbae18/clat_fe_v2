import EditIcon from '@/assets/icons/icon-edit.svg'
import {
  infoGridStyle,
  tableWrapStyle,
  tableStyle,
  thStyle,
  tdValueStyle,
  tdEditStyle,
  valueLineStyle,
  valueTextStyle,
  pencilButtonStyle,
  cellInputStyle,
  dayGroupStyle,
  dayButtonRecipe,
} from './ClassInfoTable.css'

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토']
const DAY_OPTIONS = [
  { label: '월', value: 1 },
  { label: '화', value: 2 },
  { label: '수', value: 3 },
  { label: '목', value: 4 },
  { label: '금', value: 5 },
  { label: '토', value: 6 },
  { label: '일', value: 0 },
]

export type ClassInfoField = 'name' | 'academy' | 'days' | 'time'

interface ClassInfoTableProps {
  name: string
  academyName: string
  dayOfWeek: number[]
  lessonTime: string
  editing: boolean
  activeField: ClassInfoField | null
  onEditField: (field: ClassInfoField) => void
  onChangeName: (value: string) => void
  onChangeAcademy: (value: string) => void
  onChangeTime: (value: string) => void
  onToggleDay: (day: number) => void
}

function formatDays(days: number[]) {
  return [...days]
    .sort((a, b) => a - b)
    .map((day) => DAY_NAMES[day])
    .filter(Boolean)
    .join('·')
}

function DisplayValue({
  label,
  value,
  editing,
  field,
  onEditField,
}: {
  label: string
  value: string
  editing: boolean
  field: ClassInfoField
  onEditField: (field: ClassInfoField) => void
}) {
  const shown = value.trim() ? value : '-'
  return (
    <td className={tdValueStyle}>
      <span className={valueLineStyle}>
        <span className={valueTextStyle} title={shown}>
          {shown}
        </span>
        {editing ? (
          <button
            type="button"
            className={pencilButtonStyle}
            aria-label={`${label} 수정`}
            onClick={() => onEditField(field)}
          >
            <EditIcon width={16} height={16} />
          </button>
        ) : null}
      </span>
    </td>
  )
}

export default function ClassInfoTable({
  name,
  academyName,
  dayOfWeek,
  lessonTime,
  editing,
  activeField,
  onEditField,
  onChangeName,
  onChangeAcademy,
  onChangeTime,
  onToggleDay,
}: ClassInfoTableProps) {
  const dayLabel = formatDays(dayOfWeek)

  return (
    <div className={infoGridStyle}>
      <div className={tableWrapStyle}>
        <table className={tableStyle}>
          <colgroup>
            <col style={{ width: '116px' }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th className={thStyle}>반 이름</th>
              {activeField === 'name' ? (
                <td className={tdEditStyle}>
                  <input
                    className={cellInputStyle}
                    value={name}
                    autoFocus
                    aria-label="반 이름"
                    onChange={(event) => onChangeName(event.target.value)}
                  />
                </td>
              ) : (
                <DisplayValue
                  label="반 이름"
                  value={name}
                  editing={editing}
                  field="name"
                  onEditField={onEditField}
                />
              )}
            </tr>
            <tr>
              <th className={thStyle}>학원명</th>
              {activeField === 'academy' ? (
                <td className={tdEditStyle}>
                  <input
                    className={cellInputStyle}
                    value={academyName}
                    autoFocus
                    aria-label="학원명"
                    onChange={(event) => onChangeAcademy(event.target.value)}
                  />
                </td>
              ) : (
                <DisplayValue
                  label="학원명"
                  value={academyName}
                  editing={editing}
                  field="academy"
                  onEditField={onEditField}
                />
              )}
            </tr>
          </tbody>
        </table>
      </div>
      <div className={tableWrapStyle}>
        <table className={tableStyle}>
          <colgroup>
            <col style={{ width: '116px' }} />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th className={thStyle}>수업 요일</th>
              {activeField === 'days' ? (
                <td className={tdEditStyle}>
                  <div className={dayGroupStyle} role="group" aria-label="수업 요일">
                    {DAY_OPTIONS.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        className={dayButtonRecipe({ selected: dayOfWeek.includes(day.value) })}
                        aria-pressed={dayOfWeek.includes(day.value)}
                        onClick={() => onToggleDay(day.value)}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </td>
              ) : (
                <DisplayValue
                  label="수업 요일"
                  value={dayLabel}
                  editing={editing}
                  field="days"
                  onEditField={onEditField}
                />
              )}
            </tr>
            <tr>
              <th className={thStyle}>수업 시간</th>
              {activeField === 'time' ? (
                <td className={tdEditStyle}>
                  <input
                    className={cellInputStyle}
                    value={lessonTime}
                    autoFocus
                    aria-label="수업 시간"
                    placeholder="예) 16:00 - 17:30"
                    maxLength={50}
                    onChange={(event) => onChangeTime(event.target.value)}
                  />
                </td>
              ) : (
                <DisplayValue
                  label="수업 시간"
                  value={lessonTime}
                  editing={editing}
                  field="time"
                  onEditField={onEditField}
                />
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
