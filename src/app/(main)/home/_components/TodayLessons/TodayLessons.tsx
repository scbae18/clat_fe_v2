'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addDays, format, isSameDay, parseISO } from 'date-fns'
import { lessonService, type LessonSummary } from '@/services/lesson'
import EditIcon from '@/assets/icons/icon-edit.svg'
import ChevronLeftIcon from '@/assets/icons/icon-chevron-left.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import CalendarIcon from '@/assets/icons/icon-calendar.svg'
import * as styles from './TodayLessons.css'

interface TodayLessonsProps {
  today: string
  initialLessons: LessonSummary[] | null
}

const DAYS_KO = ['일', '월', '화', '수', '목', '금', '토']

function formatDateLabel(date: string, today: string): string {
  if (date === today) {
    const d = parseISO(date)
    return `오늘 (${d.getMonth() + 1}.${d.getDate()})`
  }
  const d = parseISO(date)
  const todayDate = parseISO(today)
  const yesterday = format(addDays(todayDate, -1), 'yyyy-MM-dd')
  const tomorrow = format(addDays(todayDate, 1), 'yyyy-MM-dd')
  if (date === yesterday) return `어제 (${d.getMonth() + 1}.${d.getDate()})`
  if (date === tomorrow) return `내일 (${d.getMonth() + 1}.${d.getDate()})`
  return `${d.getMonth() + 1}.${d.getDate()} (${DAYS_KO[d.getDay()]})`
}

function getLessonStatus(l: LessonSummary): {
  label: string
  className: string
} {
  if (l.lesson_record_id === null && l.id === null) {
    return { label: '미입력', className: styles.statusPending }
  }
  if (l.status === 'SAVED') {
    return { label: '입력완료', className: styles.statusDone }
  }
  return { label: '임시저장', className: styles.statusDraft }
}

export default function TodayLessons({ today, initialLessons }: TodayLessonsProps) {
  const router = useRouter()
  const [date, setDate] = useState(today)
  const [lessons, setLessons] = useState<LessonSummary[] | null>(initialLessons)

  useEffect(() => {
    if (date === today) {
      setLessons(initialLessons)
    }
  }, [date, today, initialLessons])

  useEffect(() => {
    if (date === today) return
    let cancelled = false
    setLessons(null)
    lessonService
      .getLessons(date)
      .then((res) => {
        if (!cancelled) setLessons(res.data)
      })
      .catch(() => {
        if (!cancelled) setLessons([])
      })
    return () => {
      cancelled = true
    }
  }, [date, today])

  const dateLabel = useMemo(() => formatDateLabel(date, today), [date, today])

  function shiftDate(days: number) {
    const next = format(addDays(parseISO(date), days), 'yyyy-MM-dd')
    setDate(next)
  }

  function goToLesson(l: LessonSummary) {
    const recordId = l.lesson_record_id ?? l.id ?? null
    if (recordId !== null && recordId !== undefined) {
      router.push(`/lesson/${recordId}`)
    } else {
      router.push(`/lesson/new?class_id=${l.class_id}&date=${date}&is_adhoc=false`)
    }
  }

  const isLoading = lessons === null
  const isToday = isSameDay(parseISO(date), parseISO(today))

  return (
    <section id="home-today-lessons" className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <CalendarIcon width={20} height={20} />
          <span className={styles.titleText}>{isToday ? '오늘의 수업' : '수업 일정'}</span>
          {!isLoading && lessons && lessons.length > 0 && (
            <span className={styles.lessonsCount}>{lessons.length}건</span>
          )}
        </div>
        <div className={styles.dateNav}>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => shiftDate(-1)}
            aria-label="이전 날짜"
          >
            <ChevronLeftIcon width={16} height={16} />
          </button>
          <span className={styles.dateLabel}>{dateLabel}</span>
          <button
            type="button"
            className={styles.navButton}
            onClick={() => shiftDate(1)}
            aria-label="다음 날짜"
          >
            <ChevronRightIcon width={16} height={16} />
          </button>
          <button
            type="button"
            className={styles.todayPill}
            onClick={() => setDate(today)}
            disabled={isToday}
          >
            오늘
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          <div className={styles.skeletonCard} />
          <div className={styles.skeletonCard} />
        </div>
      ) : lessons && lessons.length > 0 ? (
        <div className={styles.grid}>
          {lessons.map((l) => {
            const status = getLessonStatus(l)
            const progressPct = Math.round((l.progress_rate ?? 0) * 100)
            const inputCount = Math.round(l.total_students * (l.progress_rate ?? 0))
            const recordId = l.lesson_record_id ?? l.id ?? null
            return (
              <div
                key={`${l.class_id}-${recordId ?? 'new'}`}
                className={styles.card}
                onClick={() => goToLesson(l)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') goToLesson(l)
                }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.academyChip}>{l.academy_name}</span>
                  <span className={`${styles.statusChip} ${status.className}`}>
                    {status.label}
                  </span>
                </div>
                <div>
                  <div className={styles.cardTitle}>{l.class_name}</div>
                  <div className={styles.cardSub}>
                    {l.template_name || '템플릿 미지정'} · {l.total_students}명
                  </div>
                </div>
                <div className={styles.progressBlock}>
                  <div className={styles.progressLabel}>
                    <div className={styles.progressLabelLeft}>
                      <span className={styles.progressLabelKey}>진행률</span>
                      <span className={styles.progressLabelValue}>{progressPct}%</span>
                    </div>
                    <span className={styles.progressLabelRight}>
                      {inputCount} / {l.total_students}명
                    </span>
                  </div>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressBar}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
                <div className={styles.cardFooter}>
                  {recordId !== null && recordId !== undefined ? '열기' : '입력하기'}
                  <ChevronRightIcon width={16} height={16} />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className={styles.emptyCard}>
          <EditIcon width={28} height={28} />
          <div className={styles.emptyTitle}>예정된 수업이 없어요</div>
          <div className={styles.emptyDesc}>
            {isToday
              ? '오늘은 비어있는 하루예요. 수업 일정을 추가하거나 다른 날짜를 확인해보세요.'
              : '이 날짜에는 등록된 수업이 없어요.'}
          </div>
        </div>
      )}
    </section>
  )
}
