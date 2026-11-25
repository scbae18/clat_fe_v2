'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Text from '@/components/common/Text'
import clatIcon from '@/assets/images/clat-alimtalk-icon.png'
import LessonSectionHeading from '@/app/(main)/lesson/[id]/_components/LessonSectionHeading/LessonSectionHeading'
import {
  tableWrapStyle as commonWrapStyle,
  tableStyle as commonTableStyle,
  thStyle as commonThStyle,
  tdStyle as commonTdStyle,
  inputCellWrapStyle,
  inputStyle as commonInputStyle,
} from '@/app/(main)/lesson/[id]/_components/CommonContent/CommonContent.css'
import { sectionStyle as lessonSectionStyle } from '@/app/(main)/lesson/[id]/lessonDetail.css'
import {
  AttendanceCell,
  CompletionCell,
  ScoreEarnedCell,
  SelectCell,
  TextInputCell,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/LessonTableCells'
import { AttendanceColumnHeader } from '@/app/(main)/lesson/[id]/_components/LessonTableSection/AttendanceColumnHeader'
import { DynamicColumnHeader } from '@/app/(main)/lesson/[id]/_components/LessonTableSection/DynamicColumnHeader'
import { getScoreColumnMax, isScoreItem } from '@/app/(main)/lesson/[id]/_components/LessonTableSection/lessonTableUtils'
import {
  attendanceCellStyle,
  nameCellStyle,
  nameCellRowStyle,
  nameStickyCellStyle,
  tableStyle as lessonTableStyle,
  tableWrapStyle as lessonTableWrapStyle,
  tdCompactStyle,
  tdStyle,
  thCompactStyle,
} from '@/app/(main)/lesson/[id]/_components/LessonTableSection/LessonTable.css'
import { alimtalkService } from '@/services/alimtalk'
import { classService, type Class } from '@/services/class'
import { lessonItemRef, matchesLessonItem } from '@/lib/lessonItemRef'
import type { LessonItemDetail } from '@/services/lesson'
import type { Attendance, CompletionStatus, LessonStudent } from '@/types/lessonStudent'
import {
  LESSON_ALIMTALK_CTA_LABEL,
  LESSON_ALIMTALK_FRAME_FOOTER,
  fillLessonAlimtalkFrameHeader,
} from '@/lib/lessonAlimtalkFrame'
import {
  kakaoAppLabel,
  kakaoArrive,
  kakaoBody,
  kakaoBubble,
  kakaoBubbleRow,
  kakaoCta,
  kakaoLogo,
  kakaoLogoRow,
  kakaoMessage,
  kakaoShell,
  kakaoTime,
} from '@/app/(main)/lesson/[id]/_components/AlimtalkSendModal/AlimtalkSendModal.css'
import { useUserStore } from '@/stores/userStore'
import type { TemplateItem } from '../../_types/template'
import {
  captionMarkStyle,
  captionStyle,
  emptyHintStyle,
  kakaoFrameText,
  fadeStyle,
  hintStyle,
  lessonStackStyle,
  panelStyle,
  ruleStyle,
  scrollFrameStyle,
  tabButtonStyle,
  tabListStyle,
  tabUnderlineStyle,
} from './TemplatePreview.css'

const SAMPLE_STUDENTS = [
  { id: 1, name: '홍길동' },
  { id: 2, name: '이영희' },
  { id: 3, name: '박주원' },
]

type PreviewTab = 'lesson' | 'alimtalk'

interface TemplatePreviewProps {
  commonItems: TemplateItem[]
  individualItems: TemplateItem[]
  messageOrder: string[]
  allItemsMap: Map<string, TemplateItem>
}

function plainLabel(label: string) {
  return label.replace(' *', '')
}

const PREVIEW_STUDENT_NAME = '홍길동'
const PREVIEW_DATE = '11월 25일'

function pickPreviewClass(classes: Class[]) {
  return classes.find((item) => !item.ended_at) ?? classes[0] ?? null
}

function previewClock(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h12',
  }).formatToParts(date)
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? ''
  const period = read('dayPeriod').toUpperCase() === 'AM' ? '오전' : '오후'
  return `${period} ${read('hour')}:${read('minute')}`
}

function lessonItemType(item: TemplateItem): LessonItemDetail['item_type'] {
  if (item.itemType === 'number') return 'SCORE'
  if (item.itemType === 'choice') return 'SELECT'
  if (item.itemType === 'completion') return 'COMPLETE'
  if (item.itemType === 'attendance') return 'ATTENDANCE'
  return 'TEXT'
}

