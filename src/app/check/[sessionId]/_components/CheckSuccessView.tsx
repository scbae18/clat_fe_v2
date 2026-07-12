'use client'

import * as styles from '../checkSession.css'
import {
  LABEL,
  formatLessonDateLabel,
  type CheckDoneState,
} from '../_lib/checkShared'
import { SuccessCheckIcon } from './CheckIcons'

type CheckSuccessViewProps = {
  done: CheckDoneState
  fallbackClassName: string
}

export function CheckSuccessView({ done, fallbackClassName }: CheckSuccessViewProps) {
  const displayClass = done.class_name ?? fallbackClassName
  const dateLine = formatLessonDateLabel(done.lesson_date)

  return (
    <div className={styles.page}>
      <div className={styles.contentColumn}>
        <div className={styles.successStack}>
          <SuccessCheckIcon className={styles.successIconWrap} />
          <h1 className={styles.successTitle}>출결이 확인됐어요</h1>
          <div>
            <p className={styles.successSub} style={{ marginBottom: 0 }}>
              {done.status === 'LATE' ? '선생님께 지각이' : '선생님께 출석이'}
            </p>
            <p className={styles.successSub}>자동으로 전달됐어요</p>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>반</span>
            <span className={styles.summaryVal}>{displayClass}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>날짜</span>
            <span className={styles.summaryVal}>{dateLine || '—'}</span>
          </div>
          <div className={styles.summaryRow}>
            <span className={styles.summaryKey}>상태</span>
            <span className={styles.summaryValStatus}>{LABEL[done.status]}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
