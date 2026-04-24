'use client'

import { use, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import CheckIcon from '@/assets/icons/icon-check.svg'
import EditIcon from '@/assets/icons/icon-edit.svg'
import InfoIcon from '@/assets/icons/icon-info.svg'
import useDisclosure from '@/hooks/useDisclosure'
import { studentService } from '@/services/student'
import {
  studentDashboardService,
  type ScoreHistoryPoint,
  type ScorePeriod,
} from '@/services/studentDashboard'
import type { IncompleteItem, StudentDetail } from '@/types/student'
import { useToastStore } from '@/stores/toastStore'
import { colors } from '@/styles/tokens/colors'
import { parseLessonScoreValue, cohortScoreMetric } from '@/lib/lessonScore'
import ChoiceConfirmModal from '@/components/common/ChoiceConfirmModal/ChoiceConfirmModal'
import AddStudentFormModal from '@/app/(main)/management/_components/AddStudentFormModal/AddStudentFormModal'
import ScoreLineChart from './ScoreLineChart'
import * as styles from './studentDashboard.css'

type MainTab = 'scores' | 'lessons' | 'alimtalk'

const MSG = {
  loadStudentFail:
    '\ud559\uc0dd \uc815\ubcf4\ub97c \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694.',
  loadScoresFail:
    '\uc810\uc218 \uc774\ub825\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694.',
  loadLessonsFail:
    '\uc218\uc5c5 \uc774\ub825\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694.',
  loadAlimFail:
    '\uc54c\ub9bc\ud1a1 \uc774\ub825\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694.',
  loadAiFail: 'AI \ubd84\uc11d\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694.',
  confirmComplete:
    '\uc774 \ud56d\ubaa9\uc744 \uc644\ub8cc \ucc98\ub9ac\ud560\uae4c\uc694?',
  confirmCompleteDesc: [
    '\uc644\ub8cc \ucc98\ub9ac\ud558\uba74 \ud574\ub2f9 \ud56d\ubaa9\uc740 \ubbf8\uc644\ub8cc \ubaa9\ub85d\uc5d0\uc11c \uc0ac\ub77c\uc9d1\ub2c8\ub2e4.',
    '\uacc4\uc18d\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?',
  ],
  completeActionLabel: '\uc644\ub8cc \ucc98\ub9ac',
  completeOk: '\uc644\ub8cc \ucc98\ub9ac\ub418\uc5c8\uc5b4\uc694.',
  completeFail: '\uc644\ub8cc \ucc98\ub9ac\uc5d0 \uc2e4\ud328\ud588\uc5b4\uc694.',
  editStudent: '\ud559\uc0dd \uc815\ubcf4 \uc218\uc815',
  editStudentOk: '\ud559\uc0dd \uc815\ubcf4\uac00 \uc218\uc815\ub410\uc5b4\uc694.',
  editStudentFail: '\ud559\uc0dd \uc815\ubcf4 \uc218\uc815\uc5d0 \uc2e4\ud328\ud588\uc5b4\uc694.',
  loading: '\ubd88\ub7ec\uc624\ub294 \uc911\u2026',
  back: '\ub4a4\ub85c',
  pageTitle: '\ud559\uc0dd \ub300\uc2dc\ubcf4\ub4dc',
  academy: '\ud559\uc6d0\uba85',
  className: '\uc18c\uc18d \ubc18',
  school: '\ud559\uad50\uba85',
  grade: '\ud559\ub144',
  phone: '\ud559\uc0dd \uc804\ud654\ubc88\ud638',
  parentPhone: '\ud559\ubd80\ubaa8 \uc804\ud654\ubc88\ud638',
  monthComplete: '\uc774\ubc88 \ub2ec \uc644\ub8cc\uc728',
  vsLastMonth: '\uc9c0\ub09c \ub2ec \ub300\ube44',
  recentScore: '\ucd5c\uadfc \uc810\uc218',
  recentScoreTitle:
    '\uac00\uc7a5 \ucd5c\uadfc \uc785\ub825\ub41c \uc810\uc218 \ud56d\ubaa9 \uae30\uc900',
  vsClassAvg: '\ubc18 \ud3c9\uade0 \ub300\ube44',
  monthAttend: '\uc774\ubc88 \ub2ec \ucd9c\uc11d\uc728',
  incompleteTitle: '\ubbf8\uc644\ub8cc \ud56d\ubaa9',
  homeworkMain: '\uacfc\uc81c',
  noIncomplete: '\ubbf8\uc644\ub8cc \ud56d\ubaa9\uc774 \uc5c6\uc5b4\uc694.',
  tabScores: '\uc810\uc218 \ucd94\uc774',
  tabLessons: '\uc218\uc5c5 \uc774\ub825',
  tabAlim: '\uc54c\ub9bc\ud1a1',
  aiTitle: 'AI \ubd84\uc11d',
  analyzing: '\ubd84\uc11d \uc911\u2026',
  aiEmpty: '\ubd84\uc11d\uc744 \ubd88\ub7ec\uc624\uc9c0 \ubabb\ud588\uc5b4\uc694.',
  refreshAi: '\ub2e4\uc2dc \ubd84\uc11d',
  noLessons: '\uc218\uc5c5 \uc774\ub825\uc774 \uc5c6\uc5b4\uc694.',
  thDate: '\ub0a0\uc9dc',
  thClass: '\ubc18',
  thTemplate: '\ud15c\ud50c\ub9bf',
  noAlim: '\uc54c\ub9bc\ud1a1 \uc774\ub825\uc774 \uc5c6\uc5b4\uc694.',
  thSent: '\ubc1c\uc1a1',
  thType: '\uc720\ud615',
  thChannel: '\ucc44\ub110',
  thPreview: '\ubbf8\ub9ac\ubcf4\uae30',
  today: '\uc624\ub298',
  daysOverdue: (n: number) => `${n}\uc77c \uc9c0\ub0a8`,
  arrowUp: '\u2197',
  arrowDown: '\u2198',
} as const

function parseScoreEntry(raw: unknown): { value: string } | null {
  if (!raw || typeof raw !== 'object') return null
  const v = (raw as { value?: unknown }).value
  if (typeof v !== 'string') return null
  return { value: v }
}

function formatScoreNum(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1)
}

