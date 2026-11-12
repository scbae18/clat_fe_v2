import { moneyLabel } from '@/lib/billingView'
import type { BillingPlans } from '@/services/billing'
import * as styles from '@/app/(main)/billing/billing.css'

type Plan = BillingPlans['plans'][number]

function studentLabel(limit: number | null): string {
  return limit == null ? '제한 없음' : `${limit.toLocaleString('ko-KR')}명`
}

function overageLabel(plan: Plan): string {
  if (plan.overage_cap_messages <= 0) return '없음'
  return `${plan.overage_unit_price}원 · ${plan.overage_cap_messages.toLocaleString('ko-KR')}통`
}

const ROWS: Array<{ label: string; value: (plan: Plan) => string }> = [
  {
    label: '월 요금',
    value: (plan) => (plan.monthly_price === 0 ? '0원' : moneyLabel(plan.monthly_price)),
  },
  { label: '학생', value: (plan) => studentLabel(plan.student_limit) },
  {
    label: '알림톡',
    value: (plan) => `${plan.included_messages.toLocaleString('ko-KR')}통`,
  },
  { label: '초과 사용', value: overageLabel },
]

export default function PlanCompare({
  plans,
  currentCode,
  recommendedCode,
}: {
  plans: Plan[]
  currentCode: string
  recommendedCode: string
}) {
  return (
    <div className={styles.compareScroll}>
      <table className={styles.compareTable}>
        <thead>
          <tr>
            <th className={styles.labelCell} scope="col" />
            {plans.map((plan) => {
              const current = plan.code === currentCode
              const recommended = plan.code === recommendedCode && !current
              return (
                <th
                  key={plan.code}
                  scope="col"
                  className={`${styles.planHead}${current ? ` ${styles.currentCol}` : ''}`}
                >
                  <div className={styles.planBadge}>{current ? '지금' : recommended ? '추천' : ''}</div>
                  <div className={styles.planName}>{plan.name}</div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th className={styles.labelCell} scope="row">
                {row.label}
              </th>
              {plans.map((plan) => (
                <td
                  key={plan.code}
                  className={`${styles.planCell}${plan.code === currentCode ? ` ${styles.currentCol}` : ''}`}
                >
                  {row.value(plan)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
