'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { admin, adminErrorMessage } from '@/services/admin'
import type { AdminUserList, AdminUserTab } from '@/types/admin'
import Input from '@/components/common/Input/Input'
import { useToastStore } from '@/stores/toastStore'
import { AdminHeader, AdminPager } from '../_components/AdminUi'
import CreateTeacherForm from '../_components/CreateTeacherForm'
import DeleteTeacherDialog from '../_components/DeleteTeacherDialog'
import { formatMd, formatYmd, fromNow } from '../_lib/format'
import * as styles from '../admin.css'

const TABS: Array<{ id: AdminUserTab; label: string }> = [
  { id: 'pending', label: '승인 대기' },
  { id: 'active', label: '활성' },
  { id: 'inactive', label: '비활성' },
]

const EMPTY_COPY: Record<AdminUserTab, string> = {
  pending: '승인 대기 중인 계정이 없습니다.',
  active: '최근 7일 안에 수업을 저장한 선생님이 없습니다.',
  inactive: '비활성 선생님이 없습니다.',
}

function readTab(value: string | null): AdminUserTab {
  if (value === 'active' || value === 'inactive' || value === 'pending') return value
  return 'pending'
}

function copyMessage(data: AdminUserList): string {
  const skipped: string[] = []
  if (data.phones_skipped.missing > 0) skipped.push(`번호 없음 ${data.phones_skipped.missing}명`)
  if (data.phones_skipped.suspended > 0) skipped.push(`정지 ${data.phones_skipped.suspended}명`)
  const tail = skipped.length > 0 ? ` ${skipped.join(', ')}은 빠졌습니다.` : ''
  return `전화번호 ${data.phones.length}개를 복사했습니다.${tail}`
}

