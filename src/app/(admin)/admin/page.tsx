'use client'

import type { CSSProperties } from 'react'
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
  Filter,
  Trophy,
} from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import { AdminHeader, PctBar, PctBarSm, StatCard, UsageRing } from './_components/AdminUi'
import { BarChart, TrendChart } from './_components/AdminCharts'
import { formatLong, formatMdE, formatToday, fromNow } from './_lib/format'
import { colors } from '@/styles/tokens/colors'
import * as styles from './admin.css'

const FUNNEL_COLORS = [
  colors.primary500,
  colors.primary400,
  colors.primary600,
  colors.primary700,
  colors.success500,
]

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
  const usage = [
    { label: '반 개설', count: data.funnel.find((f) => f.label === '반 생성')?.count ?? 0, color: colors.primary500 },
    { label: '학생 등록', count: data.funnel.find((f) => f.label === '학생 등록')?.count ?? 0, color: colors.primary400 },
    { label: '템플릿 생성', count: data.funnel.find((f) => f.label === '템플릿 생성')?.count ?? 0, color: colors.primary600 },
    { label: '수업 기록', count: data.funnel.find((f) => f.label === '수업 기록')?.count ?? 0, color: colors.success500 },
  ]

  return (
    <div className={styles.stack}>
      <AdminHeader title="대시보드" subtitle={`${formatLong(data.generated_at)} · 베타 테스트 현황`} />

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

      <div className={styles.statCard}>
        <div className={styles.funnelHead}>
          <Filter size={16} color={colors.gray500} />
          <h2 className={styles.sectionTitleInline}>온보딩 퍼널</h2>
          <span className={styles.mutedInline}>가입 후 각 기능을 실제로 사용한 선생님 수</span>
        </div>
        <div className={styles.stack}>
          {data.funnel.map((step, i) => {
            const pct = totalUsers > 0 ? Math.round((step.count / totalUsers) * 100) : 0
            const dropFrom = i > 0 ? data.funnel[i - 1].count : totalUsers
            const drop = dropFrom - step.count
            return (
              <div key={step.label}>
                <div className={styles.funnelStepHead}>
                  <div className={styles.funnelLeft}>
                    <span
                      className={styles.funnelNum}
                      style={{ '--step': FUNNEL_COLORS[i] ?? colors.primary500 } as CSSProperties}
                    >
                      {i + 1}
                    </span>
                    <span>{step.label}</span>
                    {i > 0 && drop > 0 ? <span className={styles.dropText}>▼ {drop}명 이탈</span> : null}
                  </div>
                  <div className={styles.funnelLeft}>
                    <strong>{step.count}명</strong>
                    <span className={styles.mutedInline}>{pct}%</span>
                  </div>
                </div>
                <PctBar pct={pct} color={FUNNEL_COLORS[i]} />
              </div>
            )
          })}
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

      <div className={styles.statCard}>
        <h2 className={styles.sectionTitle}>요일별 수업 기록 분포</h2>
        <p className={styles.chartNote}>전체 기간 기준 · 어느 요일에 수업이 많이 기록되는지</p>
        <BarChart data={data.dow} color={colors.primary500} valueLabel="수업 기록" height={180} />
      </div>

      <div className={styles.statCard}>
        <h2 className={styles.sectionTitle}>기능별 활용률</h2>
        <p className={styles.chartNote}>전체 {totalUsers}명 중 각 기능을 1회 이상 사용한 선생님 비율</p>
        <div className={styles.usageGrid}>
          {usage.map((f) => {
            const pct = totalUsers > 0 ? Math.round((f.count / totalUsers) * 100) : 0
            return (
              <div key={f.label} className={styles.usageCell}>
                <UsageRing pct={pct} color={f.color} />
                <p>{f.label}</p>
                <p className={styles.muted}>{f.count}명</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
