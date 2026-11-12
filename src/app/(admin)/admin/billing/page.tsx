'use client'

import { FormEvent, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import Dropdown from '@/components/common/Dropdown'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import { AdminHeader } from '../_components/AdminUi'
import {
  admin,
  adminErrorMessage,
  type AdminGrantPlanCode,
} from '@/services/admin'
import useToast from '@/hooks/useToast'
import { formatMdHm } from '../_lib/format'
import * as styles from '../admin.css'

const PLANS: Array<{ code: AdminGrantPlanCode; label: string }> = [
  { code: 'FREE', label: '무료 · 학생 10 · 30통 · 0원' },
  { code: 'BASIC', label: '베이직 · 학생 30 · 500통 · 19,900원' },
  { code: 'STANDARD', label: '스탠다드 · 학생 80 · 1,300통 · 29,900원' },
  { code: 'PLUS', label: '플러스 · 학생 120 · 2,000통 · 39,900원' },
  { code: 'PRO', label: '프로 · 학생 무제한 · 2,500통 · 49,900원' },
]

const ROW_PLANS: Array<{ value: AdminGrantPlanCode; label: string }> = [
  { value: 'FREE', label: '무료' },
  { value: 'BASIC', label: '베이직' },
  { value: 'STANDARD', label: '스탠다드' },
  { value: 'PLUS', label: '플러스' },
  { value: 'PRO', label: '프로' },
]

const PLAN_LABEL: Record<string, string> = {
  FREE: '무료',
  BASIC: '베이직',
  STANDARD: '스탠다드',
  PLUS: '플러스',
  PRO: '프로',
}

function planLabel(code: string | null): string {
  if (!code) return '-'
  return PLAN_LABEL[code] ?? code
}

function grantLabel(status: string): string {
  if (status === 'PENDING') return '대기'
  if (status === 'ACTIVE') return '진행 중'
  if (status === 'REVOKED') return '취소됨'
  if (status === 'ENDED') return '종료'
  return status
}

function isPlanCode(code: string | null | undefined): code is AdminGrantPlanCode {
  return code === 'FREE' || code === 'BASIC' || code === 'STANDARD' || code === 'PLUS' || code === 'PRO'
}

function parseUserIds(raw: string): number[] {
  const ids = raw
    .split(/[\s,]+/)
    .map((part) => Number(part))
    .filter((id) => Number.isInteger(id) && id > 0)
  return [...new Set(ids)]
}

export default function AdminBillingPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [userIds, setUserIds] = useState('')
  const [planCode, setPlanCode] = useState<AdminGrantPlanCode>('BASIC')
  const [months, setMonths] = useState('1')
  const [memo, setMemo] = useState('')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState<'on' | 'off' | null>(null)
  const [revokeId, setRevokeId] = useState<number | null>(null)
  const [rowPlan, setRowPlan] = useState<Record<number, AdminGrantPlanCode>>({})

  const precheckQuery = useQuery({
    queryKey: ['admin', 'billing', 'precheck', search],
    queryFn: () => admin.billingPrecheck(search),
    refetchOnWindowFocus: false,
  })
  const grantsQuery = useQuery({
    queryKey: ['admin', 'billing', 'grants'],
    queryFn: () => admin.listBillingGrants(),
    refetchOnWindowFocus: false,
  })

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ['admin', 'billing'] })
  }

  const run = async (work: () => Promise<void>) => {
    setBusy(true)
    try {
      await work()
      await refresh()
    } catch (err) {
      error(adminErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const applySwitch = (enforced: boolean) => {
    setConfirm(null)
    void run(async () => {
      await admin.setBillingEnforced(enforced)
      success(enforced ? '전체 선생님에게 한도를 적용했습니다.' : '한도 적용을 껐습니다.')
    })
  }

  const submitGrant = (event: FormEvent) => {
    event.preventDefault()
    const ids = parseUserIds(userIds)
    const monthCount = Number(months)
    if (ids.length === 0) {
      error('계정 번호를 입력하세요.')
      return
    }
    if (planCode !== 'FREE' && (!Number.isInteger(monthCount) || monthCount < 1 || monthCount > 36)) {
      error('개월 수는 1부터 36까지입니다.')
      return
    }
    void run(async () => {
      const result = await admin.createBillingGrants({
        user_ids: ids,
        plan_code: planCode,
        months: planCode === 'FREE' ? 1 : monthCount,
        memo: memo.trim() || undefined,
      })
      if (result.skipped.length > 0) {
        error(result.skipped.map((row) => `${row.user_id}번: ${row.reason}`).join(' '))
      }
      const notes = [
        result.created.length > 0 ? `${result.created.length}건 적용했습니다.` : '',
        result.freed.length > 0 ? `${result.freed.length}건을 무료로 바꿨습니다.` : '',
        result.replaced.length > 0 ? '이전 적용은 바로 끊겼습니다.' : '',
      ].filter(Boolean)
      if (notes.length > 0) {
        success(notes.join(' '))
        setUserIds('')
        setMemo('')
      }
    })
  }

  const changeAccountPlan = (userId: number, name: string, code: AdminGrantPlanCode) => {
    const monthCount = Number(months)
    if (code !== 'FREE' && (!Number.isInteger(monthCount) || monthCount < 1 || monthCount > 36)) {
      error('개월 수는 1부터 36까지입니다.')
      return
    }
    void run(async () => {
      const result = await admin.createBillingGrants({
        user_ids: [userId],
        plan_code: code,
        months: code === 'FREE' ? 1 : monthCount,
      })
      if (result.skipped.length > 0) {
        error(result.skipped.map((row) => `${row.user_id}번: ${row.reason}`).join(' '))
        return
      }
      success(
        code === 'FREE'
          ? `${name} 계정을 바로 무료로 바꿨습니다.`
          : `${name} 요금제를 바꿨습니다. 이전 적용은 끊겼습니다.`,
      )
    })
  }

  const data = precheckQuery.data
  const enforced = data?.enforced ?? false

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="요금제"
        subtitle="지금은 통수만 셉니다. 한도는 전체 스위치를 켜거나, 계정마다 미리 켜야 적용됩니다."
      />

      <section className={styles.warnBox}>
        <Text variant="bodyMd" color="gray700">
          전체 스위치는 1월에 켜세요. 확인은 표의 「이 계정만 적용」으로 하세요. 이 컴퓨터에서 수업·공지·출결 알림톡을 보내면 실제 카카오로 나갑니다. 시험 발송은 통수에 들어가지 않습니다.
        </Text>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>{enforced ? '한도 적용 중' : '한도 꺼짐'}</h2>
        </div>
        <div className={styles.formBody}>
          <Text variant="bodyMd" color="gray700" as="p">
            {enforced
              ? `전체 적용 시작 ${data?.enforced_at ? formatMdHm(data.enforced_at) : ''}. 적용이 없는 계정은 학생 10명, 알림톡 30통입니다.`
              : '통수는 이번 달 기준으로 쌓입니다. 학생 추가와 알림톡은 막지 않습니다.'}
          </Text>
          <Text variant="bodyMd" color="gray500" as="p">
            승인된 선생님 {data?.teachers ?? 0}명 · 한도를 적용하면 잠길 학생 {data?.will_lock_total ?? 0}명
          </Text>
          <div className={styles.formActions}>
            {enforced ? (
              <Button variant="danger" disabled={busy} onClick={() => setConfirm('off')}>
                전체 적용 끄기
              </Button>
            ) : (
              <Button variant="danger" disabled={busy || !data} onClick={() => setConfirm('on')}>
                전체 적용 켜기
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>요금제 적용</h2>
        </div>
        <form className={styles.formBody} onSubmit={submitGrant}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                계정 번호
              </Text>
              <Input
                value={userIds}
                onChange={(event) => setUserIds(event.target.value)}
                placeholder="12 또는 12, 18"
                inputMode="numeric"
              />
            </label>
            <div className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                요금제
              </Text>
              <Dropdown
                fullWidth
                value={planCode}
                onChange={(value) => setPlanCode(value as AdminGrantPlanCode)}
                options={PLANS.map((plan) => ({ value: plan.code, label: plan.label }))}
              />
            </div>
            <label className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                개월
              </Text>
              <Input
                value={months}
                onChange={(event) => setMonths(event.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
          <label className={styles.fieldSpaced}>
            <Text variant="labelSm" color="gray700" as="span">
              메모
            </Text>
            <Input
              value={memo}
              onChange={(event) => setMemo(event.target.value)}
              placeholder="설문 참여, 테스터"
              maxLength={500}
            />
          </label>
          <div className={styles.formActions}>
            <Button type="submit" disabled={busy}>
              적용하기
            </Button>
            <Text variant="bodyMd" color="gray500" as="span">
              이미 적용 중인 계정은 이전 요금제를 바로 끊고 바꿉니다. 무료는 그 순간 무료 한도가 됩니다. 유료 요금제의 개월 수는 위 칸을 씁니다.
            </Text>
          </div>
        </form>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>선생님</h2>
        </div>
        <form
          className={styles.formBody}
          onSubmit={(event) => {
            event.preventDefault()
            setSearch(q.trim())
          }}
        >
          <div className={styles.formActions}>
            <Input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="이름 또는 이메일"
            />
            <Button type="submit" variant="secondary">
              찾기
            </Button>
          </div>
        </form>
        {precheckQuery.isLoading ? (
          <p className={styles.loading}>선생님 목록을 불러오는 중…</p>
        ) : precheckQuery.isError ? (
          <p className={styles.loading}>{adminErrorMessage(precheckQuery.error)}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={`${styles.table} ${styles.tableWide}`}>
              <thead>
                <tr>
                  <th className={styles.th}>번호</th>
                  <th className={styles.th}>선생님</th>
                  <th className={styles.th}>학생</th>
                  <th className={styles.th}>지난달 통수</th>
                  <th className={styles.th}>이번 달 성공</th>
                  <th className={styles.th}>이번 달 예약</th>
                  <th className={styles.th}>추천</th>
                  <th className={styles.th}>부여</th>
                  <th className={styles.th}>초과</th>
                  <th className={styles.th}>적용</th>
                </tr>
              </thead>
              <tbody>
                {(data?.rows ?? []).map((row) => {
                  const currentCode =
                    row.grant &&
                    (row.grant.status === 'PENDING' || row.grant.status === 'ACTIVE') &&
                    isPlanCode(row.grant.plan_code)
                      ? row.grant.plan_code
                      : 'FREE'
                  const selectedPlan = rowPlan[row.user_id] ?? currentCode
                  return (
                  <tr key={row.user_id}>
                    <td className={styles.td}>{row.user_id}</td>
                    <td className={styles.td}>
                      {row.name}
                      <span className={styles.mutedInline}> · {row.email}</span>
                    </td>
                    <td className={styles.td}>{row.student_count}</td>
                    <td className={styles.td}>{row.last_month_messages}</td>
                    <td className={styles.td}>{row.this_month_messages}</td>
                    <td className={styles.td}>{row.this_month_reserved}</td>
                    <td className={styles.td}>{planLabel(row.recommended_plan_code)}</td>
                    <td className={styles.td}>
                      <div className={styles.stack}>
                        <span>
                          {row.grant
                            ? `${planLabel(row.grant.plan_code)} ${row.grant.months}개월 · ${grantLabel(row.grant.status)}`
                            : '적용 없음'}
                        </span>
                        <Dropdown
                          fullWidth
                          value={selectedPlan}
                          onChange={(value) =>
                            setRowPlan((prev) => ({
                              ...prev,
                              [row.user_id]: value as AdminGrantPlanCode,
                            }))
                          }
                          options={ROW_PLANS}
                        />
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busy}
                          onClick={() =>
                            changeAccountPlan(row.user_id, row.name, selectedPlan)
                          }
                        >
                          변경
                        </Button>
                      </div>
                    </td>
                    <td className={styles.td}>{row.will_lock_count}</td>
                    <td className={styles.td}>
                      {enforced ? (
                        <span className={styles.badge.green}>전체 적용</span>
                      ) : (
                        <Button
                          size="sm"
                          variant={row.enforced_early ? 'danger' : 'secondary'}
                          disabled={busy}
                          onClick={() =>
                            void run(async () => {
                              await admin.setBillingEarly(row.user_id, !row.enforced_early)
                              success(
                                row.enforced_early
                                  ? `${row.name} 계정의 미리 켜기를 껐습니다.`
                                  : `${row.name} 계정만 한도를 적용했습니다.`,
                              )
                            })
                          }
                        >
                          {row.enforced_early ? '미리 켜기 끄기' : '이 계정만 적용'}
                        </Button>
                      )}
                      {row.subscription_status === 'ACTIVE' ? (
                        <div className={styles.stack}>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={busy}
                            onClick={() =>
                              void run(async () => {
                                const res = await admin.pullBillingPeriod(row.user_id)
                                success(
                                  res.pulled
                                    ? `${row.name} 결제일을 지금으로 당겼습니다. 결제는 아직입니다.`
                                    : '이미 결제 시각이 지났습니다.',
                                )
                              })
                            }
                          >
                            결제일 당기기
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            disabled={busy}
                            onClick={() =>
                              void run(async () => {
                                const res = await admin.runBillingRenewal(row.user_id)
                                success(
                                  res.charged > 0
                                    ? `${row.name} 다음 결제를 실행했습니다.`
                                    : '지금 결제할 금액이 없습니다.',
                                )
                              })
                            }
                          >
                            결제 실행
                          </Button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>적용 내역</h2>
        </div>
        {grantsQuery.isLoading ? (
          <p className={styles.loading}>적용 내역을 불러오는 중…</p>
        ) : grantsQuery.isError ? (
          <p className={styles.loading}>{adminErrorMessage(grantsQuery.error)}</p>
        ) : (grantsQuery.data?.items.length ?? 0) === 0 ? (
          <p className={styles.empty}>아직 적용이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>계정</th>
                  <th className={styles.th}>요금제</th>
                  <th className={styles.th}>상태</th>
                  <th className={styles.th}>시작</th>
                  <th className={styles.th}>끝</th>
                  <th className={styles.th}>메모</th>
                  <th className={styles.th} />
                </tr>
              </thead>
              <tbody>
                {grantsQuery.data?.items.map((grant) => (
                  <tr key={grant.id}>
                    <td className={styles.td}>
                      {grant.user_id} · {grant.name}
                    </td>
                    <td className={styles.td}>
                      {planLabel(grant.plan_code)} {grant.months}개월
                    </td>
                    <td className={styles.td}>{grantLabel(grant.status)}</td>
                    <td className={styles.td}>{grant.starts_at ? formatMdHm(grant.starts_at) : '-'}</td>
                    <td className={styles.td}>{grant.ends_at ? formatMdHm(grant.ends_at) : '-'}</td>
                    <td className={styles.td}>{grant.memo || '-'}</td>
                    <td className={styles.td}>
                      {grant.status === 'PENDING' || grant.status === 'ACTIVE' ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={busy}
                          onClick={() => setRevokeId(grant.id)}
                        >
                          취소하기
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmModal
        isOpen={confirm === 'on'}
        onClose={() => setConfirm(null)}
        onConfirm={() => applySwitch(true)}
        title="전체 선생님에게 한도를 적용할까요?"
        descriptions={[
          '적용이 없는 계정은 학생 10명, 알림톡 30통이 됩니다.',
          `지금 기준으로 잠길 학생은 ${data?.will_lock_total ?? 0}명입니다. 대기 중인 적용은 바로 시작합니다.`,
        ]}
        confirmLabel="전체 적용"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={confirm === 'off'}
        onClose={() => setConfirm(null)}
        onConfirm={() => applySwitch(false)}
        title="한도 적용을 끌까요?"
        descriptions={['학생 추가와 알림톡을 다시 막지 않습니다. 잠금 기록은 남겨 두고, 다시 켜면 그 기준으로 계산합니다.']}
        confirmLabel="끄기"
        confirmVariant="danger"
      />
      <ConfirmModal
        isOpen={revokeId != null}
        onClose={() => setRevokeId(null)}
        onConfirm={() => {
          const id = revokeId
          setRevokeId(null)
          if (id == null) return
          void run(async () => {
            const result = await admin.revokeBillingGrant(id)
            success(
              result.status === 'DELETED'
                ? '대기 중인 적용을 취소했습니다.'
                : '바로 무료로 바꿨습니다.',
            )
          })
        }}
        title="이 적용을 취소할까요?"
        descriptions={[
          '아직 시작 전이면 바로 없어집니다.',
          '이미 시작된 적용도 지금 바로 무료 한도로 돌아갑니다.',
        ]}
        confirmLabel="취소하기"
        confirmVariant="danger"
      />
    </div>
  )
}
