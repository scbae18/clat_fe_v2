'use client'

import { Fragment, useState } from 'react'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import RefreshIcon from '@/assets/icons/icon-refresh.svg'
import type { AlimtalkBatchDetail, AlimtalkBatchMessage } from '@/services/alimtalk'
import * as styles from '../history.css'
import {
  canResendMessage,
  channelLabel,
  deliveryNote,
  formatSent,
  groupMessages,
  guidanceText,
  previewTitle,
} from '../_lib/historyShared'

const PAGE_SIZE = 6

type StudentFilter = 'all' | 'complete' | 'fail'

type BatchDetailPanelProps = {
  detail: AlimtalkBatchDetail
  selectedStudentId: number | null
  resending: boolean
  onSelectStudent: (studentId: number) => void
  onResendAll: () => void
  onResendStudent: (studentId: number) => void
}

function lineStatus(message: AlimtalkBatchMessage): string {
  if (message.status === 'SUCCESS') return '발송 완료'
  if (message.status === 'PENDING') return '보내는 중'
  return '실패'
}

function lineStatusClass(message: AlimtalkBatchMessage): string {
  if (message.status === 'SUCCESS') return styles.badgeSuccess
  if (message.status === 'PENDING') return styles.badgePending
  return styles.badgeFail
}

export function BatchDetailPanel({
  detail,
  selectedStudentId,
  resending,
  onSelectStudent,
  onResendAll,
  onResendStudent,
}: BatchDetailPanelProps) {
  const [filter, setFilter] = useState<StudentFilter>('all')
  const [shown, setShown] = useState(PAGE_SIZE)
  const grouped = groupMessages(detail.messages)
  const failCount = grouped.filter(([, group]) =>
    group.messages.some((message) => message.status === 'FAIL'),
  ).length
  const doneCount = grouped.filter(([, group]) =>
    group.messages.every((message) => message.status === 'SUCCESS'),
  ).length
  const resendCount = grouped.filter(([, group]) =>
    group.messages.some((message) => canResendMessage(message)),
  ).length
  const filtered = grouped.filter(([, group]) => {
    const failed = group.messages.some((message) => message.status === 'FAIL')
    const done = group.messages.every((message) => message.status === 'SUCCESS')
    if (filter === 'fail') return failed
    if (filter === 'complete') return done
    return true
  })
  const visible = filtered.slice(0, shown)
  const hidden = filtered.length - visible.length

  const chooseFilter = (next: StudentFilter) => {
    setFilter(next)
    setShown(PAGE_SIZE)
  }

  return (
    <div>
      <div className={styles.detailHead}>
        <div>
          <div className={styles.detailTitle}>보낸 학생 {grouped.length}명</div>
          <p className={styles.detailHint}>
            학생 이름을 누르면 그 학생에게 보낸 문자를 볼 수 있어요.
          </p>
        </div>
        {resendCount > 0 && (
          <button
            type="button"
            className={styles.resendBtn}
            disabled={resending}
            onClick={onResendAll}
          >
            <RefreshIcon width={16} height={16} />
            {resendCount}명 재발송
          </button>
        )}
      </div>

      <div className={styles.innerChipRow}>
        <button
          type="button"
          className={`${styles.innerChip}${filter === 'all' ? ` ${styles.innerChipActive}` : ''}`}
          onClick={() => chooseFilter('all')}
        >
          전체
          <span>{grouped.length}</span>
        </button>
        <button
          type="button"
          className={`${styles.innerChip}${filter === 'complete' ? ` ${styles.innerChipActive}` : ''}`}
          onClick={() => chooseFilter('complete')}
        >
          발송 완료
          <span>{doneCount}</span>
        </button>
        <button
          type="button"
          className={`${styles.innerChip}${filter === 'fail' ? ` ${styles.innerChipActive}` : ''}`}
          onClick={() => chooseFilter('fail')}
        >
          실패
          <span>{failCount}</span>
        </button>
      </div>

      <div className={styles.innerTableWrap}>
        <table className={styles.innerTable}>
          <thead>
            <tr>
              <th className={styles.innerTh}>학생</th>
              <th className={styles.innerTh}>수신 번호</th>
              <th className={styles.innerTh}>발송 상태</th>
              <th className={styles.innerTh}>안내</th>
              <th className={styles.innerTh}>관리</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td className={styles.innerTd} colSpan={5}>
                  표시할 학생이 없어요.
                </td>
              </tr>
            )}
            {visible.map(([studentId, group]) => {
              const open = selectedStudentId === studentId
              const failed = group.messages.some((message) => message.status === 'FAIL')
              const resendable = group.messages.some((message) => canResendMessage(message))
              const span = group.messages.length || 1
              return (
                <Fragment key={studentId}>
                  {group.messages.map((message, index) => (
                    <tr key={message.message_id}>
                      {index === 0 && (
                        <td className={`${styles.innerTd} ${styles.nameCell}`} rowSpan={span}>
                          <button
                            type="button"
                            className={styles.nameBtn}
                            onClick={() => onSelectStudent(studentId)}
                          >
                            <span className={`${styles.chevron}${open ? ` ${styles.chevronOpen}` : ''}`}>
                              <ChevronRightIcon width={16} height={16} />
                            </span>
                            {group.name}
                          </button>
                        </td>
                      )}
                      <td className={`${styles.innerTd} ${styles.phoneCell}`}>
                        <span className={message.status === 'FAIL' ? styles.phoneFail : undefined}>
                          {channelLabel(message.phone_type)} {message.phone || '—'}
                        </span>
                      </td>
                      <td className={styles.innerTd}>
                        <span className={lineStatusClass(message)}>{lineStatus(message)}</span>
                      </td>
                      <td className={styles.innerTd}>
                        <span className={styles.guideText}>{guidanceText(message) ?? ''}</span>
                      </td>
                      {index === 0 && (
                        <td className={styles.innerTd} rowSpan={span}>
                          {failed && (
                            <button
                              type="button"
                              className={styles.resendBtn}
                              disabled={resending || !resendable}
                              onClick={() => onResendStudent(studentId)}
                            >
                              <RefreshIcon width={16} height={16} />
                              재발송
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                  {open && (
                    <tr key={`${studentId}-preview`}>
                      <td className={styles.previewCell} colSpan={5}>
                        {group.messages.map((message) => (
                          <div key={message.message_id} className={styles.previewBlock}>
                            <div className={styles.previewMeta}>
                              {previewTitle(message.phone_type)}{' '}
                              <span className={styles.previewMetaMuted}>
                                {formatSent(detail.sent_at)} 발송 · {deliveryNote(message)}
                              </span>
                            </div>
                            <div className={styles.previewBubble}>{message.message_body}</div>
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {hidden > 0 && (
        <div className={styles.moreRow}>
          <button type="button" className={styles.moreBtn} onClick={() => setShown(filtered.length)}>
            {hidden}명 더 보기
            <ChevronDownIcon width={16} height={16} />
          </button>
        </div>
      )}
    </div>
  )
}
