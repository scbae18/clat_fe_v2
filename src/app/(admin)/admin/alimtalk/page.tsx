'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { MessageSquare, CheckCircle2, XCircle, Send } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import type { AdminAlimtalkStatus } from '@/types/admin'
import { AdminHeader, AdminPager, StatCard } from '../_components/AdminUi'
import { formatMdHm, formatYmd, fromNow } from '../_lib/format'
import * as styles from '../admin.css'

const FILTERS: Array<{ id: AdminAlimtalkStatus; label: string }> = [
  { id: 'all', label: '전체' },
  { id: 'SUCCESS', label: '성공만' },
  { id: 'FAIL', label: '실패만' },
]

function batchTypeLabel(type: string): string {
  if (type === 'LESSON') return '수업'
  if (type === 'ATTENDANCE') return '출결'
  if (type === 'BROADCAST') return '공지'
  return type
}

export default function AdminAlimtalkPage() {
  const [status, setStatus] = useState<AdminAlimtalkStatus>('all')
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'alimtalk', status, page],
    queryFn: () => admin.listAlimtalk(status, page, 50),
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>발송 내역을 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  const failInView = data.items.filter((r) => r.status === 'FAIL').length
  const okInView = data.items.filter((r) => r.status === 'SUCCESS').length

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="알림톡 발송 내역"
        subtitle="DB에 기록된 알림톡 메시지 단위 목록입니다. 배치(한 번에 보낸 묶음) 기준 집계와 함께, 성공·실패를 한 화면에서 필터할 수 있습니다."
      />
      <div className={styles.kpiGrid3}>
        <StatCard
          label="누적 발송 건수"
          value={data.summary.total}
          sub="AlimtalkMessage 행 기준"
          icon={Send}
          iconTone="primary50"
          accent="primary"
        />
        <StatCard
          label="성공"
          value={data.summary.success}
          sub={`실패 ${data.summary.fail.toLocaleString()}건`}
          icon={CheckCircle2}
          iconTone="success"
          accent="success"
          valueTone="success"
        />
        <StatCard
          label="실패"
          value={data.summary.fail}
          sub={`비율 ${data.summary.total > 0 ? ((data.summary.fail / data.summary.total) * 100).toFixed(1) : '0.0'}%`}
          icon={XCircle}
          iconTone="error"
          accent="error"
          valueTone="error"
        />
      </div>
      <div className={styles.headerRow}>
        <div className={styles.filterRow}>
          {FILTERS.map((f) => (
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
          <MessageSquare size={16} /> 이 화면: 성공 {okInView} / 실패 {failInView}
        </span>
      </div>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>메시지 목록</h2>
          <span className={styles.badge.indigo}>{data.items.length}건 표시</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>발송 시각</th>
                <th className={styles.th}>유형</th>
                <th className={styles.th}>모드</th>
                <th className={styles.th}>선생님</th>
                <th className={styles.th}>반 / 템플릿</th>
                <th className={styles.th}>학생</th>
                <th className={styles.th}>수신</th>
                <th className={styles.th}>전화</th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>배치</th>
                <th className={styles.th}>오류 / 미리보기</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((m) => (
                <tr key={m.message_id}>
                  <td className={styles.td}>
                    {formatMdHm(m.sent_at)}
                    <span className={styles.muted}>{fromNow(m.sent_at)}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.badge.slate}>{batchTypeLabel(m.batch_type)}</span>
                  </td>
                  <td className={styles.td}>{m.delivery_mode === 'MOCK' ? '모의' : '실발송'}</td>
                  <td className={styles.td}>
                    <Link href={`/admin/users/${m.teacher_id}`} className={styles.nameLink}>
                      {m.teacher_name}
                    </Link>
                    <span className={styles.muted}>{m.teacher_email}</span>
                  </td>
                  <td className={styles.td}>
                    {m.class_name ?? '—'}
                    <span className={styles.muted}>{m.template_name ?? '—'}</span>
                    {m.lesson_date ? <span className={styles.muted}>수업일 {formatYmd(m.lesson_date)}</span> : null}
                  </td>
                  <td className={styles.td}>{m.student_name}</td>
                  <td className={styles.td}>{m.phone_type === 'PARENT' ? '학부모' : '학생'}</td>
                  <td className={styles.mono}>{m.phone}</td>
                  <td className={styles.td}>
                    {m.status === 'SUCCESS' ? (
                      <span className={styles.badge.green}>성공</span>
                    ) : (
                      <span className={styles.badge.red}>실패</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    #{m.batch_id}{' '}
                    <span className={styles.mutedInline}>
                      ({m.success_count}/{m.total_count} 성공)
                    </span>
                  </td>
                  <td className={styles.td}>
                    {m.error_message ? (
                      <span className={styles.dropText}>{m.error_message}</span>
                    ) : (
                      <span className={styles.preview}>{m.message_preview}</span>
                    )}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={11}>
                    <p className={styles.empty}>
                      {status === 'FAIL'
                        ? '실패한 알림톡이 없습니다.'
                        : status === 'SUCCESS'
                          ? '성공한 알림톡이 없습니다.'
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
