'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { GraduationCap, Users, BookOpen } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import { AdminHeader, AdminPager, StatCard } from '../_components/AdminUi'
import { BarChart } from '../_components/AdminCharts'
import { daysLabel, formatYmd } from '../_lib/format'
import { colors } from '@/styles/tokens/colors'
import * as styles from '../admin.css'

export default function AdminClassesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'classes', page],
    queryFn: () => admin.listClasses(page, 50),
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>반 목록을 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  const active = data.items.filter((c) => !c.ended_at)
  const ended = data.items.filter((c) => c.ended_at)
  const noLesson = active.filter((c) => c.lesson_count === 0)
  const lessonBarData = [...data.items]
    .map((c) => ({
      label: c.name.length > 6 ? `${c.name.slice(0, 6)}…` : c.name,
      value: c.lesson_count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
  const studentBarData = [...data.items]
    .map((c) => ({
      label: c.name.length > 6 ? `${c.name.slice(0, 6)}…` : c.name,
      value: c.student_count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)

  return (
    <div className={styles.stack}>
      <AdminHeader title="반 & 학생" subtitle="반 운영 현황과 학생 분포" />
      <div className={styles.kpiGrid}>
        <StatCard label="활성 반" value={data.summary.active} icon={GraduationCap} iconTone="primary50" />
        <StatCard label="종료된 반" value={data.summary.ended} icon={GraduationCap} iconTone="gray" />
        <StatCard label="전체 학생" value={data.summary.student_total} icon={Users} iconTone="primary100" />
        <StatCard label="반당 평균 학생" value={data.summary.avg_students} icon={Users} iconTone="success" />
      </div>
      <div className={styles.grid2}>
        <div className={styles.statCard}>
          <h2 className={styles.sectionTitle}>반별 수업 기록 수 (상위 10개)</h2>
          {lessonBarData.length > 0 ? (
            <BarChart data={lessonBarData} color={colors.primary500} valueLabel="수업 기록" height={220} />
          ) : (
            <p className={styles.empty}>데이터 없음</p>
          )}
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.sectionTitle}>반별 학생 수 (상위 10개)</h2>
          {studentBarData.length > 0 ? (
            <BarChart data={studentBarData} color={colors.primary400} valueLabel="학생 수" height={220} />
          ) : (
            <p className={styles.empty}>데이터 없음</p>
          )}
        </div>
      </div>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>활성 반 목록</h2>
          <span className={styles.badge.indigo}>{data.summary.active}개</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>반 이름</th>
                <th className={styles.th}>선생님</th>
                <th className={styles.th}>학원명</th>
                <th className={styles.th}>요일</th>
                <th className={styles.th}>학생 수</th>
                <th className={styles.th}>수업 기록</th>
                <th className={styles.th}>생성일</th>
              </tr>
            </thead>
            <tbody>
              {active.map((c) => (
                <tr key={c.id}>
                  <td className={styles.td}>{c.name}</td>
                  <td className={styles.td}>
                    <Link href={`/admin/users/${c.teacher_id}`} className={styles.nameLink}>
                      {c.teacher_name}
                    </Link>
                  </td>
                  <td className={styles.td}>{c.academy_name}</td>
                  <td className={styles.td}>{daysLabel(c.days_of_week)}</td>
                  <td className={styles.td}>
                    {c.student_count}
                    <span className={styles.mutedInline}>명</span>
                  </td>
                  <td className={styles.td}>
                    <BookOpen size={12} /> {c.lesson_count}
                  </td>
                  <td className={styles.td}>{formatYmd(c.created_at)}</td>
                </tr>
              ))}
              {active.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={7}>
                    <p className={styles.empty}>활성 반이 없습니다.</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <AdminPager page={page} limit={data.meta.limit} total={data.meta.total} onPage={setPage} />
      </section>
      {noLesson.length > 0 ? (
        <div className={styles.warnBox}>
          <h2 className={styles.cardTitle}>수업 기록이 없는 반 ({noLesson.length}개)</h2>
          <div className={styles.chipWrap}>
            {noLesson.map((c) => (
              <span key={c.id} className={styles.badge.yellow}>
                {c.name} ({c.teacher_name})
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {ended.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitleMuted}>종료된 반 ({data.summary.ended}개)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>반 이름</th>
                  <th className={styles.th}>선생님</th>
                  <th className={styles.th}>종료일</th>
                  <th className={styles.th}>수업 기록</th>
                </tr>
              </thead>
              <tbody>
                {ended.map((c) => (
                  <tr key={c.id}>
                    <td className={`${styles.td} ${styles.strike}`}>{c.name}</td>
                    <td className={styles.td}>{c.teacher_name}</td>
                    <td className={styles.td}>{c.ended_at ? formatYmd(c.ended_at) : '-'}</td>
                    <td className={styles.td}>{c.lesson_count}건</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  )
}
