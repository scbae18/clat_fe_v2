'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Student } from '@/types/student'
import UsersIcon from '@/assets/icons/icon-users.svg'
import WarningIcon from '@/assets/icons/icon-warning.svg'
import CheckIcon from '@/assets/icons/icon-check.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import * as styles from './AttentionStudents.css'

interface AttentionStudentsProps {
  students: Student[] | null
}

const TOP_N = 5

function avatarInitial(name: string): string {
  const t = (name ?? '').trim()
  if (!t) return '?'
  return t.charAt(0)
}

export default function AttentionStudents({ students }: AttentionStudentsProps) {
  const router = useRouter()

  const top = useMemo(() => {
    if (!students) return null
    return [...students]
      .filter((s) => (s.total_incomplete_items ?? 0) > 0)
      .sort((a, b) => (b.total_incomplete_items ?? 0) - (a.total_incomplete_items ?? 0))
      .slice(0, TOP_N)
  }, [students])

  const isLoading = top === null

  return (
    <section id="home-attention-students" className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <UsersIcon width={20} height={20} />
          <span className={styles.titleText}>챙겨야 할 학생</span>
          <span className={styles.titleSub}>· 미완료 항목 많은 순</span>
        </div>
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => router.push('/management')}
        >
          전체 보기
          <ChevronRightIcon width={16} height={16} />
        </button>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      ) : top.length === 0 ? (
        <div className={styles.emptyCard}>
          <CheckIcon width={28} height={28} />
          <div className={styles.emptyTitle}>모두 잘 챙기고 계세요!</div>
          <div className={styles.emptyDesc}>
            지금은 미완료 항목이 있는 학생이 없어요. 좋은 흐름을 유지해보세요.
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {top.map((s) => (
            <div
              key={s.id}
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/students/${s.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') router.push(`/students/${s.id}`)
              }}
            >
              <div className={styles.cardTop}>
                <span className={styles.avatar}>{avatarInitial(s.name)}</span>
                <div className={styles.nameWrap}>
                  <span className={styles.name}>{s.name}</span>
                  <span className={styles.className}>
                    {s.classes?.[0]?.name ?? '반 미지정'}
                  </span>
                </div>
              </div>
              <div className={styles.incompleteRow}>
                <span className={styles.incompleteIcon}>
                  <WarningIcon width={14} height={14} />
                </span>
                <span className={styles.incompleteText}>미완료</span>
                <span className={styles.incompleteCount}>
                  {s.total_incomplete_items}건
                </span>
              </div>
              <div className={styles.completionRow}>
                <span className={styles.completionLabel}>완료율</span>
                <span className={styles.completionValue}>
                  {Math.round((s.completion_rate ?? 0) * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
