'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal/ConfirmModal'
import Text from '@/components/common/Text'
import { apiErrorMessage } from '@/lib/api/http'
import { isEnforcedBilling, quotaNotice } from '@/lib/billingView'
import { billingService } from '@/services/billing'
import useToast from '@/hooks/useToast'
import * as styles from '@/app/(main)/billing/billing.css'

export default function QuotaNotice({ needed }: { needed: number }) {
  const queryClient = useQueryClient()
  const { success, error } = useToast()
  const [open, setOpen] = useState(false)
  const meQuery = useQuery({
    queryKey: ['billing', 'me'],
    queryFn: () => billingService.me(),
    refetchOnWindowFocus: false,
    retry: false,
  })
  const me = meQuery.data
  if (!isEnforcedBilling(me) || needed <= 0) return null
  const notice = quotaNotice(me, needed)

  const enable = async () => {
    try {
      await billingService.setOverage(true, true)
      await queryClient.invalidateQueries({ queryKey: ['billing', 'me'] })
      success('초과 사용을 켰어요. 다시 보낼 수 있어요.')
    } catch (err) {
      error(apiErrorMessage(err, '초과 사용을 켜지 못했어요.'))
    } finally {
      setOpen(false)
    }
  }

  return (
    <div className={notice.warn ? styles.warn : undefined}>
      <Text variant="bodyMd" color={notice.warn ? 'gray900' : 'gray500'}>
        {notice.text}
      </Text>
      {notice.action === 'plans' || notice.action === 'upgrade' || notice.action === 'overage' ? (
        <div className={styles.noticeActions}>
          {notice.action === 'plans' || notice.action === 'upgrade' ? (
            <Link href="/billing/plans">
              <Button variant="secondary" size="sm">
                {notice.action === 'upgrade' ? '요금제 올리기' : '요금제 보기'}
              </Button>
            </Link>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
              초과 사용 켜기
            </Button>
          )}
        </div>
      ) : null}
      {notice.blocked && me.status === 'GRANT' && notice.action === 'none' ? (
        <Text variant="bodyMd" color="gray500">
          더 필요하면 010-7324-7708 로 문의해 주세요.
        </Text>
      ) : null}
      <ConfirmModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => void enable()}
        title="초과 사용을 켤까요?"
        descriptions={
          me.status === 'GRANT'
            ? ['무료 기간에는 요금이 없고 한 달 500통까지예요.']
            : ['통당 20원, 한 달 최대 1만 원. 다음 결제일에 함께 결제돼요.']
        }
        confirmLabel="켜기"
      />
    </div>
  )
}
