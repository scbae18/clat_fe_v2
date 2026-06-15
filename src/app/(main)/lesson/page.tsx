'use client'

import { Suspense, useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { startOfWeek, addWeeks, subWeeks, format, addDays, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import Text from '@/components/common/Text'
import ConfirmModal from '@/components/common/ConfirmModal'
import DateCard from './_components/DateCard/DateCard'
import LessonCard from './_components/LessonCard/LessonCard'
import AddCard from '@/components/common/AddCard'
import AddLessonModal from './_components/AddLessonModal/AddLessonModal'
import { useToastStore } from '@/stores/toastStore'
import { useAttendanceSessionStore } from '@/stores/attendanceSessionStore'
import PlusCircleIcon from '@/assets/icons/icon-plus-circle.svg'
import ArrowLeftIcon from '@/assets/icons/icon-chevron-left.svg'
import ArrowRightIcon from '@/assets/icons/icon-chevron-right.svg'
import {
  pageStyle,
  dateGridStyle,
  lessonGridStyle,
  sectionTitleStyle,
  navButtonStyle,
  weekNavStyle,
} from './lesson.css'
import { lessonService, type LessonSummary } from '@/services/lesson'
import { consumeLessonListNeedsRefresh } from '@/lib/lessonListRefresh'

const DAYS_KO = ['월', '화', '수', '목', '금', '토', '일']
type DateStatus = 'done' | 'inProgress' | 'none'

function LessonPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const addToast = useToastStore((s) => s.addToast)
  const setActiveAttendance = useAttendanceSessionStore((s) => s.setActive)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
    const dateParam = searchParams.get('date')
    if (!dateParam) return
    const parsed = new Date(`${dateParam}T00:00:00`)
    if (Number.isNaN(parsed.getTime())) return
    setSelectedDate(parsed)
    setCurrentWeek(parsed)
  }, [searchParams])
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false)
  const [lessons, setLessons] = useState<LessonSummary[]>([])
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)
  const [weekLessons, setWeekLessons] = useState<Record<string, LessonSummary[]>>({})
  const [deleteTarget, setDeleteTarget] = useState<LessonSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd')

  const refreshDayLessons = useCallback(async () => {
    const res = await lessonService.getLessons(selectedDateKey)
    setLessons(res.data)
    setWeekLessons((prev) => ({ ...prev, [selectedDateKey]: res.data }))
  }, [selectedDateKey])

  // 주간 전체 상태 조회
  useEffect(() => {
    const dates = Array.from({ length: 7 }, (_, i) =>
      format(addDays(weekStart, i), 'yyyy-MM-dd')
    )
    Promise.all(
      dates.map((date) => lessonService.getLessons(date).then((res) => ({ date, data: res.data })))
    ).then((results) => {
      const map: Record<string, LessonSummary[]> = {}
      results.forEach(({ date, data }) => { map[date] = data })
      setWeekLessons(map)
    })
  }, [currentWeek])

  // 날짜 변경·상세에서 목록 복귀(pathname) 시 재조회 — 라우터 캐시로 alimtalk_sent가 안 바뀌는 문제 방지
  useEffect(() => {
    if (pathname !== '/lesson') return
    consumeLessonListNeedsRefresh()
    setIsLoadingLessons(true)
    refreshDayLessons()
      .catch((err) => console.error('수업 목록 조회 실패', err))
      .finally(() => setIsLoadingLessons(false))
  }, [pathname, selectedDateKey, refreshDayLessons])

  // 다른 탭에서 돌아올 때 갱신
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return
      void refreshDayLessons()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [refreshDayLessons])

  const handleDeleteConfirm = async () => {
    const recordId = deleteTarget?.lesson_record_id
    if (!recordId) return
    setIsDeleting(true)
    try {
      await lessonService.deleteLesson(recordId)
      const cur = useAttendanceSessionStore.getState().active
      if (cur?.lessonRecordId === recordId) setActiveAttendance(null)
      setDeleteTarget(null)
      await refreshDayLessons()
      addToast({ variant: 'success', message: '수업 데이터를 삭제했어요.' })
    } catch {
      addToast({ variant: 'error', message: '수업 데이터 삭제에 실패했어요.' })
    } finally {
      setIsDeleting(false)
    }
  }

  const getDateStatus = (date: Date): DateStatus => {
    const key = format(date, 'yyyy-MM-dd')
    const dayLessons = weekLessons[key] ?? []
    if (dayLessons.length === 0) return 'none'
    if (dayLessons.every((l) => l.progress_rate === 1)) return 'done'
    if (dayLessons.some((l) => l.lesson_record_id !== null)) return 'inProgress'
    return 'none'
  }

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i)
    return {
      date: date.getDate(),
      day: DAYS_KO[i],
      fullDate: date,
      status: getDateStatus(date),
    }
  })

  const headerText = `${format(weekStart, 'M월 d일')} – ${format(addDays(weekStart, 6), 'M월 d일')}`
  const selectedLabel = `${format(selectedDate, 'M월 d일')}(${DAYS_KO[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1]}) 수업`

  return (
    <div className={pageStyle}>
      <Text variant="display" as="h1">수업 입력</Text>

      <div className={weekNavStyle}>
        <button className={navButtonStyle} onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
          <ArrowLeftIcon width={24} height={24} />
        </button>
        <Text variant="headingMd">{headerText}</Text>
        <button className={navButtonStyle} onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
          <ArrowRightIcon width={24} height={24} />
        </button>
      </div>

      <div className={dateGridStyle}>
        {weekDays.map((item) => (
          <DateCard
            key={item.date}
            day={item.day}
            date={item.date}
            status={item.status}
            isSelected={isSameDay(item.fullDate, selectedDate)}
            onClick={() => setSelectedDate(item.fullDate)}
          />
        ))}
      </div>

      <div className={sectionTitleStyle}>
        <Text variant="headingMd">{selectedLabel}</Text>
      </div>
      <div className={lessonGridStyle}>
        {lessons.map((lesson) => {
          const recordId = lesson.lesson_record_id ?? lesson.id ?? null
          const cardKey =
            recordId != null
              ? `${lesson.is_adhoc ? 'adhoc' : 'scheduled'}-${recordId}`
              : `pending-${selectedDateKey}-${lesson.class_id}`
          return (
            <LessonCard
              key={cardKey}
              academyName={lesson.academy_name}
              templateName={lesson.template_name ?? ''}
              className={lesson.class_name}
              progress={lesson.progress_rate * 100}
              totalStudents={lesson.total_students}
              inputCount={lesson.input_count ?? Math.round(lesson.total_students * lesson.progress_rate)}
              isDone={recordId !== null}
              alimtalkSent={lesson.alimtalk_sent ?? false}
              alimtalkDeliveryMode={lesson.alimtalk_delivery_mode ?? null}
              onDelete={
                recordId != null
                  ? () => setDeleteTarget(lesson)
                  : undefined
              }
              onClick={() => {
                if (recordId) {
                  router.push(`/lesson/${recordId}`)
                } else {
                  router.push(
                    `/lesson/new?class_id=${lesson.class_id}&date=${selectedDateKey}&is_adhoc=false`,
                  )
                }
              }}
            />
          )
        })}
        <AddCard
          icon={<PlusCircleIcon width={36} height={36} />}
          label="다른 수업 추가"
          description="오늘 일정에 없는 반의 수업을 입력할 수 있어요"
          onClick={() => setIsAddLessonOpen(true)}
        />
        <AddLessonModal
          isOpen={isAddLessonOpen}
          onClose={() => setIsAddLessonOpen(false)}
          onConfirm={(classId) => {
            router.push(
              `/lesson/new?class_id=${classId}&date=${selectedDateKey}&is_adhoc=true`,
            )
          }}
          selectedDate={selectedDate}
        />
      </div>

      <ConfirmModal
        isOpen={deleteTarget != null}
        onClose={() => {
          if (!isDeleting) setDeleteTarget(null)
        }}
        onConfirm={() => void handleDeleteConfirm()}
        title="수업 데이터를 삭제할까요?"
        descriptions={
          deleteTarget
            ? [
                '입력한 공통·개별 내용과 완료형 미완료 항목이 모두 삭제돼요.',
                deleteTarget.is_adhoc
                  ? '이 수업은 목록에서 사라져요.'
                  : '다시 「입력하기」 상태로 돌아가요.',
              ]
            : undefined
        }
        confirmLabel="삭제"
        confirmVariant="danger"
      />
    </div>
  )
}

export default function LessonPage() {
  return (
    <Suspense>
      <LessonPageContent />
    </Suspense>
  )
}