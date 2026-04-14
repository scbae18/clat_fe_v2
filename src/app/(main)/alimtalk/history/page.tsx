'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import ChevronDownIcon from '@/assets/icons/icon-chevron-down.svg'
import {
  alimtalkService,
  type AlimtalkBatchDetail,
  type AlimtalkBatchListItem,
  type AlimtalkBatchMessage,
  type AlimtalkBatchesMeta,
} from '@/services/alimtalk'
import { useToastStore } from '@/stores/toastStore'
import * as baseStyles from '../alimtalkSettings.css'
import * as styles from './history.css'

type ChipFilter = 'all' | 'complete' | 'fail' | 'LESSON' | 'ATTENDANCE'

function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, '')
  if (d.length < 10) return phone || '—'
  return `${d.slice(0, 3)}-****-${d.slice(-4)}`
}

function groupMessages(messages: AlimtalkBatchMessage[]) {
  const m = new Map<
    number,
    { name: string; student?: AlimtalkBatchMessage; parent?: AlimtalkBatchMessage }
  >()
  for (const msg of messages) {
    const cur = m.get(msg.student_id) ?? { name: msg.student_name }
    cur.name = msg.student_name
    if (msg.phone_type === 'STUDENT') cur.student = msg
    else cur.parent = msg
    m.set(msg.student_id, cur)
  }
  return Array.from(m.entries()).sort((a, b) => a[1].name.localeCompare(b[1].name, 'ko'))
}

function statusLabel(s: 'SUCCESS' | 'FAIL'): string {
  return s === 'SUCCESS' ? '\uC131\uACF5' : '\uC2E4\uD328'
}

