'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import type { AdminHealth } from '@/types/admin'
import { AdminHeader } from '../_components/AdminUi'
import { formatMd, fromNow } from '../_lib/format'
import { colors } from '@/styles/tokens/colors'
import * as styles from '../admin.css'

type Tone = 'ok' | 'warn' | 'error' | 'info'

function sampleText(sample: Record<string, string | number | null>): string {
  const name = sample.name ?? sample.email ?? sample.id
  const extra =
    typeof sample.teacher_name === 'string'
      ? sample.teacher_name
      : typeof sample.last_lesson_at === 'string'
        ? fromNow(sample.last_lesson_at)
        : typeof sample.email === 'string'
          ? sample.email
          : ''
  return extra ? `${String(name)} · ${extra}` : String(name)
}

function StatusIcon({ status }: { status: Tone }) {
  if (status === 'ok') return <CheckCircle2 size={20} color={colors.success500} />
  if (status === 'warn') return <AlertTriangle size={20} color={colors.warning500} />
  if (status === 'error') return <XCircle size={20} color={colors.error500} />
  return <Info size={20} color={colors.primary500} />
}

export default function AdminHealthPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'health'],
    queryFn: () => admin.getHealth(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })

  if (isLoading) return <p className={styles.loading}>헬스 집계를 불러오는 중…</p>
  if (isError || !data) return <p className={styles.loading}>{adminErrorMessage(error)}</p>

  const extra: AdminHealth['checks'] = [
    {
      key: 'withdrawal',
      label: '탈퇴 요청',
      description: '30일 유예 기간 중인 탈퇴 요청 선생님.',
      status: data.info.withdrawal_users === 0 ? 'ok' : 'warn',
      count: data.info.withdrawal_users,
      samples: [],
    },
    {
      key: 'new_users',
      label: '30일 신규 가입',
      description: '최근 30일간 가입한 선생님 수.',
      status: 'info',
      count: data.info.new_users_30d,
      samples: [],
    },
  ]

  const items = [...data.checks, ...extra]
  const okCount = items.filter((i) => i.status === 'ok').length
  const warnCount = items.filter((i) => i.status === 'warn').length
  const errorCount = items.filter((i) => i.status === 'error').length
  const classesCheck = data.checks.find((c) => c.key === 'classes_no_lessons')
  const inactiveCheck = data.checks.find((c) => c.key === 'inactive_teachers_14d')
  const unenrolledCheck = data.checks.find((c) => c.key === 'unenrolled_students')
  const unusedCheck = data.checks.find((c) => c.key === 'unused_templates')

  return (
    <div className={styles.stack}>
      <AdminHeader title="헬스체크" subtitle="베타 테스트 기간 데이터 품질 & 이슈 모니터링" />
      <div className={styles.kpiGrid3}>
        <div className={styles.statCardAccent.success}>
          <p className={styles.statValueSuccess}>{okCount}</p>
          <p className={styles.statHint}>정상</p>
        </div>
        <div className={styles.statCardAccent.warning}>
          <p className={styles.statValueWarning}>{warnCount}</p>
          <p className={styles.statHint}>경고</p>
        </div>
        <div className={styles.statCardAccent.error}>
          <p className={styles.statValueError}>{errorCount}</p>
          <p className={styles.statHint}>위험</p>
        </div>
      </div>

      <div className={styles.grid2}>
        {items.map((item) => (
          <div key={item.key} className={styles.healthCard[item.status]}>
            <div className={styles.headerRow}>
              <div className={styles.funnelLeft}>
                <StatusIcon status={item.status} />
                <h3 className={styles.healthTitle[item.status]}>{item.label}</h3>
              </div>
              <span className={styles.healthCount[item.status]}>{item.count}</span>
            </div>
            <p className={styles.pageSub}>{item.description}</p>
            {item.key === 'new_users' ? (
              <p className={styles.statHint}>전체 {data.info.total_users}명 중</p>
            ) : null}
          </div>
        ))}
      </div>

      {classesCheck && classesCheck.samples.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>수업 기록 없는 반 상세 ({classesCheck.count}개)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>선생님</th>
                  <th className={styles.th}>반 이름</th>
                </tr>
              </thead>
              <tbody>
                {classesCheck.samples.map((s) => (
                  <tr key={String(s.id)}>
                    <td className={styles.td}>{String(s.teacher_name ?? '')}</td>
                    <td className={styles.td}>{String(s.name ?? '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {inactiveCheck && inactiveCheck.samples.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>14일 비활성 선생님 ({inactiveCheck.count}명)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>이름</th>
                  <th className={styles.th}>이메일</th>
                  <th className={styles.th}>마지막 수업</th>
                </tr>
              </thead>
              <tbody>
                {inactiveCheck.samples.map((s) => (
                  <tr key={String(s.id)}>
                    <td className={styles.td}>
                      {typeof s.id === 'number' ? (
                        <Link href={`/admin/users/${s.id}`} className={styles.nameLink}>
                          {String(s.name ?? '')}
                        </Link>
                      ) : (
                        String(s.name ?? '')
                      )}
                    </td>
                    <td className={styles.td}>{String(s.email ?? '')}</td>
                    <td className={styles.td}>
                      {typeof s.last_lesson_at === 'string' ? formatMd(s.last_lesson_at) : '없음'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {unenrolledCheck && unenrolledCheck.samples.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>반 미소속 학생 ({unenrolledCheck.count}명)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>학생 이름</th>
                  <th className={styles.th}>등록 선생님</th>
                </tr>
              </thead>
              <tbody>
                {unenrolledCheck.samples.map((s) => (
                  <tr key={String(s.id)}>
                    <td className={styles.td}>{String(s.name ?? '')}</td>
                    <td className={styles.td}>{String(s.teacher_name ?? '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {unusedCheck && unusedCheck.samples.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>미사용 템플릿 ({unusedCheck.count}개)</h2>
          </div>
          <div className={`${styles.padRow} ${styles.chipWrap}`}>
            {unusedCheck.samples.map((s) => (
              <span key={String(s.id)} className={styles.badge.slate}>
                {sampleText(s)}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {(classesCheck?.count ?? 0) === 0 && (inactiveCheck?.count ?? 0) === 0 ? (
        <div className={styles.okBanner}>
          <CheckCircle2 size={48} color={colors.success500} />
          <h3 className={styles.pageTitle}>모든 항목이 정상입니다!</h3>
          <p className={styles.statHint}>현재 데이터 품질 이슈가 없습니다.</p>
        </div>
      ) : null}
    </div>
  )
}
