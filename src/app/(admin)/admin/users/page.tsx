'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Users, Activity, UserX, AlertTriangle, ChevronRight } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import { AdminHeader, AdminPager, StatCard } from '../_components/AdminUi'
import CreateTeacherForm from '../_components/CreateTeacherForm'
import DeleteTeacherDialog from '../_components/DeleteTeacherDialog'
import { formatMd, formatYmd, fromNow } from '../_lib/format'
import * as styles from '../admin.css'

export default function AdminUsersPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'users', 'list', page],
    queryFn: () => admin.listUsers(page, 50),
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>선생님 목록을 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  const withdrawing = data.items.filter((u) => u.withdrawal_requested_at)

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="선생님 계정"
        subtitle="CLAT 서비스에 가입한 선생님 목록입니다. 삭제 시 해당 계정의 반·학생·템플릿·수업 기록이 모두 제거되며 동일 이메일로는 로그인할 수 없습니다."
      />
      <CreateTeacherForm />
      <div className={styles.kpiGrid}>
        <StatCard label="전체 가입" value={data.summary.total} icon={Users} iconTone="primary50" />
        <StatCard label="7일 활성" value={data.summary.active_7d} icon={Activity} iconTone="success" />
        <StatCard label="14일 비활성" value={data.summary.inactive_14d} icon={UserX} iconTone="warning" />
        <StatCard label="탈퇴 요청" value={data.summary.withdrawal} icon={AlertTriangle} iconTone="error" />
      </div>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>전체 선생님 목록</h2>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>이름 / 이메일</th>
                <th className={styles.th}>가입일</th>
                <th className={styles.th}>반</th>
                <th className={styles.th}>학생</th>
                <th className={styles.th}>템플릿</th>
                <th className={styles.th}>마지막 수업 기록</th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>관리</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((u) => (
                <tr key={u.id}>
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      <Link href={`/admin/users/${u.id}`} className={styles.nameLink}>
                        {u.name}
                        <ChevronRight size={14} />
                      </Link>
                      <span className={styles.muted}>{u.email}</span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      <span>{formatYmd(u.created_at)}</span>
                      <span className={styles.muted}>{fromNow(u.created_at)}</span>
                    </div>
                  </td>
                  <td className={styles.td}>{u.class_count}</td>
                  <td className={styles.td}>{u.student_count}</td>
                  <td className={styles.td}>{u.template_count}</td>
                  <td className={styles.td}>
                    {u.last_lesson_at ? (
                      <div className={styles.cellStack}>
                        <span>{formatMd(u.last_lesson_at)}</span>
                        <span className={styles.muted}>{fromNow(u.last_lesson_at)}</span>
                      </div>
                    ) : (
                      <span className={styles.mutedInline}>없음</span>
                    )}
                  </td>
                  <td className={styles.td}>
                    {u.withdrawal_requested_at ? (
                      <span className={styles.badge.red}>탈퇴 요청</span>
                    ) : u.is_active_7d ? (
                      <span className={styles.badge.green}>활성</span>
                    ) : u.is_inactive_14d ? (
                      <span className={styles.badge.yellow}>비활성</span>
                    ) : (
                      <span className={styles.badge.slate}>일반</span>
                    )}
                  </td>
                  <td className={styles.tdRight}>
                    <Link href={`/admin/users/${u.id}`} className={styles.ghostBtn}>
                      상세
                    </Link>{' '}
                    <DeleteTeacherDialog userId={u.id} email={u.email} name={u.name} />
                  </td>
                </tr>
              ))}
              {data.items.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={8}>
                    <p className={styles.empty}>가입한 선생님이 없습니다.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <AdminPager page={page} limit={data.meta.limit} total={data.meta.total} onPage={setPage} />
      </section>
      {withdrawing.length > 0 ? (
        <div className={styles.errorBox}>
          <h2 className={styles.healthTitle.error}>
            <AlertTriangle size={16} /> 탈퇴 요청 현황 ({data.summary.withdrawal}명)
          </h2>
          <div className={styles.stack}>
            {withdrawing.map((u) => (
              <div key={u.id} className={styles.statCard}>
                <strong>{u.name}</strong>
                <span className={styles.mutedInline}> {u.email}</span>
                <p className={styles.statHint}>
                  요청일: {u.withdrawal_requested_at ? formatYmd(u.withdrawal_requested_at) : '-'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
