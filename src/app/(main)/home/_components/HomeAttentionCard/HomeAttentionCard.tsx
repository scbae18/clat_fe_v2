'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { studentService } from '@/services/student'
import type { AttentionStudent } from '@/types/student'
import * as styles from './HomeAttentionCard.css'

const PREVIEW_COUNT = 5

export default function HomeAttentionCard() {
  const [students, setStudents] = useState<AttentionStudent[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const rows = await studentService.getAttentionStudents()
        if (!cancelled) {
          setStudents(rows)
          setStatus('ready')
        }
      } catch {
        if (!cancelled) setStatus('error')
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const visible = expanded ? students : students.slice(0, PREVIEW_COUNT)
  const hiddenCount = students.length - PREVIEW_COUNT

  return (
    <div className={styles.split}>
      <div className={styles.calendarSlot} aria-hidden="true" />
      <section className={styles.card} aria-label="챙겨볼 학생">
      <div className={styles.header}>
        <h2 className={styles.title}>챙겨볼 학생</h2>
        {status === 'ready' && students.length > 0 ? (
          <span className={styles.count}>{students.length}</span>
        ) : null}
      </div>
      {status === 'loading' ? <p className={styles.empty}>불러오는 중</p> : null}
      {status === 'error' ? <p className={styles.empty}>챙겨볼 학생을 불러오지 못했어요.</p> : null}
      {status === 'ready' && students.length === 0 ? (
        <p className={styles.empty}>지금은 챙겨볼 학생이 없어요.</p>
      ) : null}
      {status === 'ready' && students.length > 0 ? (
        <ul className={styles.list}>
          {visible.map((student) => (
            <li key={student.student_id}>
              <Link href={`/students/${student.student_id}`} className={styles.row}>
                <span className={styles.avatar} aria-hidden="true">
                  {student.student_name.slice(0, 1)}
                </span>
                <span className={styles.body}>
                  <span className={styles.nameRow}>
                    <span className={styles.name}>{student.student_name}</span>
                    {student.has_lesson_today ? (
                      <span className={styles.today}>오늘 등원</span>
                    ) : null}
                  </span>
                  {student.class_names.length > 0 ? (
                    <span className={styles.className}>{student.class_names.join(' · ')}</span>
                  ) : null}
                  {student.reasons.map((reason) => (
                    <span
                      key={`${reason.code}-${reason.lesson_date}-${reason.class_name}`}
                      className={styles.reason}
                    >
                      {reason.class_name ? (
                        <span className={styles.reasonClass}>{reason.class_name}</span>
                      ) : null}
                      {reason.text}
                    </span>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
      {status === 'ready' && hiddenCount > 0 ? (
        <button type="button" className={styles.more} onClick={() => setExpanded((open) => !open)}>
          {expanded ? '접기' : `${hiddenCount}명 더 보기`}
        </button>
      ) : null}
      </section>
    </div>
  )
}
