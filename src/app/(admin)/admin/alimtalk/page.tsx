'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, CheckCircle2, XCircle, Send, ChevronRight } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import type { AdminAlimtalkBatchType, AdminAlimtalkStatus } from '@/types/admin'
import { AdminHeader, AdminPager, StatCard } from '../_components/AdminUi'
import { formatMdHm, formatYmd, fromNow } from '../_lib/format'
import { batchTitle, batchTypeLabel } from '../_lib/alimtalk'
import * as styles from '../admin.css'

const STATUS_FILTERS: Array<{ id: AdminAlimtalkStatus; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'SUCCESS', label: '성공만' },
  { id: 'FAIL', label: '실패 포함' },
]

const TYPE_FILTERS: Array<{ id: AdminAlimtalkBatchType | 'all'; label: string }> = [
  { id: 'all', label: '모든 유형' },
  { id: 'LESSON', label: '수업' },
  { id: 'ATTENDANCE', label: '출결' },
  { id: 'BROADCAST', label: '공지' },
]

export default function AdminAlimtalkPage() {
  const router = useRouter()
  const [status, setStatus] = useState<AdminAlimtalkStatus>('all')
  const [type, setType] = useState<AdminAlimtalkBatchType | 'all'>('all')
  const [page, setPage] = useState(1)
  const typeParam = type === 'all' ? undefined : type
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'alimtalk', 'batches', status, type, page],
    queryFn: () => admin.listAlimtalkBatches(status, page, 50, typeParam),
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>발송 내역을 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="알림톡 발송 내역"
        subtitle="수업·출결·공지를 한 번 보낸 단위로 보여 줍니다. 행을 누르면 수신자와 문자 본문을 확인할 수 있습니다."
      />
      <div className={styles.kpiGrid3}>
        <StatCard
          label="발송 횟수"
          value={data.summary.batch_total}
          sub="수업·출결·공지 묶음"
          icon={Send}
          iconTone="primary50"
          accent="primary"
        />
        <StatCard
          label="메시지 성공"
          value={data.summary.success}
          sub={`전체 ${data.summary.total.toLocaleString()}건`}
          icon={CheckCircle2}
          iconTone="success"
          accent="success"
          valueTone="success"
        />
        <StatCard
          label="메시지 실패"
          value={data.summary.fail}
          sub={`실패 포함 발송 ${data.summary.batch_with_fail.toLocaleString()}회`}
          icon={XCircle}
          iconTone="error"
          accent="error"
          valueTone="error"
        />
      </div>
      <div className={styles.headerRow}>
        <div className={styles.filterRow}>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={styles.filterChip[status === f.id ? 'active' : 'idle']}
              onClick={() => {
                setStatus(f.id)
                setPage(1)
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className={styles.mutedInline}>
          <MessageSquare size={16} /> {data.items.length}건 표시
        </span>
      </div>
      <div className={styles.filterRow}>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={styles.filterChip[type === f.id ? 'active' : 'idle']}
            onClick={() => {
              setType(f.id)
              setPage(1)
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>발송 목록</h2>
          <span className={styles.badge.indigo}>{data.meta.total}회</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={`${styles.table} ${styles.tableWide}`}>
            <thead>
              <tr>
                <th className={styles.th}>발송 시각</th>
                <th className={styles.th}>유형</th>
                <th className={styles.th}>반 / 수업</th>
                <th className={styles.th}>선생님</th>
                <th className={styles.th}>발송</th>
                <th className={styles.th}>모드</th>
                <th className={styles.th} />
              </tr>
            </thead>
            <tbody>
              {data.items.map((row) => (
                <tr
                  key={row.batch_id}
                  className={styles.clickRow}
                  onClick={() => router.push(`/admin/alimtalk/${row.batch_id}`)}
                >
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      <span>{formatMdHm(row.sent_at)}</span>
                      <span className={styles.muted}>{fromNow(row.sent_at)}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badge.slate}>{batchTypeLabel(row.batch_type)}</span>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      <span>{batchTitle(row)}</span>
                      {row.lesson_date ? (
                        <span className={styles.muted}>수업일 {formatYmd(row.lesson_date)}</span>
                      ) : null}
                      {row.template_name ? (
                        <span className={styles.muted}>{row.template_name}</span>
                      ) : null}
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      <Link
                        href={`/admin/users/${row.teacher_id}`}
                        className={styles.nameLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {row.teacher_name}
                      </Link>
                      <span className={styles.muted}>{row.teacher_email}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      {row.fail_count > 0 ? (
                        <span className={styles.badge.red}>실패 {row.fail_count}건</span>
                      ) : (
                        <span className={styles.badge.green}>발송 완료</span>
                      )}
                      <span className={styles.muted}>
                        {row.success_count}/{row.total_count} 성공
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>{row.delivery_mode === 'MOCK' ? '모의' : '실발송'}</td>
                  <td className={styles.td}>
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
              {data.items.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={7}>
                    <p className={styles.empty}>
                      {status === 'FAIL'
                        ? '실패한 발송이 없습니다.'
                        : status === 'SUCCESS'
                          ? '성공한 발송이 없습니다.'
                          : '알림톡 발송 기록이 없습니다.'}
                    </p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <AdminPager page={page} limit={data.meta.limit} total={data.meta.total} onPage={setPage} />
      </section>
    </div>
  )
}
