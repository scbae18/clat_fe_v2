'use client'

import type { AlimtalkBatchDetail } from '@/services/alimtalk'
import { colors } from '@/styles/tokens/colors'
import { fontStyles } from '@/styles/tokens/typography'
import * as styles from '../history.css'
import {
  groupMessages,
  maskPhone,
  statusLabel,
  statusPillStyle,
} from '../_lib/historyShared'

type BatchDetailPanelProps = {
  detail: AlimtalkBatchDetail
  selectedStudentId: number | null
  onSelectStudent: (studentId: number) => void
}

export function BatchDetailPanel({
  detail,
  selectedStudentId,
  onSelectStudent,
}: BatchDetailPanelProps) {
  const grouped = groupMessages(detail.messages)
  const selected = grouped.find(([sid]) => sid === selectedStudentId)?.[1]

  return (
    <>
      <div className={styles.detailTitle}>
        발송 학생을 선택하면 문자 내용을 확인할 수 있어요
      </div>
      <div className={styles.studentNameRow}>
        {grouped.map(([sid, g]) => (
          <button
            key={sid}
            type="button"
            className={`${styles.studentNameChip}${
              selectedStudentId === sid ? ` ${styles.studentNameChipActive}` : ''
            }`}
            title={g.name}
            onClick={(e) => {
              e.stopPropagation()
              onSelectStudent(sid)
            }}
          >
            {g.name}
          </button>
        ))}
      </div>
      {selected ? (
        <div className={styles.studentCard}>
          <div>
            <strong>{selected.name}</strong>
            {selected.student && (
              <span
                className={styles.statusPill}
                style={statusPillStyle(selected.student.status)}
              >
                학생 {statusLabel(selected.student.status)}
              </span>
            )}
            {selected.parent && (
              <span
                className={styles.statusPill}
                style={statusPillStyle(selected.parent.status)}
              >
                학부모 {statusLabel(selected.parent.status)}
              </span>
            )}
          </div>
          <div style={{ fontSize: fontStyles.bodyMd.fontSize, color: colors.gray600, marginTop: 8 }}>
            {selected.student && <div>학생 {maskPhone(selected.student.phone)}</div>}
            {selected.parent && <div>학부모 {maskPhone(selected.parent.phone)}</div>}
          </div>
          {selected.student && (
            <div className={styles.msgBlock}>
              <strong>[학생용 문자]</strong>
              {'\n'}
              {selected.student.message_body}
            </div>
          )}
          {selected.parent && (
            <div className={styles.msgBlock}>
              <strong>[학부모용 문자]</strong>
              {'\n'}
              {selected.parent.message_body}
            </div>
          )}
          {selected.parent?.parent_dashboard_token && (
            <div style={{ marginTop: 10 }}>
              <button
                type="button"
                className={styles.studentNameChip}
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`/parent/${selected.parent!.parent_dashboard_token}`, '_blank')
                }}
              >
                학부모 대시보드 열기
              </button>
            </div>
          )}
          {selected.student?.status === 'FAIL' && selected.student.error_message && (
            <div style={{ marginTop: 8, fontSize: fontStyles.labelSm.fontSize, color: colors.error500 }}>
              {selected.student.error_message}
            </div>
          )}
          {selected.parent?.status === 'FAIL' && selected.parent.error_message && (
            <div style={{ marginTop: 8, fontSize: fontStyles.labelSm.fontSize, color: colors.error500 }}>
              {selected.parent.error_message}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.emptyState} style={{ padding: '24px' }}>
          학생을 선택해 주세요.
        </div>
      )}
    </>
  )
}
