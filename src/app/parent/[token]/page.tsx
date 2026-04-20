'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { parentDashboardService, type ParentDashboardData } from '@/services/parentDashboard'
import * as styles from './parentDashboard.css'

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

export default function ParentDashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [data, setData] = useState<ParentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErrorMsg(null)

    parentDashboardService
      .getByToken(token)
      .then((res) => {
        if (cancelled) return
        setData(res)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const msg =
          (e as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response
            ?.data?.error?.message ||
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          '\uD559\uBD80\uBAA8 \uB300\uC2DC\uBCF4\uB4DC \uC815\uBCF4\uB97C \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.'
        setErrorMsg(msg)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token])

  const scoreLabel = useMemo(() => {
    const first = data?.lesson_summary.scores?.[0]
    if (!first) return '-'
    return `${first.value || '-'}`
  }, [data])

  const summaryRows = useMemo(() => {
    if (!data) return []
    const rows: Array<{ label: string; value: string }> = []
    rows.push({ label: '\uCD9C\uACB0', value: data.lesson_summary.attendance ?? '-' })
    for (const score of data.lesson_summary.scores) {
      rows.push({
        label: score.name || '\uB2E8\uC6D0\uD3C9\uAC00',
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
    <div className={styles.page}>
      <div className={styles.frame}>
        <div className={styles.topHalo} />

        {loading ? <div className={styles.stateBox}>{'\uBD88\uB7EC\uC624\uB294 \uC911...'}</div> : null}
        {!loading && errorMsg ? <div className={styles.stateBox}>{errorMsg}</div> : null}

        {!loading && !errorMsg && data ? (
          <>
            <p className={styles.greet}>{`${data.student_name} \uD559\uBD80\uBAA8\uB2D8 \uC548\uB155\uD558\uC138\uC694`}</p>
            <div className={styles.classBadge}>{data.class_name}</div>
            <h1 className={styles.title}>{`${formatKoreanDate(data.lesson_date)} \uC218\uC5C5 \uACB0\uACFC`}</h1>

            <div className={styles.stack}>
              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardHeadIcon}>
                    <BookIcon />
                  </span>
                  <span className={styles.cardHeadText}>{'\uC624\uB298 \uC218\uC5C5 \uC694\uC57D'}</span>
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
                      <span>{'\uCD9C\uACB0'}</span>
                      <span className={styles.summaryVal}>{data.lesson_summary.attendance ?? '-'}</span>
                    </div>
                    <div className={styles.summaryRow}>
                      <span>{'\uB2E8\uC6D0\uD3C9\uAC00'}</span>
                      <span className={styles.summaryVal}>{scoreLabel}</span>
                    </div>
                  </>
                )}
              </section>

              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardHeadIcon}>
                    <BookIcon />
                  </span>
                  <span className={styles.cardHeadText}>{'\uC120\uC0DD\uB2D8 \uD53C\uB4DC\uBC31'}</span>
                </div>
                <p className={styles.feedbackText}>
                  {data.ai_feedback_status === 'ready' && data.ai_feedback
                    ? data.ai_feedback
                    : data.ai_feedback_status === 'pending'
                      ? '\uD53C\uB4DC\uBC31\uC744 \uC900\uBE44 \uC911\uC774\uC5D0\uC694.'
                      : '\uD53C\uB4DC\uBC31\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.'}
                </p>
              </section>

              <section className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={styles.cardHeadIcon}>
                    <CheckCircleIcon />
                  </span>
                  <span className={styles.cardHeadText}>{'\uD574\uC57C \uD560 \uAC83'}</span>
                </div>
                <div className={styles.todoList}>
                  {(data.incomplete_items ?? []).slice(0, 4).map((it, idx) => (
                    <div
                      key={`${it.lesson_date}-${it.class_name}-${it.template_name}-${idx}`}
                      className={styles.todoItem}
                    >
                      <span className={styles.todoHomework}>{'\uACFC\uC81C'}</span>
                      <div className={styles.todoTags}>
                        <span className={styles.todoClassBlue}>{it.class_name}</span>
                        <span className={styles.todoTemplateGreen}>{it.template_name}</span>
                        <span className={styles.tagLate}>{`${daysAgo(it.lesson_date)}\uC77C \uC9C0\uB0A8`}</span>
                      </div>
                    </div>
                  ))}
                  {data.incomplete_items.length === 0 ? (
                    <div className={styles.todoItem}>
                      <span className={styles.todoName}>{'\uBBF8\uC644\uB8CC \uD56D\uBAA9\uC774 \uC5C6\uC5B4\uC694.'}</span>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className={`${styles.card} ${styles.recentCard}`}>
                <div className={styles.cardHead}>
                  <span className={styles.cardHeadIcon}>
                    <ClockIcon />
                  </span>
                  <span className={styles.cardHeadText}>{'\uCD5C\uADFC \uC218\uC5C5 \uC774\uB825'}</span>
                </div>
                <div className={styles.timeline}>
                  <div className={styles.timelineRail} />
                  {(data.recent_lessons ?? []).slice(0, 2).map((r, idx) => (
                    <div key={`${r.lesson_date}-${idx}`} style={{ position: 'relative' }}>
                      <div className={styles.recentDate}>{formatKoreanDate(r.lesson_date)}</div>
                      <div className={styles.recentRow}>
                        <span className={styles.recentClass}>{r.class_name}</span>
                        <span className={`${styles.recentBadge} ${styles.recentAttend}`}>{'\uCD9C\uC11D'}</span>
                        <span className={`${styles.recentBadge} ${styles.recentScore}`}>
                          {data.lesson_summary.scores[0]
                            ? `${data.lesson_summary.scores[0].name} ${data.lesson_summary.scores[0].value}`
                            : r.template_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

