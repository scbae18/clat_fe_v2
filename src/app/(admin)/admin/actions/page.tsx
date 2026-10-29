'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { admin, adminErrorMessage } from '@/services/admin'
import type { AdminActionType } from '@/types/admin'
import { AdminHeader, AdminPager } from '../_components/AdminUi'
import { formatMdHm } from '../_lib/format'
import * as styles from '../admin.css'

const ACTION_LABEL: Record<AdminActionType, string> = {
  APPROVE: '승인',
  REJECT: '거절',
  DELETE: '삭제',
  SUSPEND: '정지',
  RESET_PASSWORD: '비밀번호 재설정',
}

export default function AdminActionsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'action-logs', page],
    queryFn: () => admin.listActionLogs(page, 50),
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>기록을 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  return (
    <div className={styles.stack}>
      <AdminHeader title="기록" subtitle="승인, 거절, 삭제, 정지, 비밀번호 재설정을 누가 언제 했는지 남깁니다." />
      <section className={styles.card}>
        {data.items.length === 0 ? (
          <p className={styles.empty}>아직 기록이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>시각</th>
                  <th className={styles.th}>동작</th>
                  <th className={styles.th}>대상</th>
                  <th className={styles.th}>처리한 사람</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>{formatMdHm(row.created_at)}</td>
                    <td className={styles.td}>{ACTION_LABEL[row.action]}</td>
                    <td className={styles.td}>
                      {row.target_name}
                      <span className={styles.mutedInline}> · {row.target_email}</span>
                    </td>
                    <td className={styles.td}>{row.actor_name ?? row.actor_email ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <AdminPager page={data.meta.page} limit={data.meta.limit} total={data.meta.total} onPage={setPage} />
      </section>
    </div>
  )
}