type AiSection = { title: string; items: string[]; kind: 'list' | 'para' }

function parseAiAnalysis(raw: string | null | undefined): AiSection[] {
  if (!raw) return []
  const cleaned = raw.replace(/\*\*/g, '').replace(/(^|[^*])\*(?!\*)/g, '$1')
  const re = /【\s*([^】]+?)\s*】/g
  type Hit = { title: string; start: number; end: number }
  const hits: Hit[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(cleaned)) !== null) {
    hits.push({ title: m[1].trim(), start: m.index, end: m.index + m[0].length })
  }
  if (hits.length === 0) return []
  const sections: AiSection[] = []
  for (let i = 0; i < hits.length; i++) {
    const h = hits[i]
    const bodyEnd = i + 1 < hits.length ? hits[i + 1].start : cleaned.length
    const body = cleaned.slice(h.end, bodyEnd).trim()
    if (!body) {
      sections.push({ title: h.title, items: [], kind: 'para' })
      continue
    }
    const lines = body
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
    const bulletLines = lines.filter((l) => /^[-•·]/.test(l))
    if (bulletLines.length > 0 && bulletLines.length >= Math.ceil(lines.length / 2)) {
      const items = lines
        .map((l) => l.replace(/^[-•·]\s?/, '').trim())
        .filter(Boolean)
      sections.push({ title: h.title, items, kind: 'list' })
    } else {
      sections.push({
        title: h.title,
        items: [lines.length ? lines.join(' ') : body],
        kind: 'para',
      })
    }
  }
  return sections
}

function IconBuilding() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 17V8l6-3.5L16 8v9"
        stroke={colors.gray500}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 17v-5h4v5" stroke={colors.gray500} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

