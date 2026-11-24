'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import Button from '@/components/common/Button'
import Text from '@/components/common/Text'
import * as calendar from '@/app/(main)/lesson/_components/LessonDatePicker/LessonDatePicker.css'
import * as styles from './AlimtalkSendModal.css'

const HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute)

type Period = '오전' | '오후'

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function to24(period: Period, hour12: number) {
  if (period === '오전') return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}

function from24(hour24: number): { period: Period; hour12: number } {
  if (hour24 < 12) return { period: '오전', hour12: hour24 === 0 ? 12 : hour24 }
  return { period: '오후', hour12: hour24 === 12 ? 12 : hour24 - 12 }
}

function parseTime(value: string) {
  const [hourText, minuteText] = value.split(':')
  const hour24 = Number(hourText)
  const minute = Number(minuteText)
  return {
    ...from24(Number.isFinite(hour24) ? hour24 : 0),
    minute: Number.isFinite(minute) ? minute : 0,
  }
}

function formatTime(period: Period, hour12: number, minute: number) {
  return `${pad(to24(period, hour12))}:${pad(minute)}`
}

function clockLabel(value: string) {
  const { period, hour12, minute } = parseTime(value)
  return `${period} ${hour12}:${pad(minute)}`
}

interface ScheduleTimeFieldProps {
  value: string
  minTime?: string
  nowTime: string
  onChange: (value: string) => void
}

export default function ScheduleTimeField({
  value,
  minTime,
  nowTime,
  onChange,
}: ScheduleTimeFieldProps) {
  const selected = parseTime(value)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const hourScrollRef = useRef<HTMLDivElement>(null)
  const minuteScrollRef = useRef<HTMLDivElement>(null)
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
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
    const below = rect.bottom + 8
    const top = below + height > window.innerHeight - 8 ? Math.max(8, rect.top - height - 8) : below
    panel.style.setProperty('--schedule-time-x', `${left}px`)
    panel.style.setProperty('--schedule-time-y', `${top}px`)
  }, [])

  const scrollSelected = useCallback(() => {
    const align = (container: HTMLDivElement | null) => {
      const current = container?.querySelector<HTMLElement>('[aria-pressed="true"]')
      if (!container || !current) return
      container.scrollTop = current.offsetTop - container.clientHeight / 2 + current.clientHeight / 2
    }
    align(hourScrollRef.current)
    align(minuteScrollRef.current)
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    placePanel()
    scrollSelected()
  }, [open, placePanel, scrollSelected, value])

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

  const allowed = (time: string) => !minTime || time >= minTime

  const firstMinute = (period: Period, hour12: number) => {
    for (const minute of MINUTES) {
      if (allowed(formatTime(period, hour12, minute))) return minute
    }
    return null
  }

  const periodEnabled = (period: Period) => HOURS.some((hour12) => firstMinute(period, hour12) != null)

  const choose = (period: Period, hour12: number, minute: number, close: boolean) => {
    const time = formatTime(period, hour12, minute)
    if (!allowed(time)) return
    onChange(time)
    if (close) setOpen(false)
  }

  const chooseHour = (hour12: number) => {
    const minute = allowed(formatTime(selected.period, hour12, selected.minute))
      ? selected.minute
      : firstMinute(selected.period, hour12)
    if (minute == null) return
    choose(selected.period, hour12, minute, false)
  }

  const choosePeriod = (period: Period) => {
    if (allowed(formatTime(period, selected.hour12, selected.minute))) {
      choose(period, selected.hour12, selected.minute, false)
      return
    }
    const hour12 = HOURS.find((hour) => firstMinute(period, hour) != null)
    if (hour12 == null) return
    const minute = firstMinute(period, hour12)
    if (minute == null) return
    choose(period, hour12, minute, false)
  }

  return (
    <div className={styles.scheduleDateWrap}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.scheduleDateButton}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${clockLabel(value)} 시각 선택`}
        onClick={() => setOpen((current) => !current)}
      >
        {clockLabel(value)}
        <ChevronDownIcon
          width={16}
          height={16}
          className={`${calendar.chevron}${open ? ` ${calendar.chevronOpen}` : ''}`}
        />
      </button>
      {mounted && open
        ? createPortal(
            <div
              ref={panelRef}
              className={styles.scheduleTimePanel}
              role="dialog"
              aria-modal={false}
              aria-labelledby={titleId}
            >
              <div className={calendar.header}>
                <Text variant="headingSm" as="h2" id={titleId} className={calendar.heading}>
                  {clockLabel(value)}
                </Text>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={!allowed(nowTime)}
                  onClick={() => {
                    if (!allowed(nowTime)) return
                    onChange(nowTime)
                    setOpen(false)
                  }}
                >
                  지금
                </Button>
              </div>
              <div className={styles.schedulePeriodRow}>
                {(['오전', '오후'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`${calendar.day({
                      outside: false,
                      selected: selected.period === period,
                      today: false,
                    })}${periodEnabled(period) ? '' : ` ${styles.scheduleDayDisabled}`}`}
                    aria-pressed={selected.period === period}
                    disabled={!periodEnabled(period)}
                    onClick={() => choosePeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <div className={styles.scheduleTimeColumns}>
                <div className={styles.scheduleTimeColumn}>
                  <Text variant="labelSm" color="gray500">
                    시
                  </Text>
                  <div ref={hourScrollRef} className={styles.scheduleTimeScroll}>
                    {HOURS.map((hour12) => {
                      const enabled = firstMinute(selected.period, hour12) != null
                      const pressed = selected.hour12 === hour12
                      return (
                        <button
                          key={hour12}
                          type="button"
                          className={`${calendar.day({
                            outside: false,
                            selected: pressed,
                            today: false,
                          })}${enabled ? '' : ` ${styles.scheduleDayDisabled}`}`}
                          aria-pressed={pressed}
                          disabled={!enabled}
                          onClick={() => chooseHour(hour12)}
                        >
                          {hour12}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className={styles.scheduleTimeColumn}>
                  <Text variant="labelSm" color="gray500">
                    분
                  </Text>
                  <div ref={minuteScrollRef} className={styles.scheduleTimeScroll}>
                    {MINUTES.map((minute) => {
                      const enabled = allowed(formatTime(selected.period, selected.hour12, minute))
                      const pressed = selected.minute === minute
                      return (
                        <button
                          key={minute}
                          type="button"
                          className={`${calendar.day({
                            outside: false,
                            selected: pressed,
                            today: false,
                          })}${enabled ? '' : ` ${styles.scheduleDayDisabled}`}`}
                          aria-pressed={pressed}
                          disabled={!enabled}
                          onClick={() => choose(selected.period, selected.hour12, minute, true)}
                        >
                          {pad(minute)}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
