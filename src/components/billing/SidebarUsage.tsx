'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { bannerText, isEnforcedBilling } from '@/lib/billingView'
import { billingService } from '@/services/billing'
import {
  usageAlertStyle,
  usageCardStyle,
  usageLineStyle,
  usagePlanStyle,
  usageRemainStyle,
} from '@/components/common/Sidebar/Sidebar.css'

export default function SidebarUsage({ collapsed }: { collapsed: boolean }) {
  const meQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    refetchOnWindowFocus: false,
    retry: false,
  })
  const me = meQuery.data
  if (!isEnforcedBilling(me)) return null

  const mode = collapsed ? 'collapsed' : 'expanded'
  const remaining = me.messages.remaining
  const messageLine =
    remaining == null ? '알림톡 제한 없음' : `알림톡 ${remaining.toLocaleString('ko-KR')}통 남음`
  const studentLine =
    me.students.limit == null
      ? `학생 ${me.students.count}명`
      : `학생 ${me.students.count} / ${me.students.limit}명`
  const alert = me.banners.map((banner) => bannerText(banner.type)).find(Boolean) ?? ''

  return (
    <Link
      href="/billing"
      className={usageCardStyle[mode]}
      title={collapsed ? `${me.plan.name} · ${messageLine}` : undefined}
      aria-label={`${me.plan.name} ${messageLine}`}
    >
      {collapsed ? (
        <span className={usageRemainStyle}>{remaining == null ? '∞' : remaining}</span>
      ) : (
        <>
          <span className={usagePlanStyle}>{me.plan.name}</span>
          <span className={usageLineStyle}>{messageLine}</span>
          <span className={usageLineStyle}>{studentLine}</span>
          {alert ? <span className={usageAlertStyle}>{alert}</span> : null}
        </>
      )}
    </Link>
  )
}