function IconBook() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 4.5A2.5 2.5 0 016.5 2H14v16H6.5A2.5 2.5 0 004 15.5v-11z"
        stroke={colors.gray500}
        strokeWidth="1.4"
      />
      <path d="M14 4h1.5A1.5 1.5 0 0117 5.5V17" stroke={colors.gray500} strokeWidth="1.4" />
    </svg>
  )
}

function IconSchool() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 8l7-4 7 4-7 4-7-4z"
        stroke={colors.gray500}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M5 9.5V14l5 2.5L15 14V9.5" stroke={colors.gray500} strokeWidth="1.4" />
    </svg>
  )
}

function IconGraduation() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M3 8l7-3 7 3-7 3-7-3z"
        stroke={colors.gray500}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6 9.2V13l4 2 4-2V9.2" stroke={colors.gray500} strokeWidth="1.4" />
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M14.05 12.2c-1.4 1.4-2.95 2.45-4.6 3.1-.45.18-.95.1-1.3-.25l-1.5-1.5a1 1 0 00-1.15-.22 6.2 6.2 0 01-2.75-2.75 1 1 0 00-.22-1.15l1.5-1.5a1 1 0 00.25-1.3c.65-1.65 1.7-3.2 3.1-4.6a1 1 0 011.3-.1l1.2.6a1 1 0 01.5.85c0 1.1.2 2.15.6 3.1.15.4.05.85-.25 1.15l-.35.35a8.3 8.3 0 003.45 3.45l.35-.35a1 1 0 011.15-.25c.95.4 2 .6 3.1.6a1 1 0 01.85.5l.6 1.2a1 1 0 01-.1 1.3z"
        stroke={colors.gray500}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2l1.2 4.2L15 7l-3.8 1.8L10 13l-1.2-4.2L5 7l3.8-1.8L10 2z"
        fill={colors.primary400}
        opacity={0.95}
      />
    </svg>
  )
}

const PERIODS: { key: ScorePeriod; label: string }[] = [
  { key: 'recent5', label: '\ucd5c\uadfc 5\ud68c' },
  { key: 'recent10', label: '\ucd5c\uadfc 10\ud68c' },
  { key: '1month', label: '1\uac1c\uc6d4' },
  { key: '3month', label: '3\uac1c\uc6d4' },
  { key: 'all', label: '\uc804\uccb4' },
]

