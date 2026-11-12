'use client'

import { FormEvent, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Text from '@/components/common/Text'
import Dropdown from '@/components/common/Dropdown'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import { AdminHeader } from '../_components/AdminUi'
import { admin, adminErrorMessage, type AdminBenefitPlanCode } from '@/services/admin'
import useToast from '@/hooks/useToast'
import { formatMdHm } from '../_lib/format'
import * as styles from '../admin.css'

const BENEFIT_PLANS: Array<{ code: AdminBenefitPlanCode; label: string }> = [
  { code: 'ANY', label: '상관없음' },
  { code: 'BASIC', label: '베이직' },
  { code: 'STANDARD', label: '스탠다드' },
  { code: 'PLUS', label: '플러스' },
  { code: 'PRO', label: '프로' },
]

function won(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`
}

function parseMonths(raw: string): number | null {
  const months = Number(raw)
  if (!Number.isInteger(months) || months < 1 || months > 36) return null
  return months
}

export default function AdminBillingPage() {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [q, setQ] = useState('')
  const [search, setSearch] = useState('')
  const [codePlan, setCodePlan] = useState<AdminBenefitPlanCode>('ANY')
  const [codeMonths, setCodeMonths] = useState('1')
  const [benefitPlan, setBenefitPlan] = useState<AdminBenefitPlanCode>('ANY')
  const [benefitMonths, setBenefitMonths] = useState('1')
  const [busy, setBusy] = useState(false)
  const [confirm, setConfirm] = useState<'on' | 'off' | null>(null)
  const [latestCode, setLatestCode] = useState<string | null>(null)
  const [refundInvoiceId, setRefundInvoiceId] = useState<number | null>(null)
  const [refundAmount, setRefundAmount] = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [refundAfter, setRefundAfter] = useState<'KEEP' | 'FREE' | 'REVERT_PLAN'>('FREE')

  const precheckQuery = useQuery({
    queryKey: ['admin', 'billing', 'precheck', search],
    queryFn: () => admin.billingPrecheck(search),
    refetchOnWindowFocus: false,
  })
  const codesQuery = useQuery({
    queryKey: ['admin', 'billing', 'codes'],
    queryFn: () => admin.listBenefitCodes(),
    refetchOnWindowFocus: false,
  })
  const salesQuery = useQuery({
    queryKey: ['admin', 'billing', 'sales'],
    queryFn: () => admin.billingSales(),
    refetchOnWindowFocus: false,
  })
  const refundsQuery = useQuery({
    queryKey: ['admin', 'billing', 'refunds'],
    queryFn: () => admin.billingRefunds(),
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

  const submitCode = (event: FormEvent) => {
    event.preventDefault()
    const months = parseMonths(codeMonths)
    if (months == null) {
      error('개월 수는 1부터 36까지입니다.')
      return
    }
    void run(async () => {
      const created = await admin.createBenefitCode({ plan_code: codePlan, months })
      setLatestCode(created.code)
      success(`코드 ${created.code}를 만들었습니다.`)
    })
  }

  const giveBenefit = (userId: number, name: string) => {
    const months = parseMonths(benefitMonths)
    if (months == null) {
      error('개월 수는 1부터 36까지입니다.')
      return
    }
    void run(async () => {
      await admin.applyBillingBenefit(userId, { plan_code: benefitPlan, months })
      success(`${name}에게 ${months}개월 혜택을 넣었습니다. 카드가 없으면 등록할 때 적용됩니다.`)
    })
  }

  const data = precheckQuery.data
  const enforced = data?.enforced ?? false
  const sales = salesQuery.data

  return (
    <div className={styles.stack}>
      <AdminHeader
        title="요금제"
        subtitle="선생님은 요금제를 고르고 카드를 등록한 뒤 결제합니다. 무료 기간은 코드나 직접 입력으로 결제만 미룹니다."
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
              ? `전체 적용 시작 ${data?.enforced_at ? formatMdHm(data.enforced_at) : ''}. 결제 전이면 학생 10명, 알림톡 30통입니다.`
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
          <h2 className={styles.cardTitle}>매출</h2>
        </div>
        <div className={styles.formBody}>
          {salesQuery.isLoading ? (
            <p className={styles.loading}>매출을 불러오는 중…</p>
          ) : salesQuery.isError ? (
            <p className={styles.loading}>{adminErrorMessage(salesQuery.error)}</p>
          ) : (
            <Text variant="bodyMd" color="gray700" as="p">
              이번 달 {won(sales?.month_total ?? 0)} · {sales?.month_count ?? 0}건
              {' · '}
              누적 {won(sales?.all_total ?? 0)} · {sales?.all_count ?? 0}건
            </Text>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>결제 내역</h2>
        </div>
        {(sales?.items.length ?? 0) === 0 ? (
          <p className={styles.empty}>아직 결제나 해지가 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>시각</th>
                  <th className={styles.th}>구분</th>
                  <th className={styles.th}>선생님</th>
                  <th className={styles.th}>금액</th>
                  <th className={styles.th}>환불</th>
                </tr>
              </thead>
              <tbody>
                {sales?.items.map((item, index) => (
                  <tr key={`${item.at}-${item.kind}-${index}`}>
                    <td className={styles.td}>{formatMdHm(item.at)}</td>
                    <td className={styles.td}>{item.label}</td>
                    <td className={styles.td}>
                      {item.name}
                      {item.email ? <span className={styles.mutedInline}> · {item.email}</span> : null}
                    </td>
                    <td className={styles.td}>{item.amount == null ? '-' : won(item.amount)}</td>
                    <td className={styles.td}>
                      {item.invoice_id != null && item.amount != null ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          disabled={busy}
                          onClick={() => {
                            setRefundInvoiceId(item.invoice_id)
                            setRefundAmount(String(item.amount))
                            setRefundReason('')
                            setRefundAfter('FREE')
                          }}
                        >
                          환불
                        </Button>
                      ) : (
                        '-'
                      )}
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
          <h2 className={styles.cardTitle}>환불</h2>
        </div>
        {refundInvoiceId == null ? (
          <p className={styles.empty}>
            결제 내역에서 환불을 누르면 금액과 이유를 적습니다. 오류나 중복 결제, 요금제 올리기 차액은 여기서 처리합니다.
          </p>
        ) : (
          <form
            className={styles.formBody}
            onSubmit={(event) => {
              event.preventDefault()
              const amount = Number(refundAmount)
              if (!Number.isInteger(amount) || amount < 1 || refundReason.trim() === '') {
                error('금액과 이유를 적어 주세요.')
                return
              }
              void run(async () => {
                await admin.refundInvoice(refundInvoiceId, {
                  amount,
                  reason: refundReason.trim(),
                  after: refundAfter,
                })
                success('환불했습니다.')
                setRefundInvoiceId(null)
              })
            }}
          >
            <Text variant="bodyMd" color="gray700" as="p">
              청구 {refundInvoiceId}
            </Text>
            <div className={styles.formGrid}>
              <label className={styles.field}>
                <Text variant="labelSm" color="gray700" as="span">
                  금액
                </Text>
                <Input value={refundAmount} onChange={(event) => setRefundAmount(event.target.value)} inputMode="numeric" />
              </label>
              <div className={styles.field}>
                <Text variant="labelSm" color="gray700" as="span">
                  환불 후
                </Text>
                <Dropdown
                  fullWidth
                  value={refundAfter}
                  onChange={(value) => setRefundAfter(value as 'KEEP' | 'FREE' | 'REVERT_PLAN')}
                  options={[
                    { value: 'FREE', label: '무료로' },
                    { value: 'KEEP', label: '구독 유지' },
                    { value: 'REVERT_PLAN', label: '이전 요금제' },
                  ]}
                />
              </div>
              <label className={styles.field}>
                <Text variant="labelSm" color="gray700" as="span">
                  이유
                </Text>
                <Input value={refundReason} onChange={(event) => setRefundReason(event.target.value)} />
              </label>
            </div>
            <div className={styles.formActions}>
              <Button type="submit" variant="danger" disabled={busy}>
                환불하기
              </Button>
              <Button type="button" variant="secondary" disabled={busy} onClick={() => setRefundInvoiceId(null)}>
                닫기
              </Button>
            </div>
          </form>
        )}
        {refundsQuery.isLoading ? (
          <p className={styles.loading}>환불을 불러오는 중…</p>
        ) : (refundsQuery.data?.items.length ?? 0) === 0 ? (
          <p className={styles.empty}>환불 내역이 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>시각</th>
                  <th className={styles.th}>상태</th>
                  <th className={styles.th}>선생님</th>
                  <th className={styles.th}>금액</th>
                  <th className={styles.th}>근거</th>
                </tr>
              </thead>
              <tbody>
                {refundsQuery.data?.items.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>{formatMdHm(row.created_at)}</td>
                    <td className={styles.td}>
                      {row.status === 'DONE' ? '완료' : row.status === 'FAILED' ? '실패' : '처리 중'}
                    </td>
                    <td className={styles.td}>
                      {row.name}
                      {row.email ? <span className={styles.mutedInline}> · {row.email}</span> : null}
                    </td>
                    <td className={styles.td}>{won(row.amount)}</td>
                    <td className={styles.td}>
                      {row.reason ?? '-'}
                      {typeof row.messages === 'number' ? ` · 통수 ${row.messages}` : ''}
                      {typeof row.max_students === 'number' ? ` · 학생 ${row.max_students}` : ''}
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
          <h2 className={styles.cardTitle}>무료 혜택 코드</h2>
        </div>
        <form className={styles.formBody} onSubmit={submitCode}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                요금제
              </Text>
              <Dropdown
                fullWidth
                value={codePlan}
                onChange={(value) => setCodePlan(value as AdminBenefitPlanCode)}
                options={BENEFIT_PLANS.map((plan) => ({ value: plan.code, label: plan.label }))}
              />
            </div>
            <label className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                개월
              </Text>
              <Input value={codeMonths} onChange={(event) => setCodeMonths(event.target.value)} inputMode="numeric" />
            </label>
          </div>
          <div className={styles.formActions}>
            <Button type="submit" disabled={busy}>
              코드 만들기
            </Button>
            <Text variant="bodyMd" color="gray500" as="span">
              {latestCode ? `방금 만든 코드 ${latestCode}` : '한 사람이 쓰면 그 코드는 끝입니다. 상관없음이면 지금 쓰는 유료 요금제 그대로, 다음 결제일부터 그 개월만 청구하지 않습니다.'}
            </Text>
          </div>
        </form>
        {codesQuery.isLoading ? (
          <p className={styles.loading}>코드를 불러오는 중…</p>
        ) : codesQuery.isError ? (
          <p className={styles.loading}>{adminErrorMessage(codesQuery.error)}</p>
        ) : (codesQuery.data?.items.length ?? 0) === 0 ? (
          <p className={styles.empty}>아직 코드가 없습니다.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>코드</th>
                  <th className={styles.th}>요금제</th>
                  <th className={styles.th}>개월</th>
                  <th className={styles.th}>사용한 사람</th>
                </tr>
              </thead>
              <tbody>
                {codesQuery.data?.items.map((row) => (
                  <tr key={row.id}>
                    <td className={styles.td}>{row.code}</td>
                    <td className={styles.td}>{row.plan_name}</td>
                    <td className={styles.td}>{row.months}</td>
                    <td className={styles.td}>{row.used_by_name ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                직접 넣을 요금제
              </Text>
              <Dropdown
                fullWidth
                value={benefitPlan}
                onChange={(value) => setBenefitPlan(value as AdminBenefitPlanCode)}
                options={BENEFIT_PLANS.map((plan) => ({ value: plan.code, label: plan.label }))}
              />
            </div>
            <label className={styles.field}>
              <Text variant="labelSm" color="gray700" as="span">
                개월
              </Text>
              <Input
                value={benefitMonths}
                onChange={(event) => setBenefitMonths(event.target.value)}
                inputMode="numeric"
              />
            </label>
          </div>
          <div className={styles.formActions}>
            <Input value={q} onChange={(event) => setQ(event.target.value)} placeholder="이름 또는 이메일" />
            <Button type="submit" variant="secondary">
              찾기
            </Button>
          </div>
          <Text variant="bodyMd" color="gray500" as="p">
            혜택 넣기는 코드를 입력한 것과 같습니다. 이미 결제 중이면 다음 결제일부터 그 개월 수만큼 청구하지 않습니다. 카드가 없으면 등록할 때 적용되고, 그 전까지는 결제되지 않습니다.
          </Text>
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
                  <th className={styles.th}>현재 요금제</th>
                  <th className={styles.th}>다음 결제일</th>
                  <th className={styles.th}>학생</th>
                  <th className={styles.th}>이번 달 성공</th>
                  <th className={styles.th}>혜택</th>
                  <th className={styles.th}>적용</th>
                </tr>
              </thead>
              <tbody>
                {(data?.rows ?? []).map((row) => (
                  <tr key={row.user_id}>
                    <td className={styles.td}>{row.user_id}</td>
                    <td className={styles.td}>
                      {row.name}
                      <span className={styles.mutedInline}> · {row.email}</span>
                    </td>
                    <td className={styles.td}>{row.plan_name}</td>
                    <td className={styles.td}>
                      {row.next_billing_at ? formatMdHm(row.next_billing_at) : '-'}
                      {row.no_charge_until ? (
                        <span className={styles.mutedInline}> · {formatMdHm(row.no_charge_until)}까지 청구 없음</span>
                      ) : null}
                    </td>
                    <td className={styles.td}>{row.student_count}</td>
                    <td className={styles.td}>{row.this_month_messages}</td>
                    <td className={styles.td}>
                      <Button size="sm" variant="secondary" disabled={busy} onClick={() => giveBenefit(row.user_id, row.name)}>
                        혜택 넣기
                      </Button>
                    </td>
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
          '결제 전 계정은 학생 10명, 알림톡 30통이 됩니다.',
          `지금 기준으로 잠길 학생은 ${data?.will_lock_total ?? 0}명입니다.`,
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
    </div>
  )
}
