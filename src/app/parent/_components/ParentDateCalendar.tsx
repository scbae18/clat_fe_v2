'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { format, isSameDay } from 'date-fns'
import CalendarIcon from '@/assets/icons/icon-calendar.svg'
import ChevronLeftIcon from '@/assets/icons/icon-chevron-left.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import * as calendar from '@/app/(main)/lesson/_components/LessonDatePicker/LessonDatePicker.css'
import * as styles from '../[token]/parentDashboard.css'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

function monthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function monthCells(anchor: Date): Date[] {
  const first = monthStart(anchor)
  const startOffset = (first.getDay() + 6) % 7
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - startOffset)
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return date
  })
}

interface ParentDateCalendarProps {
  onSelect: (date: Date) => void
}

export default function ParentDateCalendar({ onSelect }: ParentDateCalendarProps) {
  const today = new Date()
  const [selectedDate, setSelectedDate] = useState(today)
  const [open, setOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(() => monthStart(today))
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useEffect(() => {
    setMounted(true)
  }, [])

  const placePanel = useCallback(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return
    const rect = trigger.getBoundingClientRect()
    const width = panel.offsetWidth
    const height = panel.offsetHeight
    const left = Math.min(Math.max(8, rect.right - width), window.innerWidth - width - 8)
    const below = rect.bottom + 8
    const top = below + height > window.innerHeight - 8 ? Math.max(8, rect.top - height - 8) : below
    panel.style.setProperty('--lesson-date-picker-x', `${left}px`)
    panel.style.setProperty('--lesson-date-picker-y', `${top}px`)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    placePanel()
  }, [open, visibleMonth, placePanel])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', placePanel)
    window.addEventListener('scroll', placePanel, true)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', placePanel)
      window.removeEventListener('scroll', placePanel, true)
    }
  }, [open, placePanel])

  const cells = useMemo(() => monthCells(visibleMonth), [visibleMonth])

  const choose = (date: Date) => {
    setSelectedDate(date)
    onSelect(date)
    setOpen(false)
  }

  const shiftMonth = (delta: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  const toggle = () => {
    setVisibleMonth(monthStart(selectedDate))
    setOpen((current) => !current)
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.calendarButton}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="날짜로 찾기"
        onClick={toggle}
      >
        <CalendarIcon className={styles.icon16} />
      </button>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              className={calendar.panel}
              role="dialog"
              aria-modal={false}
              aria-labelledby={titleId}
            >
              <div className={calendar.header}>
                <Text variant="headingSm" as="h2" id={titleId} className={calendar.heading}>
                  {format(visibleMonth, 'yyyy년 M월')}
                </Text>
                <div className={calendar.nav}>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={calendar.navIcon}
                    aria-label="이전 달"
                    onClick={() => shiftMonth(-1)}
                  >
                    <ChevronLeftIcon width={16} height={16} />
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => choose(today)}>
                    오늘
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={calendar.navIcon}
                    aria-label="다음 달"
                    onClick={() => shiftMonth(1)}
                  >
                    <ChevronRightIcon width={16} height={16} />
                  </Button>
                </div>
              </div>
              <div className={calendar.weekdays}>
                {WEEKDAYS.map((day) => (
                  <span key={day} className={calendar.weekday}>
                    <Text variant="labelSm" color="gray500">
                      {day}
                    </Text>
                  </span>
                ))}
              </div>
              <div className={calendar.grid}>
                {cells.map((date) => {
                  const selected = isSameDay(date, selectedDate)
                  const isToday = isSameDay(date, today)
                  return (
                    <button
                      key={format(date, 'yyyy-MM-dd')}
                      type="button"
                      className={calendar.day({
                        outside: date.getMonth() !== visibleMonth.getMonth(),
                        selected,
                        today: isToday,
                      })}
                      aria-label={format(date, 'yyyy년 M월 d일')}
                      aria-pressed={selected}
                      onClick={() => choose(date)}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
