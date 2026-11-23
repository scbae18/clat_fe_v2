'use client'

import { useEffect, useState } from 'react'
import CheckIcon from '@/assets/icons/icon-check.svg'
import type { IncompleteItem } from '@/types/student'
import { incompleteItemKey } from '@/lib/incompleteItem'
import { formatLessonDateKo } from '@/lib/formatLessonDate'
import * as styles from '../studentDashboard.css'
import { MSG } from '../_lib/studentDashboardShared'

type StudentIncompleteListProps = {
  items: IncompleteItem[]
  overdueLabel: (lessonDate: string) => string
  submitting?: boolean
  onSelect: (item: IncompleteItem) => void
  onBulkComplete: (items: IncompleteItem[]) => void
}

export function StudentIncompleteList({
  items,
  overdueLabel,
  submitting = false,
  onSelect,
  onBulkComplete,
}: StudentIncompleteListProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  useEffect(() => {
    const live = new Set(items.map(incompleteItemKey))
    setSelectedKeys((prev) => prev.filter((key) => live.has(key)))
  }, [items])

  const selectedItems = items.filter((item) => selectedKeys.includes(incompleteItemKey(item)))

  const toggle = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((itemKey) => itemKey !== key) : [...prev, key],
    )
  }

  return (
    <section className={styles.incompleteCard} data-tour="student-incomplete">
      <div className={styles.incompleteHeader}>
        <h2 className={styles.incompleteTitle}>
          {MSG.incompleteTitle} <span className={styles.incompleteCount}>{items.length}</span>
        </h2>
        {items.length > 0 ? (
          <button
            type="button"
            className={styles.bulkCompleteButton}
            disabled={selectedItems.length === 0 || submitting}
            onClick={() => onBulkComplete(selectedItems)}
          >
            {MSG.bulkActionLabel}
          </button>
        ) : null}
      </div>
      <div className={styles.incompleteList}>
        {items.length === 0 ? (
          <p className={styles.emptyState}>{MSG.noIncomplete}</p>
        ) : (
          items.map((item) => {
            const key = incompleteItemKey(item)
            const selected = selectedKeys.includes(key)
            return (
              <div
                key={key}
                className={
                  selected
                    ? `${styles.incompleteRow} ${styles.incompleteRowSelected}`
                    : styles.incompleteRow
                }
              >
                <input
                  type="checkbox"
                  className={styles.incompleteCheck}
                  checked={selected}
                  disabled={submitting}
                  aria-label={`${item.item_name} 선택`}
                  onChange={() => toggle(key)}
                />
                <button
                  type="button"
                  className={styles.incompleteOpen}
                  onClick={() => onSelect(item)}
                  disabled={submitting}
                >
                  <div className={styles.incompleteLeft}>
                    <CheckIcon width={24} height={24} className={styles.incompleteCheckIcon} />
                    <span className={styles.incompleteTextBlock}>
                      <span className={styles.incompleteHomeworkMain}>{item.item_name}</span>
                      {item.note ? (
                        <span className={styles.incompleteNote}>{item.note}</span>
                      ) : null}
                    </span>
                  </div>
                  <div className={styles.incompleteTagsRow}>
                    <span className={styles.incompleteClassAccent}>{item.class_name}</span>
                    <span className={styles.incompleteTemplateAccent}>
                      {formatLessonDateKo(item.lesson_date)}
                    </span>
                    <span className={styles.badgeOverdue}>{overdueLabel(item.lesson_date)}</span>
                  </div>
                </button>
              </div>
            )
          })
        )}
      </div>
    </section>
  )
}