export default function AdminUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tab = readTab(searchParams.get('tab'))
  const q = searchParams.get('q') ?? ''
  const showWithdrawal = searchParams.get('withdrawal') === '1'
  const [page, setPage] = useState(1)
  const [draft, setDraft] = useState(q)
  const queryClient = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  const { data, isLoading, isError, error, isPlaceholderData } = useQuery({
    queryKey: ['admin', 'users', 'list', tab, page, q],
    queryFn: () =>
      admin.listUsers({
        page,
        limit: 50,
        tab,
        q,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
  const withdrawalQuery = useQuery({
    queryKey: ['admin', 'users', 'withdrawal'],
    queryFn: () => admin.listUsers({ page: 1, limit: 100, withdrawal: true }),
    refetchOnWindowFocus: false,
  })
  const rejectedQuery = useQuery({
    queryKey: ['admin', 'users', 'rejected'],
    queryFn: () => admin.listUsers({ page: 1, limit: 100, approvalStatus: 'REJECTED' }),
    refetchOnWindowFocus: false,
  })
  const approve = useMutation({
    mutationFn: (id: number) => admin.setUserApproval(id, 'APPROVED'),
    onSuccess: () => {
      addToast({ variant: 'success', message: '가입을 승인했습니다.' })
      void queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
    onError: (err) => {
      addToast({ variant: 'error', message: adminErrorMessage(err) })
    },
  })

  useEffect(() => {
    setDraft(q)
  }, [q])

  useEffect(() => {
    if (!showWithdrawal || !withdrawalQuery.data?.items.length) return
    document.getElementById('withdrawal-requests')?.scrollIntoView({ block: 'start' })
  }, [showWithdrawal, withdrawalQuery.data])

  function replaceQuery(next: { tab?: AdminUserTab; q?: string }) {
    const params = new URLSearchParams()
    params.set('tab', next.tab ?? tab)
    const query = next.q !== undefined ? next.q : q
    if (query) params.set('q', query)
    if (showWithdrawal) params.set('withdrawal', '1')
    setPage(1)
    router.replace(`/admin/users?${params.toString()}`)
  }

  async function copyPhones() {
    if (!list || list.phones.length === 0) return
    try {
      await navigator.clipboard.writeText(list.phones.join('\n'))
      addToast({ variant: 'success', message: copyMessage(list) })
    } catch {
      addToast({ variant: 'error', message: '전화번호를 복사하지 못했습니다.' })
    }
  }

  const counts: Record<AdminUserTab, number> = {
    pending: data?.summary.pending ?? 0,
    active: data?.summary.active ?? 0,
    inactive: data?.summary.inactive ?? 0,
  }
  const list = data && !isPlaceholderData ? data : null
  const withdrawing = withdrawalQuery.data?.items ?? []
  const rejected = rejectedQuery.data?.items ?? []

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="사용자 관리"
        subtitle="승인 대기, 최근 7일 안에 수업을 저장한 활성 선생님, 그 외 비활성 선생님을 나눠 봅니다."
      />
      <CreateTeacherForm />
      {withdrawing.length > 0 ? (
        <div id="withdrawal-requests" className={`${styles.errorBox} ${styles.scrollAnchor}`}>
          <h2 className={styles.healthTitle.error}>
            <AlertTriangle size={16} /> 탈퇴 요청 ({data?.summary.withdrawal ?? withdrawing.length}명)
          </h2>
          <div className={styles.stack}>
            {withdrawing.map((u) => (
              <Link key={u.id} href={`/admin/users/${u.id}?tab=${tab}`} className={`${styles.statCard} ${styles.boxLink}`}>
                <strong>{u.name}</strong>
                <span className={styles.mutedInline}> {u.email}</span>
                <p className={styles.statHint}>
                  요청일: {u.withdrawal_requested_at ? formatYmd(u.withdrawal_requested_at) : '-'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {rejected.length > 0 ? (
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>거절 ({data?.summary.rejected ?? rejected.length}명)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <tbody>
                {rejected.map((u) => (
                  <tr key={u.id}>
                    <td className={styles.td}>
                      <Link href={`/admin/users/${u.id}?tab=${tab}`} className={styles.nameLink}>
                        {u.name}
                        <ChevronRight size={14} />
                      </Link>
                      <span className={styles.muted}> {u.email}</span>
                    </td>
                    <td className={styles.td}>가입일 {formatYmd(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      <div className={styles.filterRow}>
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.filterChip[tab === item.id ? 'active' : 'idle']}
            onClick={() => replaceQuery({ tab: item.id })}
          >
            {item.label} ({counts[item.id]})
          </button>
        ))}
      </div>
      <form
        className={styles.headerRow}
        onSubmit={(e) => {
          e.preventDefault()
          replaceQuery({ q: draft.trim() })
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="이름, 이메일, 전화번호"
        />
        <button type="submit" className={styles.ghostBtn}>
          검색
        </button>
      </form>
      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{TABS.find((item) => item.id === tab)?.label}</h2>
          <button
            type="button"
            className={styles.ghostBtn}
            disabled={!list || list.phones.length === 0}
            onClick={() => void copyPhones()}
          >
            전화번호 복사
          </button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>이름 / 이메일</th>
                <th className={styles.th}>전화번호</th>
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
              {isLoading || isPlaceholderData ? (
                <tr>
                  <td className={styles.td} colSpan={9}>
                    <p className={styles.loading}>사용자 목록을 불러오는 중…</p>
                  </td>
                </tr>
              ) : isError || !list ? (
                <tr>
                  <td className={styles.td} colSpan={9}>
                    <p className={styles.loading}>{adminErrorMessage(error)}</p>
                  </td>
                </tr>
              ) : (
                list.items.map((u) => (
                <tr key={u.id}>
                  <td className={styles.td}>
                    <div className={styles.cellStack}>
                      <Link href={`/admin/users/${u.id}?tab=${tab}`} className={styles.nameLink}>
                        {u.name}
                        <ChevronRight size={14} />
                      </Link>
                      <span className={styles.muted}>{u.email}</span>
                    </div>
                  </td>
                  <td className={styles.td}>{u.phone ?? '전화번호 없음'}</td>
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
                    {u.suspended_at ? (
                      <span className={styles.badge.red}>정지</span>
                    ) : tab === 'pending' ? (
                      <span className={styles.badge.yellow}>승인 대기</span>
                    ) : tab === 'active' ? (
                      <span className={styles.badge.green}>활성</span>
                    ) : (
                      <span className={styles.badge.yellow}>비활성</span>
                    )}
                  </td>
                  <td className={styles.tdRight}>
                    {tab === 'pending' ? (
                      <>
                        <button
                          type="button"
                          className={styles.ghostBtn}
                          disabled={approve.isPending}
                          onClick={() => approve.mutate(u.id)}
                        >
                          승인
                        </button>{' '}
                      </>
                    ) : null}
                    <Link href={`/admin/users/${u.id}?tab=${tab}`} className={styles.ghostBtn}>
                      상세
                    </Link>{' '}
                    <DeleteTeacherDialog userId={u.id} email={u.email} name={u.name} />
                  </td>
                </tr>
                ))
              )}
              {list && list.items.length === 0 ? (
                <tr>
                  <td className={styles.td} colSpan={9}>
                    <p className={styles.empty}>{EMPTY_COPY[tab]}</p>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        {list ? <AdminPager page={page} limit={list.meta.limit} total={list.meta.total} onPage={setPage} /> : null}
      </section>
    </div>
  )
}
