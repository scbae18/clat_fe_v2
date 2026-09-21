'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { ParentDashboardData } from '@/services/parentDashboard'
import { isCoreAttendanceLabel } from '@/lib/attendanceLabels'
import * as styles from '../[token]/parentDashboard.css'

function formatKoreanDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return format(d, 'M월 d일 (E)', { locale: ko })
}

function daysAgo(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return 0
  const now = new Date()
  const diff = Math.max(0, now.getTime() - d.getTime())
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M3.333 5.833A2.5 2.5 0 0 1 5.833 3.333H9.167a2.5 2.5 0 0 1 2.5 2.5v10H5.833a2.5 2.5 0 0 1-2.5-2.5V5.833Z"
        fill="#5774DA"
      />
      <path
        d="M16.667 5.833A2.5 2.5 0 0 0 14.167 3.333h-3.334a2.5 2.5 0 0 0-2.5 2.5v10h5.834a2.5 2.5 0 0 0 2.5-2.5V5.833Z"
        fill="#5774DA"
      />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="9" fill="#5774DA" />
      <path
        d="m12.684 6.676-4.39 4.457L5.92 8.75"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M6 1.2 6.7 4.3 9.8 5 6.7 5.7 6 8.8 5.3 5.7 2.2 5 5.3 4.3 6 1.2Z"
        fill="#5774DA"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="#5774DA" />
      <path
        d="M10 5.833v4.583l2.917 1.667"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function feedbackText(data: ParentDashboardData) {
  if (data.ai_feedback_status === 'ready' && data.ai_feedback) return data.ai_feedback
  if (data.ai_feedback_status === 'pending') {
    return data.ai_feedback || '피드백을 준비 중이에요.'
  }
  return data.ai_feedback || '피드백을 불러오지 못했어요.'
}

interface ParentDashboardViewProps {
  data: ParentDashboardData
  embed?: boolean
  feedbackExtra?: ReactNode
}

export default function ParentDashboardView({
  data,
  embed = false,
  feedbackExtra,
}: ParentDashboardViewProps) {
  const [showAllIncomplete, setShowAllIncomplete] = useState(false)
  const incompleteItems = data.incomplete_items ?? []
  const incompletePreviewLimit = 4
  const visibleIncomplete = showAllIncomplete
    ? incompleteItems
    : incompleteItems.slice(0, incompletePreviewLimit)
  const hasMoreIncomplete = incompleteItems.length > incompletePreviewLimit

  const scoreLabel = useMemo(() => {
    const first = data.lesson_summary.scores?.[0]
    if (!first) return '-'
    return `${first.value || '-'}`
  }, [data])

  const summaryRows = useMemo(() => {
    const rows: Array<{ label: string; value: string }> = []
    rows.push({ label: '출결', value: data.lesson_summary.attendance ?? '-' })
    for (const score of data.lesson_summary.scores) {
      rows.push({
        label: score.name || '단원평가',
        value: score.value || '-',
      })
    }
    for (const extra of data.lesson_summary.extra_items) {
      rows.push({
        label: extra.name || '-',
        value: extra.value || '-',
      })
    }
    return rows
  }, [data])

  return (
    <div className={embed ? styles.frameEmbed : styles.frame}>
      <div className={embed ? styles.topHaloEmbed : styles.topHalo} />
      <p className={styles.greet}>{`${data.student_name} 학부모님 안녕하세요`}</p>
      <div className={styles.classBadge}>{data.class_name}</div>
      <h1 className={styles.title}>{`${formatKoreanDate(data.lesson_date)} 수업 결과`}</h1>

      <div className={styles.stack}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardHeadIcon}>
              <BookIcon />
            </span>
            <span className={styles.cardHeadText}>오늘 수업 요약</span>
          </div>
          {summaryRows.length > 0 ? (
            summaryRows.map((row, idx) => (
              <div
                className={`${styles.summaryRow}${idx === summaryRows.length - 1 ? ` ${styles.summaryRowLast}` : ''}`}
                key={`${row.label}-${idx}`}
              >
                <span>{row.label}</span>
                <span className={styles.summaryVal}>{row.value}</span>
              </div>
            ))
          ) : (
            <>
              <div className={styles.summaryRow}>
                <span>출결</span>
                <span className={styles.summaryVal}>{data.lesson_summary.attendance ?? '-'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>단원평가</span>
                <span className={styles.summaryVal}>{scoreLabel}</span>
              </div>
            </>
          )}
        </section>

        <section className={styles.card}>
          {feedbackExtra ? (
            <div className={styles.feedbackHead}>
              <div className={styles.cardHeadInline}>
                <span className={styles.cardHeadIcon}>
                  <BookIcon />
                </span>
                <span className={styles.cardHeadText}>선생님 피드백</span>
              </div>
              {feedbackExtra}
            </div>
          ) : (
            <div className={styles.cardHead}>
              <span className={styles.cardHeadIcon}>
                <BookIcon />
              </span>
              <span className={styles.cardHeadText}>선생님 피드백</span>
            </div>
          )}
          <p className={styles.feedbackText}>{feedbackText(data)}</p>
          <p className={styles.aiHint}>
            <SparkleIcon />
            선생님이 설정한 기준으로 생성된 AI피드백입니다.
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardHeadIcon}>
              <CheckCircleIcon />
            </span>
            <span className={styles.cardHeadText}>미완료 항목</span>
          </div>
          <div className={styles.todoList}>
            {visibleIncomplete.map((it, idx) => (
              <div
                key={`${it.lesson_date}-${it.class_name}-${it.item_name}-${idx}`}
                className={styles.todoItem}
              >
                <span className={styles.todoMain}>
                  <span className={styles.todoHomework}>{it.item_name}</span>
                  {it.note ? <span className={styles.todoNote}>{it.note}</span> : null}
                </span>
                <div className={styles.todoTags}>
                  <span className={styles.todoClassBlue}>{it.class_name}</span>
                  <span className={styles.todoTemplateGreen}>{formatKoreanDate(it.lesson_date)}</span>
                  <span className={styles.tagLate}>{`${daysAgo(it.lesson_date)}일 지남`}</span>
                </div>
              </div>
            ))}
            {incompleteItems.length === 0 ? (
              <div className={styles.todoItem}>
                <span className={styles.todoName}>미완료 항목이 없어요.</span>
              </div>
            ) : null}
            {hasMoreIncomplete ? (
              <button
                type="button"
                className={styles.moreButton}
                onClick={() => setShowAllIncomplete((v) => !v)}
              >
                {showAllIncomplete ? '접기' : '더보기'}
              </button>
            ) : null}
          </div>
        </section>

        <section className={`${styles.card} ${styles.recentCard}`}>
          <div className={styles.cardHead}>
            <span className={styles.cardHeadIcon}>
              <ClockIcon />
            </span>
            <span className={styles.cardHeadText}>최근 수업 이력</span>
          </div>
          <div className={styles.timeline}>
            <div className={styles.timelineRail} />
            {(data.recent_lessons ?? []).map((r, idx) => (
              <div key={`${r.lesson_date}-${r.class_name}-${idx}`} style={{ position: 'relative' }}>
                <div className={styles.recentDate}>{formatKoreanDate(r.lesson_date)}</div>
                <div className={styles.recentRow}>
                  <span className={styles.recentClass}>{r.class_name}</span>
                  {r.attendance ? (
                    <span
                      className={`${styles.recentBadge} ${
                        isCoreAttendanceLabel(r.attendance) ? styles.recentAttend : styles.recentScore
                      }`}
                    >
                      {r.attendance}
                    </span>
                  ) : null}
                  {r.scores.map((score) => (
                    <span
                      key={`${score.item_name}-${score.value}`}
                      className={`${styles.recentBadge} ${styles.recentScore}`}
                    >
                      {`${score.item_name} ${score.value}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {(data.recent_lessons ?? []).length === 0 ? (
              <div className={styles.recentDate}>최근 수업 이력이 없어요.</div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  )
}