export default function StudentDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = use(params)
  const studentId = Number(idStr)
  const router = useRouter()
  const addToast = useToastStore((s) => s.addToast)

  const [detail, setDetail] = useState<StudentDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainTab, setMainTab] = useState<MainTab>('scores')
  const [period, setPeriod] = useState<ScorePeriod>('recent5')
  const [scoreRows, setScoreRows] = useState<ScoreHistoryPoint[]>([])
  const [lessons, setLessons] = useState<
    Awaited<ReturnType<typeof studentDashboardService.getLessonHistory>>['data']
  >([])
  const [alimRows, setAlimRows] = useState<
    Awaited<ReturnType<typeof studentDashboardService.getAlimtalkHistory>>['data']
  >([])
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
    loadDetail()
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
    [addToast, studentId]
  )

  useEffect(() => {
    if (mainTab !== 'scores' || !detail) return
    loadAi(false)
  }, [detail, loadAi, mainTab])

  const academyName = detail?.classes[0]?.academy_name?.trim() || '-'
  const classNames = detail?.classes.map((c) => c.name).join(', ') || '-'

  const monthlyCompletionPct = Math.round((detail?.stats.monthly_completion_rate ?? 0) * 100)
  const monthlyAttendancePct = Math.round((detail?.stats.monthly_attendance_rate ?? 0) * 100)

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
          ((detail.stats.monthly_completion_rate ?? 0) - (detail.stats.completion_rate ?? 0)) * 100
        )
      : null

  const attendanceDelta =
    detail != null
      ? Math.round(
          ((detail.stats.monthly_attendance_rate ?? 0) - (detail.stats.completion_rate ?? 0)) * 100
        )
      : null

  const runCompletePending = async () => {
    if (!completePending) return
    setCompleteSubmitting(true)
    try {
      await studentService.completeItem(completePending.lesson_student_data_id)
      addToast({ variant: 'success', message: MSG.completeOk })
      setCompletePending(null)
      await loadDetail()
    } catch {
      addToast({ variant: 'error', message: MSG.completeFail })
    } finally {
      setCompleteSubmitting(false)
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

  if (loading || !detail) {
    return (
      <div className={styles.pageRoot}>
        <p className={styles.emptyState}>{MSG.loading}</p>
      </div>
    )
  }

  return (
    <div className={styles.pageRoot}>
      <header className={styles.headerRow}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => router.back()}
          aria-label={MSG.back}
        >
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <h1 className={styles.pageTitle}>{MSG.pageTitle}</h1>
      </header>

      <div className={styles.columns}>
        <div className={styles.leftCol}>
          <section className={styles.profileCard}>
            <div className={styles.profileTop}>
              <div className={styles.avatar} />
              <div className={styles.profileName}>{detail.name}</div>
              <button
                type="button"
                className={styles.profileEditButton}
                onClick={editStudent.open}
                aria-label={MSG.editStudent}
                title={MSG.editStudent}
              >
                <EditIcon width={16} height={16} />
                <span>{MSG.editStudent}</span>
              </button>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoLabelCell}>
                <IconBuilding />
                {MSG.academy}
              </div>
              <div className={styles.infoValueCell}>{academyName}</div>

              <div className={styles.infoLabelCell}>
                <IconBook />
                {MSG.className}
              </div>
              <div className={styles.infoValueCell}>{classNames}</div>

              <div className={styles.infoLabelCell}>
                <IconSchool />
                {MSG.school}
              </div>
              <div className={styles.infoValueCell}>{detail.school_name?.trim() || '-'}</div>

              <div className={styles.infoLabelCell}>
                <IconGraduation />
                {MSG.grade}
              </div>
              <div className={styles.infoValueCell}>-</div>

              <div className={styles.infoLabelCell}>
                <IconPhone />
                {MSG.phone}
              </div>
              <div className={styles.infoValueCell}>{detail.phone?.trim() || '-'}</div>

              <div className={styles.infoLabelCell}>
                <IconPhone />
                {MSG.parentPhone}
              </div>
              <div className={styles.infoValueCell}>{detail.parent_phone?.trim() || '-'}</div>
            </div>
          </section>

          <div className={styles.statsRow}>
            <div className={styles.statMini}>
              <span className={styles.statMiniLabel}>{MSG.monthComplete}</span>
              <span className={styles.statMiniValue}>{monthlyCompletionPct}%</span>
              <div className={styles.statTrendRow}>
                <span className={styles.statTrendMuted}>{MSG.vsLastMonth}</span>
                {completionDelta != null && completionDelta !== 0 ? (
                  <span
                    className={completionDelta > 0 ? styles.statTrendMuted : styles.statTrendDown}
                  >
                    {completionDelta > 0 ? MSG.arrowUp : MSG.arrowDown}{' '}
                    {Math.abs(completionDelta)}%
                  </span>
                ) : (
                  <span className={styles.statTrendMuted}>—</span>
                )}
              </div>
            </div>
            <div className={styles.statMini}>
              <span className={styles.statMiniLabel}>
                {MSG.recentScore}
                <button type="button" className={styles.infoIconBtn} title={MSG.recentScoreTitle}>
                  <InfoIcon width={16} height={16} />
                </button>
              </span>
              <span className={styles.statMiniValue}>
                {recentScoreParsed && recentScoreParsed.earned != null ? (
                  recentScoreParsed.max != null ? (
                    <>
                      {formatScoreNum(recentScoreParsed.earned)}
                      <span className={styles.statMiniValueMax}>
                        {' / '}
                        {formatScoreNum(recentScoreParsed.max)}
                        {'\uc810'}
                      </span>
                    </>
                  ) : (
                    `${formatScoreNum(recentScoreParsed.earned)}\uc810`
                  )
                ) : (
                  '—'
                )}
              </span>
              <div className={styles.statTrendRow}>
                <span className={styles.statTrendMuted}>{MSG.vsClassAvg}</span>
                {scoreDelta != null && scoreDelta !== 0 ? (
                  <span className={scoreDelta > 0 ? styles.statTrendMuted : styles.statTrendDown}>
                    {scoreDelta > 0 ? MSG.arrowUp : MSG.arrowDown} {Math.abs(scoreDelta)}
                    {scoreDeltaIsPercent ? '%' : '\uc810'}
                  </span>
                ) : (
                  <span className={styles.statTrendMuted}>—</span>
                )}
              </div>
            </div>
            <div className={styles.statMini}>
              <span className={styles.statMiniLabel}>{MSG.monthAttend}</span>
              <span className={styles.statMiniValue}>{monthlyAttendancePct}%</span>
              <div className={styles.statTrendRow}>
                <span className={styles.statTrendMuted}>{MSG.vsLastMonth}</span>
                {attendanceDelta != null && attendanceDelta !== 0 ? (
                  <span
                    className={attendanceDelta > 0 ? styles.statTrendMuted : styles.statTrendDown}
                  >
                    {attendanceDelta > 0 ? MSG.arrowUp : MSG.arrowDown}{' '}
                    {Math.abs(attendanceDelta)}%
                  </span>
                ) : (
                  <span className={styles.statTrendMuted}>—</span>
                )}
              </div>
            </div>
          </div>

          <section className={styles.incompleteCard}>
            <h2 className={styles.incompleteTitle}>
              {MSG.incompleteTitle}{' '}
              <span className={styles.incompleteCount}>{detail.incomplete_items.length}</span>
            </h2>
            <div className={styles.incompleteList}>
              {detail.incomplete_items.length === 0 ? (
                <p className={styles.emptyState}>{MSG.noIncomplete}</p>
              ) : (
                detail.incomplete_items.map((item) => (
                  <button
                    key={item.lesson_student_data_id}
                    type="button"
                    className={styles.incompleteRow}
                    onClick={() => setCompletePending(item)}
                  >
                    <div className={styles.incompleteLeft}>
                      <CheckIcon width={24} height={24} style={{ flexShrink: 0 }} />
                      <span className={styles.incompleteHomeworkMain}>{MSG.homeworkMain}</span>
                    </div>
                    <div className={styles.incompleteTagsRow}>
                      <span className={styles.incompleteClassAccent}>{item.class_name}</span>
                      <span className={styles.incompleteTemplateAccent}>{item.template_name}</span>
                      <span className={styles.badgeOverdue}>{overdueLabel(item.lesson_date)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.panelCard}>
            <div className={styles.tabRow}>
              <button
                type="button"
                className={`${styles.tabBtn}${mainTab === 'scores' ? ` ${styles.tabBtnActive}` : ''}`}
                onClick={() => setMainTab('scores')}
              >
                {MSG.tabScores}
              </button>
              <button
                type="button"
                className={`${styles.tabBtn}${mainTab === 'lessons' ? ` ${styles.tabBtnActive}` : ''}`}
                onClick={() => setMainTab('lessons')}
              >
                {MSG.tabLessons}
              </button>
              <button
                type="button"
                className={`${styles.tabBtn}${mainTab === 'alimtalk' ? ` ${styles.tabBtnActive}` : ''}`}
                onClick={() => setMainTab('alimtalk')}
              >
                {MSG.tabAlim}
              </button>
            </div>

            <div className={styles.panelBody}>
              {mainTab === 'scores' && (
                <>
                  <div className={styles.periodRow}>
                    {PERIODS.map((p) => (
                      <button
                        key={p.key}
                        type="button"
                        className={`${styles.periodChip}${period === p.key ? ` ${styles.periodChipActive}` : ''}`}
                        onClick={() => setPeriod(p.key)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <ScoreLineChart rows={scoreRows} motionKey={`${period}-${scoreRows.length}`} />
                  <div className={styles.aiBox}>
                    <div className={styles.aiTitleRow}>
                      <SparkleIcon />
                      <span className={styles.aiTitle}>{MSG.aiTitle}</span>
                    </div>
                    {aiLoading ? (
                      <p className={styles.aiBody}>{MSG.analyzing}</p>
                    ) : aiSections.length > 0 ? (
                      <div className={styles.aiSections}>
                        {aiSections.map((s, idx) => (
                          <div
                            key={`${s.title}-${idx}`}
                            className={styles.aiSection}
                          >
                            <span className={styles.aiSectionTitle}>{s.title}</span>
                            {s.kind === 'list' ? (
                              <ul className={styles.aiList}>
                                {s.items.map((item, i) => (
                                  <li
                                    key={`${idx}-${i}`}
                                    className={styles.aiListItem}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className={styles.aiSectionBody}>
                                {s.items.join(' ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={styles.aiBody}>{aiText ?? MSG.aiEmpty}</p>
                    )}
                    <div className={styles.aiToolbar}>
                      <button
                        type="button"
                        className={styles.aiRefreshBtn}
                        disabled={aiLoading}
                        onClick={() => loadAi(true)}
                      >
                        {MSG.refreshAi}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {mainTab === 'lessons' && (
                <>
                  {lessons.length === 0 ? (
                    <div className={styles.emptyState}>{MSG.noLessons}</div>
                  ) : (
                    <table className={styles.listTable}>
                      <thead>
                        <tr>
                          <th className={styles.th}>{MSG.thDate}</th>
                          <th className={styles.th}>{MSG.thClass}</th>
                          <th className={styles.th}>{MSG.thTemplate}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lessons.map((row) => (
                          <tr key={row.lesson_record_id}>
                            <td className={styles.td}>{row.lesson_date}</td>
                            <td className={styles.td}>{row.class_name}</td>
                            <td className={styles.td}>{row.template_name}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}

              {mainTab === 'alimtalk' && (
                <>
                  {alimRows.length === 0 ? (
                    <div className={styles.emptyState}>{MSG.noAlim}</div>
                  ) : (
                    <table className={styles.listTable}>
                      <thead>
                        <tr>
                          <th className={styles.th}>{MSG.thSent}</th>
                          <th className={styles.th}>{MSG.thType}</th>
                          <th className={styles.th}>{MSG.thChannel}</th>
                          <th className={styles.th}>{MSG.thPreview}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alimRows.map((row) => (
                          <tr key={row.message_id}>
                            <td className={styles.td}>
                              {new Date(row.sent_at).toLocaleString('ko-KR', {
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </td>
                            <td className={styles.td}>{row.batch_type}</td>
                            <td className={styles.td}>
                              {row.phone_type}
                              {row.delivery_mode === 'mock' ? ' · mock' : ''}
                            </td>
                            <td className={styles.td}>{row.preview}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <ChoiceConfirmModal
        isOpen={completePending != null}
        onClose={() => !completeSubmitting && setCompletePending(null)}
        onConfirm={runCompletePending}
        title={MSG.confirmComplete}
        descriptions={[...MSG.confirmCompleteDesc]}
        confirmLabel={MSG.completeActionLabel}
        confirmTone="primary"
        confirmDisabled={completeSubmitting}
      />

      {detail && (
        <AddStudentFormModal
          isOpen={editStudent.isOpen}
          onClose={editStudent.close}
          mode="edit"
          defaultValues={{
            name: detail.name,
            phone: detail.phone,
            parent_phone: detail.parent_phone,
            school_name: detail.school_name,
            class_ids: detail.classes.map((c) => c.id),
          }}
          onConfirm={async (data) => {
            try {
              await studentService.updateStudent(detail.id, data)
              await loadDetail()
              editStudent.close()
              addToast({ variant: 'success', message: MSG.editStudentOk })
            } catch {
              addToast({ variant: 'error', message: MSG.editStudentFail })
            }
          }}
        />
      )}
    </div>
  )
}
