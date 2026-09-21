'use client'

import { use, useEffect, useState } from 'react'
import { parentDashboardService, type ParentDashboardData } from '@/services/parentDashboard'
import ParentDashboardView from '../_components/ParentDashboardView'
import * as styles from './parentDashboard.css'

export default function ParentDashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const [data, setData] = useState<ParentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErrorMsg(null)
    parentDashboardService
      .getByToken(token)
      .then((res) => {
        if (!cancelled) setData(res)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        const msg =
          (e as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response
            ?.data?.error?.message ||
          (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          '학부모 대시보드 정보를 불러오지 못했어요.'
        setErrorMsg(msg)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <div className={styles.page}>
      {loading ? <div className={styles.stateBox}>불러오는 중...</div> : null}
      {!loading && errorMsg ? <div className={styles.stateBox}>{errorMsg}</div> : null}
      {!loading && !errorMsg && data ? <ParentDashboardView data={data} /> : null}
    </div>
  )
}
