import { useCallback, useEffect, useMemo, useState } from 'react'

import { apiErrorMessage } from '@/lib/api/http'
import {
  alimtalkService,
  type AlimtalkBatchDetail,
  type AlimtalkBatchListItem,
  type AlimtalkBatchesMeta,
} from '@/services/alimtalk'
import { useToastStore } from '@/stores/toastStore'

import { isBatchComplete, type ChipFilter } from '../_lib/historyShared'

const LIMIT = 30

export function useAlimtalkBatches() {
  const addToast = useToastStore((s) => s.addToast)

  const [rows, setRows] = useState<AlimtalkBatchListItem[]>([])
  const [meta, setMeta] = useState<AlimtalkBatchesMeta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [chip, setChip] = useState<ChipFilter>('all')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [details, setDetails] = useState<Record<number, AlimtalkBatchDetail>>({})
  const [detailLoading, setDetailLoading] = useState<number | null>(null)
  const [detailSelectedStudentId, setDetailSelectedStudentId] = useState<number | null>(null)
  const [resending, setResending] = useState(false)

  const loadPage = useCallback(
    async (p: number, append: boolean) => {
      if (append) setLoadingMore(true)
      else setLoading(true)
      try {
        const res = await alimtalkService.getBatches({ page: p, limit: LIMIT })
        setMeta(res.meta)
        setRows((prev) => (append ? [...prev, ...res.data] : res.data))
        setPage(p)
      } catch {
        addToast({
          variant: 'error',
          message: '발송 내역을 불러오지 못했어요.',
        })
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [addToast],
  )

  useEffect(() => {
    void loadPage(1, false)
  }, [loadPage])

  const hasMore = meta != null && page * LIMIT < meta.total

  const stats = useMemo(() => {
    const complete = rows.filter((row) => isBatchComplete(row)).length
    const fail = rows.filter((r) => r.fail_count > 0).length
    const lesson = rows.filter((r) => r.type === 'LESSON').length
    const att = rows.filter((r) => r.type === 'ATTENDANCE').length
    const broadcast = rows.filter((r) => r.type === 'BROADCAST').length
    return { complete, fail, lesson, att, broadcast, total: meta?.total ?? rows.length }
  }, [rows, meta])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (chip === 'complete' && !isBatchComplete(r)) return false
      if (chip === 'fail' && r.fail_count === 0) return false
      if (chip === 'LESSON' && r.type !== 'LESSON') return false
      if (chip === 'ATTENDANCE' && r.type !== 'ATTENDANCE') return false
      if (chip === 'BROADCAST' && r.type !== 'BROADCAST') return false
      return true
    })
  }, [rows, chip])

  const toggleRow = async (batchId: number) => {
    if (expandedId === batchId) {
      setExpandedId(null)
      return
    }
    setExpandedId(batchId)
    if (details[batchId]) return
    setDetailLoading(batchId)
    try {
      const d = await alimtalkService.getBatchDetail(batchId)
      setDetails((prev) => ({ ...prev, [batchId]: d }))
    } catch {
      addToast({
        variant: 'error',
        message: '상세 내역을 불러오지 못했어요.',
      })
      setExpandedId(null)
    } finally {
      setDetailLoading(null)
    }
  }

  useEffect(() => {
    setDetailSelectedStudentId(null)
  }, [expandedId])

  const resend = async (studentId?: number) => {
    if (expandedId == null || resending) return
    setResending(true)
    try {
      await alimtalkService.resendBatch(expandedId, studentId)
      addToast({ variant: 'success', message: '다시 보냈어요.' })
      setExpandedId(null)
      setDetails({})
      await loadPage(1, false)
    } catch (err) {
      addToast({
        variant: 'error',
        message: apiErrorMessage(err, '다시 보내지 못했어요.'),
      })
    } finally {
      setResending(false)
    }
  }

  return {
    rows,
    meta,
    page,
    loading,
    loadingMore,
    chip,
    setChip,
    expandedId,
    details,
    detailLoading,
    detailSelectedStudentId,
    setDetailSelectedStudentId,
    hasMore,
    stats,
    filtered,
    loadPage,
    toggleRow,
    resending,
    resendAll: () => void resend(),
    resendStudent: (studentId: number) => void resend(studentId),
  }
}
