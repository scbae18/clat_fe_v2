'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  TrendingUp,
  GraduationCap,
  CheckCircle2,
  FileText,
  Activity,
  AlertCircle,
  Trophy,
} from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import { AdminHeader, PctBarSm, StatCard } from './_components/AdminUi'
import { TrendChart } from './_components/AdminCharts'
import { formatLong, formatMdE, formatToday, fromNow } from './_lib/format'
import { colors } from '@/styles/tokens/colors'
import * as styles from './admin.css'

const RANK_TONE = ['gold', 'silver', 'bronze', 'rest', 'rest'] as const

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => admin.getDashboard(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>집계를 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  const k = data.kpis
  const totalUsers = k.total_users
  const maxTeacher = data.top_teachers[0]?.lesson_count ?? 1

  return (
    <div className={styles.stack}>
      <AdminHeader title="대시보드" subtitle={`${formatLong(data.generated_at)} · 베타 테스트 현황`} />

      <div className={styles.kpiGrid}>
        <Link href="/admin/users?tab=pending" className={styles.statCard}>
          <p className={styles.statLabel}>승인 대기</p>
          <p className={styles.statValue}>{data.today.pending_approvals}</p>
        </Link>
        <Link href="/admin/users?tab=pending&withdrawal=1" className={styles.statCard}>
          <p className={styles.statLabel}>탈퇴 요청</p>
          <p className={styles.statValue}>{data.today.withdrawal_requests}</p>
        </Link>
        <Link href="/admin/alimtalk?status=FAIL" className={styles.statCard}>
          <p className={styles.statLabel}>최근 발송 실패</p>
          <p className={styles.statValue}>{data.today.recent_send_failures}</p>
          <p className={styles.statHint}>최근 7일</p>
        </Link>
        <Link href="/admin/anomalies" className={styles.statCard}>
          <p className={styles.statLabel}>이상 감지</p>
          <p className={styles.statHint}>나중에 제공합니다</p>
        </Link>
      </div>

      <div className={styles.kpiGrid}>
        <StatCard
          label="가입 선생님"
          value={k.total_users}
          sub={k.withdrawal_users > 0 ? `탈퇴 요청 ${k.withdrawal_users}명` : '탈퇴 요청 없음'}
          icon={Users}
          iconTone="primary50"
        />
        <StatCard
          label="7일 활성 선생님"
          value={k.active_users_7d}
          sub={`전체의 ${totalUsers > 0 ? Math.round((k.active_users_7d / totalUsers) * 100) : 0}%`}
          icon={TrendingUp}
          iconTone="success"
        />
        <StatCard
          label="활성 반"
          value={k.active_classes}
          sub={`종료 ${k.ended_classes}개 포함 총 ${k.total_classes}개`}
          icon={GraduationCap}
          iconTone="primary100"
        />
        <StatCard
          label="등록 학생 수"
          value={k.total_students}
          sub={`반당 평균 ${k.active_classes > 0 ? Math.round(k.total_students / k.active_classes) : 0}명`}
          icon={Users}
          iconTone="primary50"
        />
        <StatCard
          label="전체 수업 기록"
          value={k.total_lessons}
          sub="저장 완료 기준"
          icon={CheckCircle2}
          iconTone="success"
        />
        <StatCard
          label="오늘 수업 기록"
          value={k.today_lessons}
          sub={formatToday(data.generated_at)}
          icon={FileText}
          iconTone="warning"
        />
        <StatCard
          label="이번 달 발송량"
          value={data.month.message_count}
          sub={`테스트 ${data.month.test_message_count}건`}
          icon={FileText}
          iconTone="primary50"
        />
        <StatCard
          label="이번 주 수업"
          value={data.wow.this_week_lessons}
          sub={`지난주 ${data.wow.last_week_lessons}건`}
          icon={Activity}
          iconTone="primary50"
          wow={data.wow.lessons}
        />
        <StatCard
          label="탈퇴 요청"
          value={k.withdrawal_users}
          sub={k.withdrawal_users > 0 ? '30일 유예 중' : '없음'}
          icon={AlertCircle}
          iconTone={k.withdrawal_users > 0 ? 'error' : 'gray'}
        />
      </div>

      <div className={styles.grid2}>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <h2 className={styles.sectionTitleInline}>30일 가입 추이</h2>
            <span className={styles.wow[data.wow.signups.pct > 0 ? 'up' : data.wow.signups.pct < 0 ? 'down' : 'flat']}>
              이번 주 {data.wow.signups.label}
            </span>
          </div>
          <p className={styles.statHint}>
            이번 주 {data.wow.this_week_signups}명 · 지난 주 {data.wow.last_week_signups}명
          </p>
          <TrendChart data={data.signup_daily} color={colors.primary500} label="가입" />
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTop}>
            <h2 className={styles.sectionTitleInline}>30일 수업 기록 추이</h2>
            <span className={styles.wow[data.wow.lessons.pct > 0 ? 'up' : data.wow.lessons.pct < 0 ? 'down' : 'flat']}>
              이번 주 {data.wow.lessons.label}
            </span>
          </div>
          <p className={styles.statHint}>
            이번 주 {data.wow.this_week_lessons}건 · 지난 주 {data.wow.last_week_lessons}건
          </p>
          <TrendChart data={data.lesson_daily} color={colors.success500} label="수업 기록" />
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.statCard}>
          <div className={styles.funnelHead}>
            <Trophy size={16} color={colors.warning500} />
            <h2 className={styles.sectionTitleInline}>30일 최다 수업 선생님</h2>
          </div>
          {data.top_teachers.length === 0 ? (
            <p className={styles.empty}>최근 30일 수업 기록 없음</p>
          ) : (
            <div className={styles.stack}>
              {data.top_teachers.map((t, i) => (
                <div key={t.id} className={styles.rankRow}>
                  <span className={styles.rankBadge[RANK_TONE[i] ?? 'rest']}>{i + 1}</span>
                  <Link href={`/admin/users/${t.id}`} className={styles.nameLink}>
                    {t.name}
                  </Link>
                  <PctBarSm pct={Math.round((t.lesson_count / maxTeacher) * 100)} />
                  <strong>{t.lesson_count}건</strong>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className={styles.statCard}>
          <div className={styles.funnelHead}>
            <Activity size={16} color={colors.success500} />
            <h2 className={styles.sectionTitleInline}>최근 활동</h2>
          </div>
          {data.recent_feed.length === 0 ? (
            <p className={styles.empty}>수업 기록 없음</p>
          ) : (
            <div className={styles.stack}>
              {data.recent_feed.map((r) => (
                <div key={r.id} className={styles.feedRow}>
                  <div className={styles.feedDot} />
                  <div>
                    <p>
                      <Link href={`/admin/users/${r.teacher_id}`} className={styles.nameLink}>
                        {r.teacher_name}
                      </Link>
                      <span className={styles.mutedInline}> · {r.class_name}</span>
                      {r.is_adhoc ? <span className={styles.badge.yellow}>임시</span> : null}
                    </p>
                    <p className={styles.muted}>
                      {r.template_name} · 수업일 {formatMdE(r.lesson_date)} · {fromNow(r.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
