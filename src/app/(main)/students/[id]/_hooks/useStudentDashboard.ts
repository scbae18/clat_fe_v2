import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { differenceInCalendarDays, parseISO } from 'date-fns'

import useDisclosure from '@/hooks/useDisclosure'
import { studentService, type UpdateStudentDto } from '@/services/student'
import {
  studentDashboardService,
  type AlimtalkHistoryRow,
  type LessonHistoryRow,
  type ScoreHistoryPoint,
  type ScorePeriod,
} from '@/services/studentDashboard'
import type { IncompleteItem, StudentDetail } from '@/types/student'
import { incompleteItemCompleteTarget } from '@/lib/incompleteItem'
import { useToastStore } from '@/stores/toastStore'
import { parseLessonScoreValue, cohortScoreMetric } from '@/lib/lessonScore'
import { formatCompletionRatePercent } from '@/lib/completionRate'
import { formatListLabel } from '@/lib/formatListLabel'

import {
  MSG,
  type MainTab,
  parseAiAnalysis,
  parseScoreEntry,
} from '../_lib/studentDashboardShared'

export function useStudentDashboard(studentId: number) {
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)

  const [detail, setDetail] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainTab, setMainTab] = useState<MainTab>('scores')
  const [period, setPeriod] = useState<ScorePeriod>('recent5')
  const [scoreRows, setScoreRows] = useState<ScoreHistoryPoint[]>([])
  const [lessons, setLessons] = useState<LessonHistoryRow[]>([])
  const [alimRows, setAlimRows] = useState<AlimtalkHistoryRow[]>([])
  const [aiText, setAiText] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [completePending, setCompletePending] = useState<IncompleteItem | null>(null)
  const [completeSubmitting, setCompleteSubmitting] = useState(false)
  const editStudent = useDisclosure()

  const loadDetail = useCallback(async () => {
    setLoading(true)
    try {
      const d = await studentService.getStudent(studentId)
      setDetail(d)
    } catch {
      addToast({ variant: 'error', message: MSG.loadStudentFail })
      router.push('/management?tab=students')
    } finally {
      setLoading(false)
    }
  }, [addToast, router, studentId])

  useEffect(() => {
    if (!Number.isFinite(studentId)) return
    void loadDetail()
  }, [loadDetail, studentId])

  useEffect(() => {
    if (!Number.isFinite(studentId) || mainTab !== 'scores') return
    studentDashboardService
      .getScoreHistory(studentId, period)
      .then(setScoreRows)
      .catch(() => addToast({ variant: 'error', message: MSG.loadScoresFail }))
  }, [addToast, mainTab, period, studentId])

  useEffect(() => {
    if (!Number.isFinite(studentId) || mainTab !== 'lessons') return
    studentDashboardService
      .getLessonHistory(studentId, 1, 30)
      .then((r) => setLessons(r.data))
      .catch(() => addToast({ variant: 'error', message: MSG.loadLessonsFail }))
  }, [addToast, mainTab, studentId])

  useEffect(() => {
    if (!Number.isFinite(studentId) || mainTab !== 'alimtalk') return
    studentDashboardService
      .getAlimtalkHistory(studentId, 1, 30)
      .then((r) => setAlimRows(r.data))
      .catch(() => addToast({ variant: 'error', message: MSG.loadAlimFail }))
  }, [addToast, mainTab, studentId])

  const loadAi = useCallback(
    async (refresh?: boolean) => {
      if (!Number.isFinite(studentId)) return
      setAiLoading(true)
      try {
        const r = await studentDashboardService.postAiAnalysis(studentId, refresh)
        setAiText(r.analysis)
      } catch {
        addToast({ variant: 'error', message: MSG.loadAiFail })
      } finally {
        setAiLoading(false)
      }
    },
    [addToast, studentId],
  )

  useEffect(() => {
    if (mainTab !== 'scores' || !detail) return
    void loadAi(false)
  }, [detail, loadAi, mainTab])

  const academyName = detail?.classes[0]?.academy_name?.trim() || '-'
  const classLabel = formatListLabel(detail?.classes.map((c) => c.name) ?? [])

  const monthlyCompletionPct = formatCompletionRatePercent(detail?.stats.monthly_completion_rate)
  const monthlyAttendancePct = formatCompletionRatePercent(detail?.stats.monthly_attendance_rate)

  const recentList = (detail?.stats.recent_scores ?? []) as unknown[]
  const rs0 = parseScoreEntry(recentList[0])
  const rs1 = parseScoreEntry(recentList[1])
  const recentScoreParsed = rs0 ? parseLessonScoreValue(rs0.value) : null
  const recentScoreMetric = cohortScoreMetric(rs0?.value ?? null)
  const prevScoreMetric = cohortScoreMetric(rs1?.value ?? null)
  const scoreDelta =
    recentScoreMetric != null && prevScoreMetric != null
      ? Math.round(recentScoreMetric - prevScoreMetric)
      : null
  const scoreDeltaIsPercent =
    recentScoreParsed?.max != null || (rs1 ? parseLessonScoreValue(rs1.value)?.max != null : false)

  const completionDelta =
    detail != null
      ? Math.round(
          ((detail.stats.monthly_completion_rate ?? 0) - (detail.stats.completion_rate ?? 0)) *
            100,
        )
      : null

  const attendanceDelta =
    detail != null
      ? Math.round(
          ((detail.stats.monthly_attendance_rate ?? 0) - (detail.stats.completion_rate ?? 0)) *
            100,
        )
      : null

  const runCompletePending = async () => {
    if (!completePending) return
    setCompleteSubmitting(true)
    try {
      const { id, source } = incompleteItemCompleteTarget(completePending)
      await studentService.completeItem(id, source)
      addToast({ variant: 'success', message: MSG.completeOk })
      setCompletePending(null)
      await loadDetail()
    } catch {
      addToast({ variant: 'error', message: MSG.completeFail })
    } finally {
      setCompleteSubmitting(false)
    }
  }

  const updateStudent = async (data: UpdateStudentDto) => {
    if (!detail) return
    try {
      await studentService.updateStudent(detail.id, data)
      await loadDetail()
      editStudent.close()
      addToast({ variant: 'success', message: MSG.editStudentOk })
    } catch {
      addToast({ variant: 'error', message: MSG.editStudentFail })
    }
  }

  const aiSections = useMemo(() => parseAiAnalysis(aiText), [aiText])

  const overdueLabel = (lessonDate: string) => {
    try {
      const d = differenceInCalendarDays(new Date(), parseISO(lessonDate))
      if (d <= 0) return MSG.today
      return MSG.daysOverdue(d)
    } catch {
      return '-'
    }
  }

  return {
    detail,
    loading,
    mainTab,
    setMainTab,
    period,
    setPeriod,
    scoreRows,
    lessons,
    alimRows,
    aiText,
    aiLoading,
    aiSections,
    loadAi,
    completePending,
    setCompletePending,
    completeSubmitting,
    runCompletePending,
    editStudent,
    updateStudent,
    academyName,
    classLabel,
    monthlyCompletionPct,
    monthlyAttendancePct,
    recentScoreParsed,
    scoreDelta,
    scoreDeltaIsPercent,
    completionDelta,
    attendanceDelta,
    overdueLabel,
  }
}
