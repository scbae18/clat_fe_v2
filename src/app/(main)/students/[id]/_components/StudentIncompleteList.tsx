'use client'

import CheckIcon from '@/assets/icons/icon-check.svg'
import type { IncompleteItem } from '@/types/student'
import { incompleteItemKey } from '@/lib/incompleteItem'
import { formatLessonDateKo } from '@/lib/formatLessonDate'
import * as styles from '../studentDashboard.css'
import { MSG } from '../_lib/studentDashboardShared'

type StudentIncompleteListProps = {
  items: IncompleteItem[]
  overdueLabel: (lessonDate: string) => string
  onSelect: (item: IncompleteItem) => void
}

export function StudentIncompleteList({
  items,
  overdueLabel,
  onSelect,
}: StudentIncompleteListProps) {
  return (
    <section className={styles.incompleteCard}>
      <h2 className={styles.incompleteTitle}>
        {MSG.incompleteTitle} <span className={styles.incompleteCount}>{items.length}</span>
      </h2>
      <div className={styles.incompleteList}>
        {items.length === 0 ? (
          <p className={styles.emptyState}>{MSG.noIncomplete}</p>
        ) : (
          items.map((item) => (
            <button
              key={incompleteItemKey(item)}
              type="button"
              className={styles.incompleteRow}
              onClick={() => onSelect(item)}
            >
              <div className={styles.incompleteLeft}>
                <CheckIcon width={24} height={24} style={{ flexShrink: 0 }} />
                <span className={styles.incompleteHomeworkMain}>{item.item_name}</span>
              </div>
              <div className={styles.incompleteTagsRow}>
                <span className={styles.incompleteClassAccent}>{item.class_name}</span>
                <span className={styles.incompleteTemplateAccent}>
                  {formatLessonDateKo(item.lesson_date)}
                </span>
                <span className={styles.badgeOverdue}>{overdueLabel(item.lesson_date)}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  )
}
