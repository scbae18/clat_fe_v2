'use client'

import { useEffect, useState } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import Text from '@/components/common/Text'
import { notifyCalendarEventsChanged, sortCalendarEvents } from '@/lib/calendarEvents'
import { calendarService } from '@/services/calendar'
import type { CalendarEvent } from '@/types/calendar'
import * as styles from './LessonDayEvents.css'

interface LessonDayEventsProps {
  date: string
}

export default function LessonDayEvents({ date }: LessonDayEventsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const rows = await calendarService.list(date, date)
        if (!cancelled) {
          setEvents(rows)
          setError('')
        }
      } catch {
        if (!cancelled) setEvents([])
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [date])

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

  if (events.length === 0 && !error) return null

  const ordered = sortCalendarEvents(events)

  return (
    <section className={styles.wrap} aria-label="이 날의 일정">
      {ordered.length > 0 ? (
        <ul className={styles.list}>
          {ordered.map((event) => (
            <li key={event.id} className={event.done ? styles.itemDone : styles.item}>
              <button
                type="button"
                className={styles.hit}
                aria-pressed={event.done}
                aria-label={event.done ? `${event.body} 체크 해제` : `${event.body} 체크`}
                onClick={() => void toggleDone(event)}
              >
                <CheckIcon
                  width={16}
                  height={16}
                  className={event.done ? styles.checkOn : styles.checkOff}
                />
                <span className={styles.body}>
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
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <Text variant="labelSm" color="error500" as="p" className={styles.error}>
          {error}
        </Text>
      ) : null}
    </section>
  )
}
