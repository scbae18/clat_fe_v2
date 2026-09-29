'use client'

import { Fragment, useState } from 'react'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import { formatSent, maskPhone, statusLabel } from '@/app/(main)/alimtalk/history/_lib/historyShared'
import type { AlimtalkHistoryRow, StudentAlimtalkMessage } from '@/services/studentDashboard'
import { MSG } from '../_lib/studentDashboardShared'
import * as styles from '../studentDashboard.css'

const TYPE_LABEL = {
  LESSON: MSG.alimTypeLesson,
  ATTENDANCE: MSG.alimTypeAttendance,
  BROADCAST: MSG.alimTypeBroadcast,
} as const

const TYPE_CLASS = {
  LESSON: styles.alimTypeLesson,
  ATTENDANCE: styles.alimTypeAttendance,
  BROADCAST: styles.alimTypeBroadcast,
} as const

function channelLabel(phoneType: StudentAlimtalkMessage['phone_type']) {
  return phoneType === 'STUDENT' ? MSG.alimStudent : MSG.alimParent
}

function messageTitle(phoneType: StudentAlimtalkMessage['phone_type']) {
  return phoneType === 'STUDENT' ? MSG.alimStudentMsg : MSG.alimParentMsg
}

export function StudentAlimtalkHistory({ rows }: { rows: AlimtalkHistoryRow[] }) {
  const [openId, setOpenId] = useState<number | null>(null)

  if (rows.length === 0) {
    return <div className={styles.emptyState}>{MSG.noAlim}</div>
  }

  return (
    <div className={styles.alimTableWrap}>
      <table className={styles.listTable}>
        <thead>
          <tr>
            <th className={styles.th}>{MSG.thSentAt}</th>
            <th className={styles.th}>{MSG.thAlimClass}</th>
            <th className={styles.th}>{MSG.thAlimStatus}</th>
            <th className={styles.th}>{MSG.thAlimType}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const open = openId === row.batch_id
            const parentToken = row.messages.find(
              (m) => m.phone_type === 'PARENT' && m.parent_dashboard_token,
            )?.parent_dashboard_token
            return (
              <Fragment key={row.batch_id}>
                <tr
                  className={`${styles.alimRow}${open ? ` ${styles.alimRowOpen}` : ''}`}
                  onClick={() => setOpenId(open ? null : row.batch_id)}
                >
                  <td className={styles.td}>
                    <div className={styles.alimDateCell}>
                      <span className={`${styles.alimChevron}${open ? ` ${styles.alimChevronOpen}` : ''}`}>
                        <ChevronDownIcon width={16} height={16} />
                      </span>
                      {formatSent(row.sent_at)}
                    </div>
                  </td>
                  <td className={styles.td}>{row.class_name ?? '—'}</td>
                  <td className={styles.td}>
                    <span className={row.status === 'SUCCESS' ? styles.alimBadgeOk : styles.alimBadgeFail}>
                      {row.status === 'SUCCESS' ? MSG.alimSentOk : MSG.alimSentFail}
                    </span>
                  </td>
                  <td className={styles.td}>
                    <span className={TYPE_CLASS[row.type]}>{TYPE_LABEL[row.type]}</span>
                  </td>
                </tr>
                {open && (
                  <tr className={styles.alimDetailRow}>
                    <td className={styles.td} colSpan={4}>
                      <div className={styles.alimDetailInner}>
                        <div className={styles.alimDetailCard}>
                          <div className={styles.alimChannelRow}>
                            {row.messages.map((m) => (
                              <span
                                key={m.message_id}
                                className={m.status === 'SUCCESS' ? styles.alimPillOk : styles.alimPillFail}
                              >
                                {channelLabel(m.phone_type)} {statusLabel(m.status)}
                              </span>
                            ))}
                          </div>
                          {row.messages.map((m) => (
                            <div key={`phone-${m.message_id}`} className={styles.alimPhoneLine}>
                              {channelLabel(m.phone_type)} {maskPhone(m.phone)}
                            </div>
                          ))}
                          {row.messages.map((m) => (
                            <div key={`body-${m.message_id}`} className={styles.alimMsgBlock}>
                              <strong>[{messageTitle(m.phone_type)}]</strong>
                              {'\n'}
                              {m.message_body}
                            </div>
                          ))}
                          {row.messages.map(
                            (m) =>
                              m.status === 'FAIL' &&
                              m.error_message && (
                                <div key={`err-${m.message_id}`} className={styles.alimError}>
                                  {channelLabel(m.phone_type)} {m.error_message}
                                </div>
                              ),
                          )}
                          {parentToken && (
                            <button
                              type="button"
                              className={styles.alimParentLink}
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`/parent/${parentToken}`, '_blank')
                              }}
                            >
                              {MSG.alimOpenParent}
                            </button>
                          )}
                        </div>
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