export default function AlimtalkHistoryPage() {
  const pathname = usePathname()
  const addToast = useToastStore((s) => s.addToast)

  const [rows, setRows] = useState<AlimtalkBatchListItem[]>([])
  const [meta, setMeta] = useState<AlimtalkBatchesMeta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [chip, setChip] = useState<ChipFilter>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [details, setDetails] = useState<Record<number, AlimtalkBatchDetail>>({})
  const [detailLoading, setDetailLoading] = useState<number | null>(null)
  const [detailSelectedStudentId, setDetailSelectedStudentId] = useState<number | null>(null)

  const limit = 30

  const loadPage = useCallback(
    async (p: number, append: boolean) => {
      if (append) setLoadingMore(true)
      else setLoading(true)
      try {
        const res = await alimtalkService.getBatches({ page: p, limit })
        setMeta(res.meta)
        setRows((prev) => (append ? [...prev, ...res.data] : res.data))
        setPage(p)
      } catch {
        addToast({
          variant: 'error',
          message: '\uBC1C\uC1A1 \uB0B4\uC5ED\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.',
        })
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [addToast, limit]
  )

  useEffect(() => {
    void loadPage(1, false)
  }, [loadPage])

  const hasMore = meta != null && page * limit < meta.total

  const stats = useMemo(() => {
    const complete = rows.filter((r) => r.fail_count === 0).length
    const fail = rows.filter((r) => r.fail_count > 0).length
    const lesson = rows.filter((r) => r.type === 'LESSON').length
    const att = rows.filter((r) => r.type === 'ATTENDANCE').length
    return { complete, fail, lesson, att, total: meta?.total ?? rows.length }
  }, [rows, meta])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (chip === 'complete' && r.fail_count > 0) return false
      if (chip === 'fail' && r.fail_count === 0) return false
      if (chip === 'LESSON' && r.type !== 'LESSON') return false
      if (chip === 'ATTENDANCE' && r.type !== 'ATTENDANCE') return false
      return true
    })
  }, [rows, chip])

  const toggleRow = async (batchId: number) => {
    if (expandedId === batchId) {
      setExpandedId(null)
      return
    }
    setExpandedId(batchId)
    if (details[batchId]) return
    setDetailLoading(batchId)
    try {
      const d = await alimtalkService.getBatchDetail(batchId)
      setDetails((prev) => ({ ...prev, [batchId]: d }))
    } catch {
      addToast({
        variant: 'error',
        message: '\uC0C1\uC138 \uB0B4\uC5ED\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.',
      })
      setExpandedId(null)
    } finally {
      setDetailLoading(null)
    }
  }

  useEffect(() => {
    if (expandedId == null) {
      setDetailSelectedStudentId(null)
      return
    }
    const d = details[expandedId]
    if (!d) {
      setDetailSelectedStudentId(null)
      return
    }
    const grouped = groupMessages(d.messages)
    const ids = grouped.map(([sid]) => sid)
    setDetailSelectedStudentId((prev) => {
      if (prev != null && ids.includes(prev)) return prev
      return ids[0] ?? null
    })
  }, [expandedId, details])

  const formatSent = (iso: string) => {
    try {
      return format(new Date(iso), "M'월' d'일' (E) HH:mm", { locale: ko })
    } catch {
      return iso
    }
  }

  const recipientLabel = (n: number) => `${n}\uBA85`

  return (
    <div className={baseStyles.pageRoot}>
      <h1 className={baseStyles.pageTitle}>{'\uC54C\uB9BC\uD1A1'}</h1>

      <div className={baseStyles.tabRow}>
        <Link
          href="/alimtalk"
          className={`${baseStyles.tabLink} ${pathname === '/alimtalk' || pathname === '/alimtalk/' ? baseStyles.tabActive : baseStyles.tabInactive}`}
        >
          {'\uBB38\uC790 \uC124\uC815'}
        </Link>
        <Link
          href="/alimtalk/history"
          className={`${baseStyles.tabLink} ${pathname.startsWith('/alimtalk/history') ? baseStyles.tabActive : baseStyles.tabInactive}`}
        >
          {'\uBC1C\uC1A1 \uB0B4\uC5ED'}
        </Link>
      </div>

      <div className={styles.chipRow}>
        <button
          type="button"
          className={`${styles.chip} ${chip === 'all' ? styles.chipActive : styles.chipInactive}`}
          onClick={() => setChip('all')}
        >
          {'\uC804\uCCB4'}
          <span>{stats.total}</span>
        </button>
        <button
          type="button"
          className={`${styles.chip} ${chip === 'complete' ? styles.chipActive : styles.chipInactive}`}
          onClick={() => setChip('complete')}
        >
          {'\uBC1C\uC1A1 \uC644\uB8CC'}
          <span>{stats.complete}</span>
        </button>
        <button
          type="button"
          className={`${styles.chip} ${chip === 'fail' ? styles.chipActive : styles.chipInactive}`}
          onClick={() => setChip('fail')}
        >
          {'\uC2E4\uD328'}
          <span>{stats.fail}</span>
        </button>
        <button
          type="button"
          className={`${styles.chip} ${chip === 'LESSON' ? styles.chipActive : styles.chipInactive}`}
          onClick={() => setChip('LESSON')}
        >
          {'\uC218\uC5C5 \uBB38\uC790'}
          <span>{stats.lesson}</span>
        </button>
        <button
          type="button"
          className={`${styles.chip} ${chip === 'ATTENDANCE' ? styles.chipActive : styles.chipInactive}`}
          onClick={() => setChip('ATTENDANCE')}
        >
          {'\uCD9C\uACB0 \uBB38\uC790'}
          <span>{stats.att}</span>
        </button>
      </div>

      {loading ? (
        <div className={styles.emptyState}>{'\uBD88\uB7EC\uC624\uB294 \uC911\u2026'}</div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          {'\uD45C\uC2DC\uD560 \uBC1C\uC1A1 \uB0B4\uC5ED\uC774 \uC5C6\uC5B4\uC694.'}
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>{'\uBC1C\uC1A1 \uC77C\uC2DC'}</th>
                <th className={styles.th}>{'\uBC18'}</th>
                <th className={styles.th}>{'\uBC1C\uC1A1 \uC0C1\uD0DC'}</th>
                <th className={styles.th}>{'\uBB38\uC790 \uC720\uD615'}</th>
                <th className={styles.th}>{'\uC218\uC5C5 \uD15C\uD50C\uB9BF'}</th>
                <th className={styles.th}>{'\uBC1C\uC1A1 \uC218'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const open = expandedId === r.batch_id
                return (
                  <Fragment key={r.batch_id}>
                    <tr
                      className={`${styles.trClickable}${open ? ` ${styles.trExpanded}` : ''}`}
                      onClick={() => void toggleRow(r.batch_id)}
                    >
                      <td className={styles.td}>
                        <div className={styles.dateCell}>
                          <span
                            className={`${styles.chevron}${open ? ` ${styles.chevronOpen}` : ''}`}
                          >
                            <ChevronDownIcon width={16} height={16} />
                          </span>
                          {formatSent(r.sent_at)}
                        </div>
                      </td>
                      <td className={styles.td}>{r.class_name ?? '—'}</td>
                      <td className={styles.td}>
                        {r.fail_count > 0 ? (
                          <>
                            <span className={styles.badgeFail}>
                              {'\uC2E4\uD328'} {r.fail_count}
                              {'\uAC74'}
                            </span>
                            <button
                              type="button"
                              className={styles.resendBtn}
                              onClick={(e) => {
                                e.stopPropagation()
                                addToast({
                                  variant: 'warning',
                                  message:
                                    '\uC7AC\uBC1C\uC1A1\uC740 \uC900\uBE44 \uC911\uC774\uC5D0\uC694.',
                                })
                              }}
                            >
                              {'\uC7AC\uBC1C\uC1A1'}
                            </button>
                          </>
                        ) : (
                          <span className={styles.badgeSuccess}>{'\uBC1C\uC1A1 \uC644\uB8CC'}</span>
                        )}
                      </td>
                      <td className={styles.td}>
                        <span
                          className={
                            r.type === 'LESSON' ? styles.badgeTypeLesson : styles.badgeTypeAtt
                          }
                        >
                          {r.type === 'LESSON' ? '\uC218\uC5C5' : '\uCD9C\uACB0'}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <span className={styles.templateTag}>{r.template_name ?? '—'}</span>
                      </td>
                      <td className={styles.td}>{recipientLabel(r.total_count)}</td>
                    </tr>
                    {open && (
                      <tr className={styles.detailRow}>
                        <td className={styles.td} colSpan={6}>
                          <div className={styles.detailInner}>
                            {detailLoading === r.batch_id && (
                              <div className={styles.emptyState}>
                                {'\uC0C1\uC138 \uB0B4\uC5ED\uC744 \uBD88\uB7EC\uC624\uB294 \uC911\u2026'}
                              </div>
                            )}
                            {details[r.batch_id] && (() => {
                              const grouped = groupMessages(details[r.batch_id].messages)
                              const selected = grouped.find(
                                ([sid]) => sid === detailSelectedStudentId
                              )?.[1]
                              return (
                                <>
                                  <div className={styles.detailTitle}>
                                    {
                                      '\uBC1C\uC1A1 \uD559\uC0DD\uC744 \uC120\uD0DD\uD558\uBA74 \uBB38\uC790 \uB0B4\uC6A9\uC744 \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694'
                                    }
                                  </div>
                                  <div className={styles.studentNameRow}>
                                    {grouped.map(([sid, g]) => (
                                      <button
                                        key={sid}
                                        type="button"
                                        className={`${styles.studentNameChip}${
                                          detailSelectedStudentId === sid
                                            ? ` ${styles.studentNameChipActive}`
                                            : ''
                                        }`}
                                        title={g.name}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setDetailSelectedStudentId(sid)
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
                                            style={{
                                              color:
                                                selected.student.status === 'SUCCESS'
                                                  ? '#1DAA7F'
                                                  : '#EF4453',
                                              backgroundColor:
                                                selected.student.status === 'SUCCESS'
                                                  ? '#EDFCF5'
                                                  : '#FFF1F1',
                                            }}
                                          >
                                            {'\uD559\uC0DD'}{' '}
                                            {statusLabel(selected.student.status)}
                                          </span>
                                        )}
                                        {selected.parent && (
                                          <span
                                            className={styles.statusPill}
                                            style={{
                                              color:
                                                selected.parent.status === 'SUCCESS'
                                                  ? '#1DAA7F'
                                                  : '#EF4453',
                                              backgroundColor:
                                                selected.parent.status === 'SUCCESS'
                                                  ? '#EDFCF5'
                                                  : '#FFF1F1',
                                            }}
                                          >
                                            {'\uD559\uBD80\uBAA8'}{' '}
                                            {statusLabel(selected.parent.status)}
                                          </span>
                                        )}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: 13,
                                          color: '#757693',
                                          marginTop: 8,
                                        }}
                                      >
                                        {selected.student && (
                                          <div>
                                            {'\uD559\uC0DD'} {maskPhone(selected.student.phone)}
                                          </div>
                                        )}
                                        {selected.parent && (
                                          <div>
                                            {'\uD559\uBD80\uBAA8'}{' '}
                                            {maskPhone(selected.parent.phone)}
                                          </div>
                                        )}
                                      </div>
                                      {selected.student && (
                                        <div className={styles.msgBlock}>
                                          <strong>{'[\uD559\uC0DD\uC6A9 \uBB38\uC790]'}</strong>
                                          {'\n'}
                                          {selected.student.message_body}
                                        </div>
                                      )}
                                      {selected.parent && (
                                        <div className={styles.msgBlock}>
                                          <strong>
                                            {'[\uD559\uBD80\uBAA8\uC6A9 \uBB38\uC790]'}
                                          </strong>
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
                                              window.open(
                                                `/parent/${selected.parent!.parent_dashboard_token}`,
                                                '_blank'
                                              )
                                            }}
                                          >
                                            {'\uD559\uBD80\uBAA8 \uB300\uC2DC\uBCF4\uB4DC \uC5F4\uAE30'}
                                          </button>
                                        </div>
                                      )}
                                      {selected.student?.status === 'FAIL' &&
                                        selected.student.error_message && (
                                          <div
                                            style={{
                                              marginTop: 8,
                                              fontSize: 12,
                                              color: '#EF4453',
                                            }}
                                          >
                                            {selected.student.error_message}
                                          </div>
                                        )}
                                      {selected.parent?.status === 'FAIL' &&
                                        selected.parent.error_message && (
                                          <div
                                            style={{
                                              marginTop: 8,
                                              fontSize: 12,
                                              color: '#EF4453',
                                            }}
                                          >
                                            {selected.parent.error_message}
                                          </div>
                                        )}
                                    </div>
                                  ) : (
                                    <div className={styles.emptyState} style={{ padding: '24px' }}>
                                      {'\uD559\uC0DD\uC744 \uC120\uD0DD\uD574 \uC8FC\uC138\uC694.'}
                                    </div>
                                  )}
                                </>
                              )
                            })()}
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
      )}

      {hasMore && !loading && (
        <div className={styles.loadMoreRow}>
          <button
            type="button"
            className={styles.chipInactive}
            style={{
              cursor: loadingMore ? 'wait' : 'pointer',
              padding: '10px 20px',
              borderRadius: 8,
            }}
            disabled={loadingMore}
            onClick={() => void loadPage(page + 1, true)}
          >
            {loadingMore
              ? '\uBD88\uB7EC\uC624\uB294 \uC911\u2026'
              : `\uB354 \uBCF4\uAE30 (${meta?.total ?? 0}\uAC74 \uC911 ${rows.length}\uAC74 \uB85C\uB4DC)`}
          </button>
        </div>
      )}
    </div>
  )
}
