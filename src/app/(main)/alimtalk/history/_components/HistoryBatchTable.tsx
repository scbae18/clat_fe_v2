'use client'

import { Fragment } from 'react'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import type { AlimtalkBatchDetail, AlimtalkBatchListItem } from '@/services/alimtalk'
import * as styles from '../history.css'
import { batchStatusView, formatSent, recipientLabel } from '../_lib/historyShared'
import { BatchDetailPanel } from './BatchDetailPanel'

type HistoryBatchTableProps = {
  rows: AlimtalkBatchListItem[]
  expandedId: number | null
  details: Record<number, AlimtalkBatchDetail>
  detailLoading: number | null
  detailSelectedStudentId: number | null
  resending: boolean
  onToggleRow: (batchId: number) => void
  onSelectStudent: (studentId: number) => void
  onResendAll: () => void
  onResendStudent: (studentId: number) => void
}

export function HistoryBatchTable({
  rows,
  expandedId,
  details,
  detailLoading,
  detailSelectedStudentId,
  resending,
  onToggleRow,
  onSelectStudent,
  onResendAll,
  onResendStudent,
}: HistoryBatchTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.th} ${styles.stickyFirstCell}`}>발송 일시</th>
            <th className={styles.th}>반</th>
            <th className={styles.th}>문자 유형</th>
            <th className={styles.th}>수업 템플릿</th>
            <th className={styles.th}>발송 수</th>
            <th className={styles.th}>발송 상태</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const open = expandedId === row.batch_id
            const status = batchStatusView(row)
            return (
              <Fragment key={row.batch_id}>
                <tr className={styles.trClickable} onClick={() => onToggleRow(row.batch_id)}>
                  <td className={`${styles.td} ${styles.stickyFirstCell}`}>
                    <div className={styles.dateCell}>
                      <span className={`${styles.chevron}${open ? ` ${styles.chevronOpen}` : ''}`}>
                        <ChevronRightIcon width={16} height={16} />
                      </span>
                      {formatSent(row.sent_at)}
                    </div>
                  </td>
                  <td className={styles.td}>{row.class_name ?? '—'}</td>
                  <td className={styles.td}>
                    <span
                      className={
                        row.type === 'LESSON'
                          ? styles.badgeTypeLesson
                          : row.type === 'ATTENDANCE'
                            ? styles.badgeTypeAtt
                            : styles.badgeTypeBroadcast
                      }
                    >
                      {row.type === 'LESSON' ? '수업' : row.type === 'ATTENDANCE' ? '출결' : '공지'}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.templateTag}>{row.template_name ?? '—'}</span>
                  </td>
                  <td className={styles.td}>{recipientLabel(row.total_count)}</td>
                  <td className={styles.td}>
                    <span
                      className={
                        status.tone === 'fail'
                          ? styles.badgeFail
                          : status.tone === 'pending'
                            ? styles.badgePending
                            : styles.badgeSuccess
                      }
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
                {open && (
                  <tr className={styles.detailRow}>
                    <td className={`${styles.td} ${styles.detailCell}`} colSpan={6}>
                      <div className={styles.detailInner}>
                        {detailLoading === row.batch_id && (
                          <div className={styles.emptyState}>상세 내역을 불러오는 중…</div>
                        )}
                        {details[row.batch_id] && (
                          <BatchDetailPanel
                            detail={details[row.batch_id]}
                            selectedStudentId={detailSelectedStudentId}
                            resending={resending}
                            onSelectStudent={onSelectStudent}
                            onResendAll={onResendAll}
                            onResendStudent={onResendStudent}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
