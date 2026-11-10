'use client'

import { useEffect, useState } from 'react'
import Text from '@/components/common/Text'
import { calendarService } from '@/services/calendar'
import type { CalendarEvent } from '@/types/calendar'
import * as styles from './LessonDayEvents.css'

interface LessonDayEventsProps {
  date: string
}

export default function LessonDayEvents({ date }: LessonDayEventsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const rows = await calendarService.list(date, date)
        if (!cancelled) setEvents(rows)
      } catch {
        if (!cancelled) setEvents([])
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [date])

  if (events.length === 0) return null

  return (
    <section className={styles.wrap} aria-label="이 날의 일정">
      <ul className={styles.list}>
        {events.map((event) => (
          <li key={event.id} className={styles.item}>
            <span className={styles.body}>
              <Text variant="bodyMd" color="gray900">
                {event.body}
              </Text>
              {event.students.length > 0 ? (
                <Text variant="labelSm" color="gray600">
                  {event.students.map((student) => student.student_name).join(' · ')}
                </Text>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
