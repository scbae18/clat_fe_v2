import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  alimtalkService,
  type AlimtalkBatchDetail,
  type AlimtalkBatchListItem,
  type AlimtalkBatchesMeta,
} from '@/services/alimtalk'
import { useToastStore } from '@/stores/toastStore'

import { type ChipFilter, groupMessages } from '../_lib/historyShared'

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
    const complete = rows.filter((r) => r.fail_count === 0).length
    const fail = rows.filter((r) => r.fail_count > 0).length
    const lesson = rows.filter((r) => r.type === 'LESSON').length
    const att = rows.filter((r) => r.type === 'ATTENDANCE').length
    return { complete, fail, lesson, att, total: meta?.total ?? rows.length }
  }, [rows, meta])

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (chip === 'complete' && r.fail_count > 0) return false
      if (chip === 'fail' && r.fail_count === 0) return false
      if (chip === 'LESSON' && r.type !== 'LESSON') return false
      if (chip === 'ATTENDANCE' && r.type !== 'ATTENDANCE') return false
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
    if (expandedId == null) {
      setDetailSelectedStudentId(null)
      return
    }
    const d = details[expandedId]
    if (!d) {
      setDetailSelectedStudentId(null)
      return
    }
    const grouped = groupMessages(d.messages)
    const ids = grouped.map(([sid]) => sid)
    setDetailSelectedStudentId((prev) => {
      if (prev != null && ids.includes(prev)) return prev
      return ids[0] ?? null
    })
  }, [expandedId, details])

  const onResendClick = () => {
    addToast({
      variant: 'warning',
      message: '재발송은 준비 중이에요.',
    })
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
    onResendClick,
  }
}
