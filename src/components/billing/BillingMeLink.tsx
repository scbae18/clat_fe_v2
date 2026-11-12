'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import { isEnforcedBilling } from '@/lib/billingView'
import { billingService } from '@/services/billing'
import * as styles from '@/app/(main)/me/me.css'

export default function BillingMeLink() {
  const meQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    refetchOnWindowFocus: false,
    retry: false,
  })
  const me = meQuery.data
  if (!isEnforcedBilling(me)) return null
  const studentLine =
    me.students.limit == null
      ? `학생 ${me.students.count}명`
      : `학생 ${me.students.count} / ${me.students.limit}명`
  const messageLine =
    me.messages.remaining == null
      ? '알림톡 제한 없음'
      : `알림톡 ${me.messages.remaining.toLocaleString('ko-KR')}통 남음`
  return (
    <section className={`${styles.card} ${styles.billingSlot}`}>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={styles.sectionTitle}>요금제</h2>
          <p className={styles.sectionDesc}>
            {me.plan.name} · {studentLine} · {messageLine}
          </p>
        </div>
        <Link href="/billing">
          <Button variant="ghost" size="sm">
            보기
          </Button>
        </Link>
      </div>
    </section>
  )
}
