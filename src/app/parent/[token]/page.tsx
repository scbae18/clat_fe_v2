'use client'

import { Suspense, use, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import ArrowLeftIcon from '@/assets/icons/icon-arrow-left.svg'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import ParentDateCalendar from '../_components/ParentDateCalendar'
import { BROADCAST_NOTICE_LABEL } from '@/app/(main)/alimtalk/broadcast/_lib/broadcastNotice'
import {
  parentDashboardService,
  type ParentDashboardData,
  type ParentLessonListItem,
  type ParentNoticeItem,
  type ParentNoticeType,
} from '@/services/parentDashboard'
import ParentDashboardView from '../_components/ParentDashboardView'
import { useTutorial } from '@/features/tutorial/TutorialProvider'
import * as styles from './parentDashboard.css'

function shiftDay(dateStr: string, days: number) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return dateStr
  date.setDate(date.getDate() - days)
  return format(date, 'yyyy-MM-dd')
}

function tutorialPastLessons(className: string, lessonDate: string): ParentLessonListItem[] {
  return [
    {
      lesson_id: -2,
      lesson_date: shiftDay(lessonDate, 14),
      class_name: className,
      template_name: '튜토리얼 틀',
    },
    {
      lesson_id: -1,
      lesson_date: shiftDay(lessonDate, 7),
      class_name: className,
      template_name: '튜토리얼 틀',
    },
  ]
}

function tutorialNotices(lessonDate: string, className: string): ParentNoticeItem[] {
  return [
    {
      batch_id: -1,
      sent_at: shiftDay(lessonDate, 3),
      body: '준비물 안내예요. 교재를 챙겨 주세요.',
      notice_type: 'PREP',
      class_names: [className],
    },
    {
      batch_id: -2,
      sent_at: shiftDay(lessonDate, 10),
      body: '다음 주 휴강 안내예요. 수업은 그다음 주에 만나요.',
      notice_type: 'SCHEDULE',
      class_names: [className],
    },
  ]
}

type Tab = 'lesson' | 'timeline' | 'notices'

function formatDay(value: string) {
  const parsed = parseISO(value.slice(0, 10))
  if (Number.isNaN(parsed.getTime())) return value
  return format(parsed, 'M월 d일 (E)', { locale: ko })
}

function lessonMatches(lesson: ParentLessonListItem, query: string) {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  const hay = `${formatDay(lesson.lesson_date)} ${lesson.class_name} ${lesson.template_name}`.toLowerCase()
  return tokens.every((token) => hay.includes(token))
}

function noticeLabel(type: ParentNoticeType | null | undefined) {
  if (!type) return '전체 공지'
  return BROADCAST_NOTICE_LABEL[type]
}

function ParentDashboardPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params)
  const router = useRouter()
  const search = useSearchParams()
  const lessonParam = search.get('lesson')
  const lessonId = lessonParam ? Number(lessonParam) : undefined
  const [tab, setTab] = useState<Tab>('lesson')
  const [data, setData] = useState<ParentDashboardData | null>(null)
  const [lessons, setLessons] = useState<ParentLessonListItem[]>([])
  const [notices, setNotices] = useState<ParentNoticeItem[]>([])
  const [lessonQuery, setLessonQuery] = useState('')
  const [pastId, setPastId] = useState<number | null>(null)
  const [pastDetail, setPastDetail] = useState<ParentDashboardData | null>(null)
  const [pastLoading, setPastLoading] = useState(false)
  const [pastError, setPastError] = useState<string | null>(null)
  const pastRequest = useRef(0)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const tour = useTutorial()
  const showSamples = tour.status === 'in_progress'
  const sampleDate = data?.lesson_date ?? new Date().toISOString().slice(0, 10)
  const sampleClass = data?.class_name ?? '클랫반'
  const displayLessons =
    showSamples && lessons.length < 2
      ? [...tutorialPastLessons(sampleClass, sampleDate), ...lessons]
      : lessons
  const displayNotices = useMemo(() => {
    const source = showSamples && notices.length === 0 ? tutorialNotices(sampleDate, sampleClass) : notices
    return [...source].sort((a, b) => b.sent_at.localeCompare(a.sent_at))
  }, [notices, sampleClass, sampleDate, showSamples])
  const filteredLessons = useMemo(
    () => displayLessons.filter((lesson) => lessonMatches(lesson, lessonQuery)),
    [displayLessons, lessonQuery],
  )

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setErrorMsg(null)
    parentDashboardService
      .getByToken(token, Number.isFinite(lessonId) ? lessonId : undefined)
      .then((res) => {
        if (cancelled) return
        if (res.legacy_redirect && res.token) {
          const next = res.lesson_id
            ? `/parent/${res.token}?lesson=${res.lesson_id}`
            : `/parent/${res.token}`
          router.replace(next)
          return
        }
        setData(res)
        if (!lessonParam && res.lesson_id) {
          router.replace(`/parent/${token}?lesson=${res.lesson_id}`)
        }
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
  }, [lessonId, lessonParam, router, token])

  useEffect(() => {
    let cancelled = false
    async function loadLessons() {
      const all: ParentLessonListItem[] = []
      let page = 1
      let more = true
      while (more && page <= 15) {
        try {
          const res = await parentDashboardService.listLessons(token, page)
          all.push(...res.lessons)
          more = res.has_more
          page += 1
        } catch {
          more = false
        }
        if (cancelled) return
      }
      if (!cancelled) setLessons(all)
    }
    void loadLessons()
    return () => {
      cancelled = true
    }
  }, [token])

  useEffect(() => {
    if (tab !== 'notices') return
    let cancelled = false
    parentDashboardService
      .listNotices(token)
      .then((res) => {
        if (!cancelled) setNotices(res.notices)
      })
      .catch(() => {
        if (!cancelled) setNotices([])
      })
    return () => {
      cancelled = true
    }
  }, [tab, token])

  const closePast = () => {
    pastRequest.current += 1
    setPastId(null)
    setPastDetail(null)
    setPastError(null)
    setPastLoading(false)
  }

  const openPast = (lesson: ParentLessonListItem) => {
    const request = pastRequest.current + 1
    pastRequest.current = request
    setPastId(lesson.lesson_id)
    setPastError(null)
    if (lesson.lesson_id <= 0) {
      if (!data) return
      setPastDetail({
        ...data,
        lesson_id: lesson.lesson_id,
        lesson_date: lesson.lesson_date,
        class_name: lesson.class_name,
      })
      setPastLoading(false)
      return
    }
    setPastLoading(true)
    setPastDetail(null)
    parentDashboardService
      .getByToken(token, lesson.lesson_id)
      .then((res) => {
        if (pastRequest.current !== request) return
        if (res.legacy_redirect) {
          setPastError('이 수업을 열지 못했어요.')
          return
        }
        setPastDetail(res)
      })
      .catch(() => {
        if (pastRequest.current !== request) return
        setPastError('이 수업을 열지 못했어요.')
      })
      .finally(() => {
        if (pastRequest.current === request) setPastLoading(false)
      })
  }

  const chrome = (
    <div className={styles.chrome}>
      <div className={styles.tabRow}>
        {(
          [
            ['lesson', '이번 수업'],
            ['timeline', '지난 수업'],
            ['notices', '공지'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? `${styles.tabButton} ${styles.tabButtonOn}` : styles.tabButton}
            data-tour={
              id === 'lesson' ? 'parent-tab-lesson' : id === 'timeline' ? 'parent-tab-timeline' : 'parent-tab-notices'
            }
            onClick={() => {
              setTab(id)
              if (id !== 'timeline') closePast()
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )

  const backButton = (
    <button type="button" className={styles.backButton} onClick={closePast} aria-label="지난 수업 목록">
      <ArrowLeftIcon className={styles.icon16} />
    </button>
  )

  return (
    <div className={styles.page}>
      {loading ? <div className={styles.stateBox}>불러오는 중...</div> : null}
      {!loading && errorMsg ? <div className={styles.stateBox}>{errorMsg}</div> : null}
      {!loading && !errorMsg && data && tab === 'lesson' ? (
        <ParentDashboardView data={data} header={chrome} />
      ) : null}
      {!loading && !errorMsg && data && tab === 'timeline' && pastId == null ? (
        <div className={styles.frame}>
          {chrome}
          <div data-tour="parent-timeline">
            <div className={styles.searchField}>
              <input
                className={styles.searchInput}
                value={lessonQuery}
                onChange={(event) => setLessonQuery(event.target.value)}
                placeholder="날짜, 반 이름"
                aria-label="날짜 또는 반 이름으로 찾기"
              />
              <ParentDateCalendar onSelect={(date) => setLessonQuery(formatDay(format(date, 'yyyy-MM-dd')))} />
            </div>
            <p className={styles.lessonCount}>지난 수업 {filteredLessons.length}개</p>
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.lesson_id}
                type="button"
                className={styles.lessonCard}
                onClick={() => openPast(lesson)}
              >
                <span className={styles.lessonCardText}>
                  <span className={styles.listTitle}>{formatDay(lesson.lesson_date)}</span>
                  <span className={styles.listMeta}>
                    {lesson.class_name} · {lesson.template_name}
                  </span>
                </span>
                <ChevronRightIcon className={styles.chevron} aria-hidden="true" />
              </button>
            ))}
            {displayLessons.length === 0 ? <div className={styles.emptyLine}>아직 수업이 없어요.</div> : null}
            {displayLessons.length > 0 && filteredLessons.length === 0 ? (
              <div className={styles.emptyLine}>찾는 수업이 없어요.</div>
            ) : null}
          </div>
        </div>
      ) : null}
      {!loading && !errorMsg && data && tab === 'timeline' && pastId != null ? (
        pastDetail && !pastLoading ? (
          <ParentDashboardView data={pastDetail} lookup onBack={closePast} />
        ) : (
          <div className={styles.frame}>
            {backButton}
            <div className={styles.emptyLine}>{pastError ?? '불러오는 중...'}</div>
          </div>
        )
      ) : null}
      {!loading && !errorMsg && data && tab === 'notices' ? (
        <div className={styles.frame}>
          {chrome}
          <div data-tour="parent-notices">
            {displayNotices.map((notice, index) => (
              <article key={notice.batch_id} className={styles.noticeCard}>
                <div className={styles.noticeHead}>
                  <span className={styles.noticeType}>{noticeLabel(notice.notice_type)}</span>
                  {index === 0 ? <span className={styles.noticeNew}>NEW</span> : null}
                </div>
                <p className={styles.noticeBody}>{notice.body}</p>
                <p className={styles.noticeDate}>{formatDay(notice.sent_at)}</p>
              </article>
            ))}
            {displayNotices.length === 0 ? <div className={styles.emptyLine}>받은 공지가 없어요.</div> : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default function Page(props: { params: Promise<{ token: string }> }) {
  return (
    <Suspense fallback={<div className={styles.stateBox}>불러오는 중...</div>}>
      <ParentDashboardPage {...props} />
    </Suspense>
  )
}
