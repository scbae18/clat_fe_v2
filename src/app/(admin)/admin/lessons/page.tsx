'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { FileText, BookOpen, Zap } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import { AdminHeader, AdminPager, StatCard } from '../_components/AdminUi'
import { BarChart, TrendChart } from '../_components/AdminCharts'
import { formatMdE, fromNow } from '../_lib/format'
import { colors } from '@/styles/tokens/colors'
import * as styles from '../admin.css'

export default function AdminLessonsPage() {
  const [page, setPage] = useState(1)
  const lessonsQ = useQuery({
    queryKey: ['admin', 'lessons', page],
    queryFn: () => admin.listLessons(page, 30),
    refetchOnWindowFocus: false,
  })
  const dashQ = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => admin.getDashboard(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  if (lessonsQ.isLoading) return <p className={styles.loading}>수업 목록을 불러오는 중…</p>
  if (lessonsQ.isError || !lessonsQ.data) {
    return <p className={styles.loading}>{adminErrorMessage(lessonsQ.error)}</p>
  }

  const data = lessonsQ.data
  const templateUsageData = data.template_usage.map((t) => ({
    label: t.name.length > 8 ? `${t.name.slice(0, 8)}…` : t.name,
    value: t.lesson_count,
  }))

  return (
    <div className={styles.stack}>
      <AdminHeader title="수업 기록" subtitle="저장 완료된 수업 기록 현황" />
      <div className={styles.kpiGrid}>
        <StatCard label="전체 수업 기록" value={data.summary.total} sub="저장 완료 기준" icon={FileText} iconTone="primary50" />
        <StatCard label="30일 신규" value={data.summary.last_30d} sub="최근 30일" icon={BookOpen} iconTone="success" />
        <StatCard
          label="임시(adhoc) 수업"
          value={data.summary.adhoc}
          sub={`전체의 ${data.summary.adhoc_rate}%`}
          icon={Zap}
          iconTone="warning"
        />
      </div>
      <div className={styles.grid2}>
        <div className={styles.statCard}>
          <h2 className={styles.sectionTitle}>30일 수업 기록 추이</h2>
          {dashQ.data ? (
            <TrendChart data={dashQ.data.lesson_daily} color={colors.primary500} label="수업 기록" />
          ) : (
            <p className={styles.empty}>차트를 불러오는 중…</p>
          )}
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.sectionTitle}>템플릿별 사용 횟수</h2>
          {templateUsageData.length > 0 ? (
            <BarChart data={templateUsageData} color={colors.primary600} valueLabel="수업 기록 수" />
          ) : (
            <p className={styles.empty}>데이터 없음</p>
          )}
        </div>
      </div>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>최근 수업 기록 (최신 30건)</h2>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>반</th>
                <th className={styles.th}>선생님</th>
                <th className={styles.th}>템플릿</th>
                <th className={styles.th}>수업일</th>
                <th className={styles.th}>저장일</th>
                <th className={styles.th}>유형</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((l) => (
                <tr key={l.id}>
                  <td className={styles.td}>{l.class_name}</td>
                  <td className={styles.td}>
                    <Link href={`/admin/users/${l.teacher_id}`} className={styles.nameLink}>
                      {l.teacher_name}
                    </Link>
                  </td>
                  <td className={styles.td}>{l.template_name}</td>
                  <td className={styles.td}>{formatMdE(l.lesson_date)}</td>
                  <td className={styles.td}>{fromNow(l.created_at)}</td>
                  <td className={styles.td}>
                    {l.is_adhoc ? (
                      <span className={styles.badge.yellow}>임시</span>
                    ) : (
                      <span className={styles.badge.slate}>정규</span>
                    )}
                  </td>
                </tr>
              ))}
              {data.items.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={6}>
                    <p className={styles.empty}>수업 기록이 없습니다.</p>
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