function buildLessonItems(items: TemplateItem[]): LessonItemDetail[] {
  return items.map((item, index) => ({
    id: index + 1,
    source: 'template',
    name: item.itemType === 'attendance' ? '출결' : plainLabel(item.label),
    item_type: lessonItemType(item),
    is_common: false,
    include_in_message: item.isInMessage,
    is_partial: false,
    sort_order: index,
    options: item.choices?.map((label, optionIndex) => ({
      id: optionIndex + 1,
      label,
      sort_order: optionIndex,
    })),
  }))
}

function buildStudents(items: LessonItemDetail[]): LessonStudent[] {
  const columns = items.filter((item) => item.item_type !== 'ATTENDANCE')
  return SAMPLE_STUDENTS.map((student) => ({
    id: student.id,
    name: student.name,
    attendance: null,
    items: columns.map((item) => ({
      item_id: item.id,
      source: 'template' as const,
      value: '',
      is_completed: null,
    })),
  }))
}

function messageValue(item: TemplateItem) {
  if (item.itemType === 'attendance') return '출석'
  if (item.itemType === 'number') return '87점'
  if (item.itemType === 'completion') return '완료'
  if (item.itemType === 'choice') return item.choices?.[0] ?? ''
  return ''
}

function LessonPreview({
  commonItems,
  individualItems,
  messageOrder,
}: {
  commonItems: TemplateItem[]
  individualItems: TemplateItem[]
  messageOrder: string[]
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [overflow, setOverflow] = useState(false)
  const [nameColWidth, setNameColWidth] = useState(96)
  const [attendanceColWidth, setAttendanceColWidth] = useState(172)
  const activeCommon = commonItems.filter((item) => item.isActive && item.label.trim() !== '')
  const activeIndividual = individualItems.filter((item) => item.isActive)
  const individualKey = activeIndividual
    .map((item) => `${item.id}:${item.itemType}:${item.label}:${item.choices?.join(',') ?? ''}`)
    .join('|')
  const initialItems = useMemo(
    () => buildLessonItems(activeIndividual),
    [individualKey],
  )
  const templateIdByLessonId = useMemo(() => {
    const map = new Map<number, string>()
    activeIndividual.forEach((item, index) => {
      map.set(index + 1, item.id)
    })
    return map
  }, [individualKey])
  const [lessonItems, setLessonItems] = useState(initialItems)
  const [students, setStudents] = useState(() => buildStudents(initialItems))
  const [extraOptions, setExtraOptions] = useState<Array<{ id: number; label: string }>>([])

  useEffect(() => {
    setLessonItems(initialItems)
    setStudents(buildStudents(initialItems))
    setExtraOptions([])
  }, [initialItems])

  const dynamicItems = useMemo(() => {
    const rank = new Map(messageOrder.map((id, index) => [id, index]))
    return lessonItems
      .filter((item) => item.item_type !== 'ATTENDANCE')
      .slice()
      .sort((a, b) => {
        const left = rank.get(templateIdByLessonId.get(a.id) ?? '') ?? Number.MAX_SAFE_INTEGER
        const right = rank.get(templateIdByLessonId.get(b.id) ?? '') ?? Number.MAX_SAFE_INTEGER
        return left - right
      })
  }, [lessonItems, messageOrder, templateIdByLessonId])
  const tableContentWidth = nameColWidth + attendanceColWidth + dynamicItems.length * 176
  const tableMinWidth = Math.max(720, tableContentWidth)
  const allAttend = students.length > 0 && students.every((student) => student.attendance === '출석')
  const nameKey = students.map((student) => student.name).join('|')

  useLayoutEffect(() => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.font = '500 14px Pretendard, sans-serif'
    const labels = ['학생', ...students.map((student) => student.name)]
    const textWidth = labels.reduce((max, label) => Math.max(max, ctx.measureText(label).width), 0)
    const next = Math.ceil(textWidth) + 16 + 12 + 28
    setNameColWidth((prev) => (prev === next ? prev : next))
  }, [nameKey])

  const extraKey = extraOptions.map((option) => option.label).join('|')

  useLayoutEffect(() => {
    const table = scrollerRef.current?.querySelector('table')
    const cell = table?.querySelector('tbody td:nth-child(2)')
    if (!cell) return
    const core = cell.querySelector(':scope > div > span')
    const extras = [...cell.querySelectorAll(':scope > div > button')]
    const coreWidth = core?.getBoundingClientRect().width ?? 0
    const extraWidth = extras.reduce(
      (sum, button) => sum + 4 + button.getBoundingClientRect().width,
      0,
    )
    const headerRow = table?.querySelector('thead th:nth-child(2) > div > div')
    const content = Math.max(coreWidth + extraWidth, headerRow?.scrollWidth ?? 0)
    const styles = getComputedStyle(cell)
    const pad = (parseFloat(styles.paddingLeft) || 0) + (parseFloat(styles.paddingRight) || 0)
    const border =
      (parseFloat(styles.borderLeftWidth) || 0) + (parseFloat(styles.borderRightWidth) || 0)
    const next = Math.ceil(content + pad + border) + 2
    if (next > 0) setAttendanceColWidth((prev) => (prev === next ? prev : next))
  }, [extraKey, individualKey, nameColWidth])

  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) {
      setOverflow(false)
      return
    }
    const measure = () => setOverflow(el.scrollWidth > el.clientWidth + 1)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    if (el.firstElementChild) observer.observe(el.firstElementChild)
    return () => observer.disconnect()
  }, [individualKey, extraOptions.length, nameColWidth, attendanceColWidth])

  const setAttendance = (studentId: number, value: Attendance) => {
    setStudents((prev) =>
      prev.map((student) => (student.id === studentId ? { ...student, attendance: value } : student)),
    )
  }

  return (
    <div className={lessonStackStyle}>
      {activeCommon.length > 0 ? (
        <div className={lessonSectionStyle}>
          <LessonSectionHeading title="공통 내용" />
          <div className={commonWrapStyle}>
            <table className={commonTableStyle}>
              <tbody>
                {activeCommon.map((item) => (
                  <tr key={item.id}>
                    <th className={commonThStyle}>{plainLabel(item.label)}</th>
                    <td className={commonTdStyle}>
                      <div className={inputCellWrapStyle}>
                        <textarea
                          className={commonInputStyle}
                          rows={1}
                          readOnly
                          placeholder="내용을 입력해주세요"
                          aria-label={plainLabel(item.label)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className={lessonSectionStyle}>
        <LessonSectionHeading title="개별 내용" />
        {lessonItems.length === 0 ? (
          <div className={emptyHintStyle}>개별 항목이 없어요</div>
        ) : (
          <div className={scrollFrameStyle}>
            <div ref={scrollerRef} className={lessonTableWrapStyle}>
              <table
                className={lessonTableStyle}
                style={{
                  minWidth: tableMinWidth,
                  width: dynamicItems.length === 0 ? tableContentWidth : undefined,
                }}
              >
                <colgroup>
                  <col style={{ width: nameColWidth }} />
                  <col style={{ width: attendanceColWidth }} />
                  {dynamicItems.map((item) => (
                    <col key={lessonItemRef(item)} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <th className={`${thCompactStyle} ${nameStickyCellStyle}`}>학생</th>
                    <AttendanceColumnHeader
                      extraOptions={extraOptions}
                      allAttend={allAttend}
                      onToggleAllAttend={() => {
                        setStudents((prev) =>
                          prev.map((student) => ({
                            ...student,
                            attendance: allAttend ? null : '출석',
                          })),
                        )
                      }}
                      onAddOption={(label) => {
                        setExtraOptions((prev) => [...prev, { id: prev.length + 1, label }])
                      }}
                      onRemoveOption={(optionId) => {
                        setExtraOptions((prev) => prev.filter((option) => option.id !== optionId))
                        setStudents((prev) =>
                          prev.map((student) => {
                            const removed = extraOptions.find((option) => option.id === optionId)
                            if (!removed || student.attendance !== removed.label) return student
                            return { ...student, attendance: null }
                          }),
                        )
                      }}
                    />
                    {dynamicItems.map((item) => (
                      <DynamicColumnHeader
                        key={lessonItemRef(item)}
                        item={item}
                        students={students}
                        onChange={setStudents}
                        canRemove={false}
                        onTogglePartial={(target, isPartial) => {
                          setLessonItems((prev) =>
                            prev.map((entry) =>
                              entry.id === target.id ? { ...entry, is_partial: isPartial } : entry,
                            ),
                          )
                        }}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className={`${tdCompactStyle} ${nameStickyCellStyle}`}>
                        <div className={nameCellRowStyle}>
                          <span className={nameCellStyle}>{student.name}</span>
                        </div>
                      </td>
                      <td className={`${tdStyle} ${attendanceCellStyle}`}>
                        <AttendanceCell
                          value={student.attendance}
                          extraLabels={extraOptions.map((option) => option.label)}
                          onChange={(value) => setAttendance(student.id, value)}
                        />
                      </td>
                      {dynamicItems.map((item) => {
                        const cell = student.items.find((row) => matchesLessonItem(row, item))
                        if (item.item_type === 'SELECT') {
                          return (
                            <td key={lessonItemRef(item)} className={tdStyle}>
                              <SelectCell
                                options={item.options ?? []}
                                value={cell?.value ?? ''}
                                onChange={(value) => {
                                  setStudents((prev) =>
                                    prev.map((row) =>
                                      row.id === student.id
                                        ? {
                                            ...row,
                                            items: row.items.map((entry) =>
                                              matchesLessonItem(entry, item) ? { ...entry, value } : entry,
                                            ),
                                          }
                                        : row,
                                    ),
                                  )
                                }}
                              />
                            </td>
                          )
                        }
                        if (item.item_type === 'COMPLETE') {
                          const status: CompletionStatus =
                            cell?.is_completed === true
                              ? '완료'
                              : cell?.is_completed === false
                                ? '미완료'
                                : null
                          return (
                            <td key={lessonItemRef(item)} className={tdStyle}>
                              <CompletionCell
                                value={status}
                                onChange={(value) => {
                                  setStudents((prev) =>
                                    prev.map((row) =>
                                      row.id === student.id
                                        ? {
                                            ...row,
                                            items: row.items.map((entry) =>
                                              matchesLessonItem(entry, item)
                                                ? {
                                                    ...entry,
                                                    is_completed:
                                                      value === '완료' ? true : value === '미완료' ? false : null,
                                                  }
                                                : entry,
                                            ),
                                          }
                                        : row,
                                    ),
                                  )
                                }}
                              />
                            </td>
                          )
                        }
                        if (isScoreItem(item)) {
                          return (
                            <td key={lessonItemRef(item)} className={tdStyle}>
                              <ScoreEarnedCell
                                value={cell?.value ?? ''}
                                columnMax={getScoreColumnMax(students, item)}
                                onChange={(value) => {
                                  setStudents((prev) =>
                                    prev.map((row) =>
                                      row.id === student.id
                                        ? {
                                            ...row,
                                            items: row.items.map((entry) =>
                                              matchesLessonItem(entry, item) ? { ...entry, value } : entry,
                                            ),
                                          }
                                        : row,
                                    ),
                                  )
                                }}
                              />
                            </td>
                          )
                        }
                        return (
                          <td key={lessonItemRef(item)} className={tdStyle}>
                            <TextInputCell
                              value={cell?.value ?? ''}
                              onChange={(value) => {
                                setStudents((prev) =>
                                  prev.map((row) =>
                                    row.id === student.id
                                      ? {
                                          ...row,
                                          items: row.items.map((entry) =>
                                            matchesLessonItem(entry, item) ? { ...entry, value } : entry,
                                          ),
                                        }
                                      : row,
                                  ),
                                )
                              }}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {overflow ? <div className={fadeStyle} /> : null}
          </div>
        )}
        {overflow ? <div className={hintStyle}>옆으로 넘겨서 나머지 항목 보기 →</div> : null}
      </div>
    </div>
  )
}

function fillPreviewText(text: string, samples: Record<string, string>) {
  return text.replace(/\{[^}]+\}/g, (token) => samples[token] ?? token.slice(1, -1))
}

function AlimtalkPreview({
  messageOrder,
  allItemsMap,
}: {
  messageOrder: string[]
  allItemsMap: Map<string, TemplateItem>
}) {
  const teacherName = useUserStore((state) => state.user?.name)?.trim() || '선생님'
  const [academyName, setAcademyName] = useState('학원명')
  const [className, setClassName] = useState('반 이름')
  const [savedIntro, setSavedIntro] = useState('')
  const [savedOutro, setSavedOutro] = useState('')
  const items = messageOrder
    .map((id) => allItemsMap.get(id))
    .filter(
      (item): item is TemplateItem =>
        !!item && item.isActive && item.isInMessage && (item.sendToParent || item.sendToStudent),
    )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [settings, classRes] = await Promise.all([
        alimtalkService.getSettings().catch(() => null),
        classService.getClasses().catch(() => null),
      ])
      if (cancelled) return
      setSavedIntro(settings?.intro_text ?? '')
      setSavedOutro(settings?.outro_text ?? '')
      const picked = pickPreviewClass(classRes?.data ?? [])
      if (!picked) return
      const academy = picked.academy_name.trim()
      const name = picked.name.trim()
      if (academy) setAcademyName(academy)
      if (name) setClassName(name)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const samples: Record<string, string> = {
    '{학원명}': academyName,
    '{강사명}': teacherName,
    '{학생이름}': PREVIEW_STUDENT_NAME,
    '{날짜}': PREVIEW_DATE,
    '{수업일}': PREVIEW_DATE,
    '{반이름}': className,
  }
  const frameIntro = fillLessonAlimtalkFrameHeader({
    academyName,
    teacherName,
    studentName: PREVIEW_STUDENT_NAME,
    lessonDate: PREVIEW_DATE,
  })

  return (
    <div className={kakaoShell}>
      <div className={kakaoLogoRow}>
        <Image src={clatIcon} alt="" width={36} height={36} className={kakaoLogo} />
        <span className={kakaoAppLabel}>클랫 수업 알림</span>
      </div>
      <div className={kakaoBubbleRow}>
        <div className={kakaoBubble}>
          <div className={kakaoArrive}>알림톡 도착</div>
          <div className={kakaoBody}>
            <p className={kakaoFrameText}>{frameIntro}</p>
            {savedIntro.trim() ? (
              <p className={kakaoFrameText}>{fillPreviewText(savedIntro.trim(), samples)}</p>
            ) : null}
            {items.length > 0 ? (
              <div>
                {items.map((item) => {
                  const value = messageValue(item)
                  return (
                    <p key={item.id} className={kakaoMessage}>
                      <Text variant="bodyMd" color="primary500">
                        {`■ ${plainLabel(item.label)}: `}
                      </Text>
                      {value ? (
                        <Text variant="bodyMd" color="primary500" as="span">
                          <strong>{value}</strong>
                        </Text>
                      ) : null}
                    </p>
                  )
                })}
              </div>
            ) : null}
            {savedOutro.trim() ? (
              <p className={kakaoFrameText}>{fillPreviewText(savedOutro.trim(), samples)}</p>
            ) : null}
            <p className={kakaoFrameText}>{LESSON_ALIMTALK_FRAME_FOOTER}</p>
            <div className={kakaoCta}>{LESSON_ALIMTALK_CTA_LABEL}</div>
          </div>
        </div>
        <p className={kakaoTime}>{previewClock()}</p>
      </div>
    </div>
  )
}

export default function TemplatePreview({
  commonItems,
  individualItems,
  messageOrder,
  allItemsMap,
}: TemplatePreviewProps) {
  const [tab, setTab] = useState<PreviewTab>('lesson')

  return (
    <div className={panelStyle} data-tour="template-preview">
      <div className={tabListStyle} role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'lesson'}
          data-active={tab === 'lesson'}
          className={tabButtonStyle}
          onClick={() => setTab('lesson')}
        >
          수업 입력 화면
          <span className={tabUnderlineStyle} />
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'alimtalk'}
          data-active={tab === 'alimtalk'}
          className={tabButtonStyle}
          onClick={() => setTab('alimtalk')}
        >
          알림톡
          <span className={tabUnderlineStyle} />
        </button>
      </div>
      {tab === 'lesson' ? (
        <p className={captionStyle}>템플릿 예시 모습이에요. 템플릿 적용 후 항목 추가도 가능해요.</p>
      ) : (
        <p className={captionStyle}>
          알림톡 예시예요. 왼쪽에서 항목을 바꾸면 <span className={captionMarkStyle}>■ </span>
          부분이 바뀌어요.
        </p>
      )}
      <hr className={ruleStyle} />
      {tab === 'lesson' ? (
        <LessonPreview
          commonItems={commonItems}
          individualItems={individualItems}
          messageOrder={messageOrder}
        />
      ) : (
        <AlimtalkPreview messageOrder={messageOrder} allItemsMap={allItemsMap} />
      )}
    </div>
  )
}
