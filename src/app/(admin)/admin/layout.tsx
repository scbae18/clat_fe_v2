'use client'

import { notFound } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from '@/lib/api/http'
import { admin } from '@/services/admin'
import { ToastContainer } from '@/components/common/Toast'
import AdminNav from './_components/AdminNav'
import * as styles from './admin.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'session'],
    queryFn: () => admin.getSession(),
    retry: false,
    staleTime: 60_000,
  })

  if (isLoading) {
    return <p className={styles.loading}>확인 중…</p>
  }

  if (isError) {
    if (isAxiosError(error) && error.response?.status === 404) {
      notFound()
    }
    return <p className={styles.loading}>관리자 세션을 확인하지 못했습니다.</p>
  }

  if (!data) {
    notFound()
  }

  return (
    <div className={styles.shell}>
      <AdminNav />
      <main className={styles.main}>
        <div className={styles.mainInner}>{children}</div>
      </main>
      <ToastContainer />
    </div>
  )
}
