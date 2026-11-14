'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import ChevronLeftIcon from '@/assets/icons/icon-chevron-left.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import Text from '@/components/common/Text'
import Textarea from '@/components/common/Textarea'
import { notifyCalendarEventsChanged, sortCalendarEvents } from '@/lib/calendarEvents'
import { calendarService } from '@/services/calendar'
import { studentService } from '@/services/student'
import type { CalendarEvent } from '@/types/calendar'
import * as styles from './HomeCalendar.css'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

function dateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function monthCells(anchor: Date): Date[] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1)
  const startOffset = (first.getDay() + 6) % 7
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1 - startOffset)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

export default function HomeCalendar() {
  const today = useMemo(() => new Date(), [])
  const todayKey = dateKey(today)
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedKey, setSelectedKey] = useState(todayKey)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [body, setBody] = useState('')
  const [studentIds, setStudentIds] = useState<number[]>([])
  const [classIds, setClassIds] = useState<number[]>([])
  const [students, setStudents] = useState<
    Array<{ id: number; name: string; phone: string; classes: Array<{ id: number; name: string }> }>
  >([])
  const [studentQuery, setStudentQuery] = useState('')
  const [targetMode, setTargetMode] = useState<'student' | 'class'>('student')
  const [studentStatus, setStudentStatus] = useState<'idle' | 'ready' | 'error'>('idle')
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const deletingRef = useRef(false)

  const cells = useMemo(() => monthCells(month), [month])
  const rangeFrom = dateKey(cells[0])
  const rangeTo = dateKey(cells[cells.length - 1])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const rows = await calendarService.list(rangeFrom, rangeTo)
        if (!cancelled) {
          setEvents(rows)
          setError('')
        }
      } catch {
        if (!cancelled) setError('일정을 불러오지 못했어요.')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [rangeFrom, rangeTo])

  const marked = useMemo(() => {
    const dates = new Set<string>()
    for (const event of events) dates.add(event.event_date)
    return dates
  }, [events])

  const selectedEvents = sortCalendarEvents(events.filter((event) => event.event_date === selectedKey))
  const selectedDate = parseKey(selectedKey)

  const shiftMonth = (delta: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1)
    setMonth(next)
    setSelectedKey(dateKey(next))
  }

  const reload = async () => {
    const rows = await calendarService.list(rangeFrom, rangeTo)
    setEvents(rows)
  }

  const closeForm = () => {
    setAddOpen(false)
    setEditingId(null)
  }

  const saveEvent = async () => {
    const text = body.trim()
    if (!text || saving) return
    setSaving(true)
    setError('')
    try {
      if (editingId != null) {
        await calendarService.update(editingId, {
          body: text,
          student_ids: studentIds,
          class_ids: classIds,
        })
      } else {
        await calendarService.create({
          event_date: selectedKey,
          body: text,
          student_ids: studentIds,
          class_ids: classIds,
        })
      }
      setBody('')
      setStudentIds([])
      setClassIds([])
      closeForm()
      await reload()
      notifyCalendarEventsChanged()
    } catch {
      setFormError(editingId != null ? '일정을 수정하지 못했어요.' : '일정을 추가하지 못했어요.')
    } finally {
      setSaving(false)
    }
  }

  const loadStudents = async () => {
    if (studentStatus === 'ready') return
    try {
      const result = await studentService.getStudents()
      setStudents(
        result.data.map((student) => ({
          id: student.id,
          name: student.name,
          phone: student.phone ?? '',
          classes: (student.classes ?? []).map((cls) => ({ id: cls.id, name: cls.name })),
        })),
      )
      setStudentStatus('ready')
    } catch {
      setStudentStatus('error')
    }
  }

  const openAdd = async () => {
    setEditingId(null)
    setBody('')
    setStudentIds([])
    setClassIds([])
    setStudentQuery('')
    setTargetMode('student')
    setFormError('')
    setAddOpen(true)
    await loadStudents()
  }

  const openEdit = async (event: CalendarEvent) => {
    setEditingId(event.id)
    setBody(event.body)
    setStudentIds(event.students.map((student) => student.student_id))
    setClassIds((event.classes ?? []).map((row) => row.class_id))
    setStudentQuery('')
    setTargetMode('student')
    setFormError('')
    setAddOpen(true)
    await loadStudents()
  }

  const removeEvent = async () => {
    const id = deleteId
    if (id == null || deletingRef.current) return
    deletingRef.current = true
    setDeleting(true)
    setError('')
    try {
      await calendarService.remove(id)
      setEvents((current) => current.filter((row) => row.id !== id))
      setDeleteId(null)
      notifyCalendarEventsChanged()
    } catch {
      setError('일정을 지우지 못했어요.')
    } finally {
      deletingRef.current = false
      setDeleting(false)
    }
  }

  const toggleDone = async (event: CalendarEvent) => {
    const next = !event.done
    setEvents((current) => current.map((row) => (row.id === event.id ? { ...row, done: next } : row)))
    setError('')
    try {
      await calendarService.update(event.id, { done: next })
      notifyCalendarEventsChanged()
    } catch {
      setEvents((current) =>
        current.map((row) => (row.id === event.id ? { ...row, done: event.done } : row)),
      )
      setError('일정을 체크하지 못했어요.')
    }
  }

  const studentQueryTrimmed = studentQuery.trim()
  const visibleStudents = students.filter(
    (student) =>
      studentQueryTrimmed === '' ||
      student.name.includes(studentQueryTrimmed) ||
      student.phone.includes(studentQueryTrimmed),
  )

  const showTarget = (mode: 'student' | 'class') => {
    setTargetMode(mode)
    setStudentQuery('')
  }

  const classGroups = useMemo(() => {
    const groups = new Map<number, { id: number; name: string; studentIds: number[] }>()
    for (const student of students) {
      for (const cls of student.classes) {
        const group = groups.get(cls.id) ?? { id: cls.id, name: cls.name, studentIds: [] }
        group.studentIds.push(student.id)
        groups.set(cls.id, group)
      }
    }
    return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name, 'ko'))
  }, [students])

  const visibleClasses = classGroups.filter(
    (group) => studentQueryTrimmed === '' || group.name.includes(studentQueryTrimmed),
  )

  const toggleStudent = (id: number) => {
    const removing = studentIds.includes(id)
    setStudentIds((current) =>
      current.includes(id) ? current.filter((studentId) => studentId !== id) : [...current, id],
    )
    if (!removing) return
    setClassIds((current) =>
      current.filter((classId) => {
        const group = classGroups.find((row) => row.id === classId)
        return group ? !group.studentIds.includes(id) : false
      }),
    )
  }

  const toggleClass = (classId: number, memberIds: number[]) => {
    const on = classIds.includes(classId)
    const nextClassIds = on ? classIds.filter((id) => id !== classId) : [...classIds, classId]
    const keptByClass = new Set(
      classGroups
        .filter((group) => nextClassIds.includes(group.id))
        .flatMap((group) => group.studentIds),
    )
    setClassIds(nextClassIds)
    setStudentIds((current) => {
      if (!on) return [...new Set([...current, ...memberIds])]
      return current.filter((id) => !memberIds.includes(id) || keptByClass.has(id))
    })
  }

  return (
    <section className={styles.card} aria-label="캘린더">
      <div className={styles.header}>
        <Text variant="headingSm" as="h2" className={styles.headingReset}>
          {month.getFullYear()}년 {month.getMonth() + 1}월
        </Text>
        <div className={styles.nav}>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={styles.navIcon}
            aria-label="이전"
            onClick={() => shiftMonth(-1)}
          >
            <ChevronLeftIcon width={16} height={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
              setSelectedKey(todayKey)
            }}
          >
            오늘
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={styles.navIcon}
            aria-label="다음"
            onClick={() => shiftMonth(1)}
          >
            <ChevronRightIcon width={16} height={16} />
          </Button>
        </div>
      </div>
      <div className={styles.weekdays}>
        {WEEKDAYS.map((label) => (
          <span key={label} className={styles.weekday}>
            <Text variant="labelSm" color="gray500">
              {label}
            </Text>
          </span>
        ))}
      </div>
      <div className={styles.grid}>
        {cells.map((date) => {
          const key = dateKey(date)
          return (
            <button
              key={key}
              type="button"
              className={styles.day({
                outside: date.getMonth() !== month.getMonth(),
                selected: key === selectedKey,
                today: key === todayKey,
              })}
              onClick={() => setSelectedKey(key)}
            >
              <span>{date.getDate()}</span>
              {marked.has(key) ? <span className={styles.dot} /> : <span className={styles.dotSpacer} />}
            </button>
          )
        })}
      </div>
      <div className={styles.dayHead}>
        <Text variant="titleSm" as="h3" className={styles.headingReset}>
          {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
        </Text>
        <Button type="button" variant="secondary" size="sm" onClick={() => void openAdd()}>
          추가
        </Button>
      </div>
      {selectedEvents.length === 0 ? (
        <Text variant="bodyMd" color="gray500" as="p" className={styles.note}>
          이 날 적은 일정이 없어요.
        </Text>
      ) : null}
      {selectedEvents.length > 0 ? (
        <ul className={styles.list}>
          {selectedEvents.map((event) => (
            <li key={event.id} className={styles.item}>
              <button
                type="button"
                className={styles.checkButton}
                aria-pressed={event.done}
                aria-label={event.done ? `${event.body} 체크 해제` : `${event.body} 체크`}
                onClick={() => void toggleDone(event)}
              >
                <CheckIcon width={16} height={16} className={event.done ? styles.checkOn : styles.checkOff} />
              </button>
              <button type="button" className={styles.itemBodyButton} onClick={() => void toggleDone(event)}>
                <Text
                  variant="bodyMd"
                  color={event.done ? 'gray500' : 'gray900'}
                  className={event.done ? styles.struck : undefined}
                >
                  {event.body}
                </Text>
                {event.audience ? (
                  <Text
                    variant="labelSm"
                    color={event.done ? 'gray500' : 'gray600'}
                    className={event.done ? styles.struck : undefined}
                  >
                    {event.audience}
                  </Text>
                ) : null}
              </button>
              <span className={styles.itemActions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => void openEdit(event)}>
                  수정
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setDeleteId(event.id)}>
                  지우기
                </Button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <Text variant="labelSm" color="error500" as="p" className={styles.note}>
          {error}
        </Text>
      ) : null}
      <ConfirmModal
        isOpen={deleteId != null}
        onClose={() => {
          if (!deleting) setDeleteId(null)
        }}
        onConfirm={() => void removeEvent()}
        title="이 일정을 지울까요?"
        descriptions={['지운 일정은 캘린더와 하루 브리핑에서 사라져요.']}
        confirmLabel="지우기"
        confirmVariant="danger"
      />
      <Modal isOpen={addOpen} onClose={closeForm} size="md">
        <div className={styles.modalTitle}>
          <Text variant="headingLg" as="h2" className={styles.headingReset}>
            {editingId != null
              ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정 수정`
              : `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정`}
          </Text>
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.field}>
            <Text variant="headingSm">내용</Text>
            <Textarea
              rows={3}
              maxLength={500}
              value={body}
              placeholder="이 날 할 일"
              onChange={(event) => setBody(event.target.value)}
            />
          </label>
          <div className={styles.field}>
            <div className={styles.targetTabs} role="tablist" aria-label="학생 또는 반">
              <button
                type="button"
                role="tab"
                aria-selected={targetMode === 'student'}
                className={`${styles.targetTab}${targetMode === 'student' ? ` ${styles.targetTabActive}` : ''}`}
                onClick={() => showTarget('student')}
              >
                <Text variant="headingSm" color={targetMode === 'student' ? 'gray900' : 'gray500'}>
                  학생
                </Text>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={targetMode === 'class'}
                className={`${styles.targetTab}${targetMode === 'class' ? ` ${styles.targetTabActive}` : ''}`}
                onClick={() => showTarget('class')}
              >
                <Text variant="headingSm" color={targetMode === 'class' ? 'gray900' : 'gray500'}>
                  반
                </Text>
              </button>
            </div>
            {studentStatus === 'ready' &&
            (targetMode === 'student' ? students.length > 0 : classGroups.length > 0) ? (
              <Input
                value={studentQuery}
                placeholder={targetMode === 'student' ? '학생 이름 또는 전화번호 검색' : '반 이름 검색'}
                onChange={(event) => setStudentQuery(event.target.value)}
              />
            ) : null}
            <div className={styles.students}>
              {studentStatus !== 'ready' ? (
                <Text variant="bodyMd" color="gray500">
                  {studentStatus === 'error' ? '목록을 불러오지 못했어요.' : '불러오는 중'}
                </Text>
              ) : targetMode === 'class' ? (
                classGroups.length === 0 ? (
                  <Text variant="bodyMd" color="gray500">
                    등록된 반이 없어요.
                  </Text>
                ) : visibleClasses.length === 0 ? (
                  <Text variant="bodyMd" color="gray500">
                    검색 결과가 없어요
                  </Text>
                ) : (
                  visibleClasses.map((group) => {
                    const selected = classIds.includes(group.id)
                    return (
                      <button
                        key={group.id}
                        type="button"
                        className={styles.studentButton({ selected })}
                        aria-pressed={selected}
                        onClick={() => toggleClass(group.id, group.studentIds)}
                      >
                        <CheckIcon width={16} height={16} className={selected ? styles.checkOn : styles.checkOff} />
                        <Text variant="titleSm">{group.name}</Text>
                        <Text variant="bodyMd" color="gray500">
                          {group.studentIds.length}명
                        </Text>
                      </button>
                    )
                  })
                )
              ) : students.length === 0 ? (
                <Text variant="bodyMd" color="gray500">
                  등록된 학생이 없어요.
                </Text>
              ) : visibleStudents.length === 0 ? (
                <Text variant="bodyMd" color="gray500">
                  검색 결과가 없어요
                </Text>
              ) : (
                visibleStudents.map((student) => {
                  const selected = studentIds.includes(student.id)
                  return (
                    <button
                      key={student.id}
                      type="button"
                      className={styles.studentButton({ selected })}
                      aria-pressed={selected}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <CheckIcon width={16} height={16} className={selected ? styles.checkOn : styles.checkOff} />
                      <Text variant="titleSm">{student.name}</Text>
                      {student.phone ? (
                        <Text variant="bodyMd" color="gray500">
                          {student.phone}
                        </Text>
                      ) : null}
                    </button>
                  )
                })
              )}
            </div>
          </div>
          {formError ? (
            <Text variant="bodyMd" color="error500">
              {formError}
            </Text>
          ) : null}
        </div>
        <div className={styles.actions}>
          <Button type="button" variant="ghost" size="lg" fullWidth onClick={closeForm}>
            취소
          </Button>
          <Button
            type="button"
            variant="primary"
            size="lg"
            fullWidth
            disabled={saving || body.trim() === ''}
            onClick={() => void saveEvent()}
          >
            {editingId != null ? '저장' : '추가하기'}
          </Button>
        </div>
      </Modal>
    </section>
  )
}
