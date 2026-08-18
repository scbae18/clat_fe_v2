'use client'

import { use } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Mail,
  Calendar,
  Clock,
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  ShieldAlert,
  Zap,
  CheckCircle2,
} from 'lucide-react'
import { isAxiosError } from '@/lib/api/http'
import { admin, adminErrorMessage } from '@/services/admin'
import { StatCard } from '../../_components/AdminUi'
import { BarChart, TrendChart } from '../../_components/AdminCharts'
import DeleteTeacherDialog from '../../_components/DeleteTeacherDialog'
import { daysLabel, formatMdE, formatYmd, fromNow } from '../../_lib/format'
import { colors } from '@/styles/tokens/colors'
import * as styles from '../../admin.css'

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = use(params)
  const id = Number.parseInt(rawId, 10)
  const enabled = Number.isInteger(id) && id > 0

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'users', 'detail', id],
    queryFn: () => admin.getUser(id),
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  })

  if (!enabled || (isError && isAxiosError(error) && error.response?.status === 404)) {
    return <p className={styles.loading}>선생님을 찾을 수 없습니다.</p>
  }
  if (isLoading) return <p className={styles.loading}>불러오는 중…</p>
  if (isError || !data || !Array.isArray(data.classes)) {
    return <p className={styles.loading}>{adminErrorMessage(error)}</p>
  }

  const classBarData = [...data.classes]
    .map((c) => ({
      label: c.name.length > 7 ? `${c.name.slice(0, 7)}…` : c.name,
      value: c.lesson_count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)

  const thirtyDayLessons = data.lesson_daily.reduce((s, d) => s + d.value, 0)

  return (
    <div className={styles.stack}>
      <div>
        <Link href="/admin/users" className={styles.backLink}>
          <ArrowLeft size={16} />
          선생님 목록으로
        </Link>
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.pageTitle}>{data.name}</h1>
            <div className={styles.metaRow}>
              <span>
                <Mail size={14} /> {data.email}
              </span>
              <span>
                <Calendar size={14} /> 가입 {formatYmd(data.created_at)}
              </span>
              <span>
                <Clock size={14} /> 마지막 수업 {fromNow(data.last_lesson_at)}
              </span>
            </div>
          </div>
          {data.withdrawal_requested_at ? (
            <span className={styles.badge.red}>탈퇴 요청 중</span>
          ) : data.is_active_7d ? (
            <span className={styles.badge.green}>활성</span>
          ) : (
            <span className={styles.badge.yellow}>비활성</span>
          )}
        </div>
      </div>

      <div className={styles.kpiGrid}>
        <StatCard
          label="활성 반"
          value={data.stats.active_class_count}
          sub={`종료 ${data.stats.class_count - data.stats.active_class_count}개`}
          icon={GraduationCap}
          iconTone="primary50"
        />
        <StatCard label="등록 학생" value={data.stats.student_count} sub="삭제 미포함" icon={Users} iconTone="primary100" />
        <StatCard
          label="전체 수업 기록"
          value={data.stats.lesson_count}
          sub={`임시수업 ${data.stats.adhoc_lesson_count}건`}
          icon={BookOpen}
          iconTone="success"
        />
        <StatCard label="30일 수업 기록" value={thirtyDayLessons} sub="최근 30일" icon={FileText} iconTone="warning" />
      </div>

      <div className={styles.grid2}>
        <div className={styles.statCard}>
          <h2 className={styles.sectionTitle}>30일 수업 기록 추이</h2>
          <TrendChart data={data.lesson_daily} color={colors.primary500} label="수업 기록" />
        </div>
        <div className={styles.statCard}>
          <h2 className={styles.sectionTitle}>반별 수업 기록 수</h2>
          {classBarData.length > 0 ? (
            <BarChart data={classBarData} color={colors.primary400} valueLabel="수업 기록" />
          ) : (
            <p className={styles.empty}>수업 기록 없음</p>
          )}
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>반 목록</h2>
          <span className={styles.badge.indigo}>{data.classes.length}개</span>
        </div>
        {data.classes.length === 0 ? (
          <p className={styles.empty}>등록된 반이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>반 이름</th>
                  <th className={styles.th}>학원명</th>
                  <th className={styles.th}>요일</th>
                  <th className={styles.th}>현재 학생</th>
                  <th className={styles.th}>수업 기록</th>
                  <th className={styles.th}>생성일</th>
                  <th className={styles.th}>상태</th>
                </tr>
              </thead>
              <tbody>
                {data.classes.map((c) => (
                  <tr key={c.id}>
                    <td className={styles.td}>{c.name}</td>
                    <td className={styles.td}>{c.academy_name}</td>
                    <td className={styles.td}>{daysLabel(c.days_of_week)}</td>
                    <td className={styles.td}>
                      {c.student_count}
                      <span className={styles.mutedInline}>명</span>
                    </td>
                    <td className={styles.td}>
                      {c.lesson_count}
                      <span className={styles.mutedInline}>건</span>
                    </td>
                    <td className={styles.td}>{formatYmd(c.created_at)}</td>
                    <td className={styles.td}>
                      {c.ended_at ? <span className={styles.badge.slate}>종료</span> : <span className={styles.badge.green}>활성</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>수업 템플릿</h2>
          <span className={styles.badge.indigo}>{data.templates.length}개</span>
        </div>
        {data.templates.length === 0 ? (
          <p className={styles.empty}>생성된 템플릿이 없습니다.</p>
        ) : (
          <div className={styles.divideList}>
            {data.templates.map((t) => (
              <div key={t.id} className={styles.padRow}>
                <div className={styles.headerRow}>
                  <div className={styles.funnelLeft}>
                    <strong>{t.name}</strong>
                    <span className={styles.badge.slate}>{t.lesson_count}회 사용</span>
                    <span className={styles.badge.slate}>{t.item_count}개 항목</span>
                  </div>
                  <span className={styles.mutedInline}>{formatYmd(t.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>학생 목록</h2>
          <span className={styles.badge.indigo}>{data.students.length}명</span>
        </div>
        {data.students.length === 0 ? (
          <p className={styles.empty}>등록된 학생이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>이름</th>
                  <th className={styles.th}>학교</th>
                  <th className={styles.th}>소속 반</th>
                  <th className={styles.th}>등록일</th>
                </tr>
              </thead>
              <tbody>
                {data.students.map((s) => (
                  <tr key={s.id}>
                    <td className={styles.td}>{s.name}</td>
                    <td className={styles.td}>{s.school_name ?? '-'}</td>
                    <td className={styles.td}>
                      {s.classes.length > 0 ? (
                        <span className={styles.chipWrap}>
                          {s.classes.map((name) => (
                            <span key={name} className={styles.badge.indigo}>
                              {name}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className={styles.mutedInline}>미소속</span>
                      )}
                    </td>
                    <td className={styles.td}>{formatYmd(s.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {data.recent_lessons.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>최근 수업 기록 (최신 20건)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>반</th>
                  <th className={styles.th}>템플릿</th>
                  <th className={styles.th}>수업일</th>
                  <th className={styles.th}>저장일</th>
                  <th className={styles.th}>유형</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_lessons.map((l) => (
                  <tr key={l.id}>
                    <td className={styles.td}>{l.class_name}</td>
                    <td className={styles.td}>{l.template_name}</td>
                    <td className={styles.td}>{formatMdE(l.lesson_date)}</td>
                    <td className={styles.td}>{fromNow(l.created_at)}</td>
                    <td className={styles.td}>
                      {l.is_adhoc ? (
                        <span className={styles.badge.yellow}>
                          <Zap size={12} /> 임시
                        </span>
                      ) : (
                        <span className={styles.badge.slate}>
                          <CheckCircle2 size={12} /> 정규
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <div className={styles.dangerZone}>
        <div className={styles.headerRow}>
          <div className={styles.funnelLeft}>
            <span className={styles.iconBox.error}>
              <ShieldAlert size={20} />
            </span>
            <div>
              <h2 className={styles.healthTitle.error}>위험 구역</h2>
              <p className={styles.dangerNote}>
                이 선생님 계정과 연결된 반·학생·템플릿·수업 기록을 데이터베이스에서 모두 삭제합니다. 해당
                이메일로는 더 이상 로그인할 수 없습니다.
              </p>
            </div>
          </div>
          <DeleteTeacherDialog userId={data.id} email={data.email} name={data.name} variant="danger-zone" />
        </div>
      </div>
    </div>
  )
}
