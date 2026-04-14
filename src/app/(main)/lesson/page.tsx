'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { startOfWeek, addWeeks, subWeeks, format, addDays, isSameDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import Text from '@/components/common/Text'
import DateCard from './_components/DateCard/DateCard'
import LessonCard from './_components/LessonCard/LessonCard'
import AddCard from '@/components/common/AddCard'
import AddLessonModal from './_components/AddLessonModal/AddLessonModal'
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

const DAYS_KO = ['월', '화', '수', '목', '금', '토', '일']
type DateStatus = 'done' | 'inProgress' | 'none'

export default function LessonPage() {
  const router = useRouter()
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false)
  const [lessons, setLessons] = useState<LessonSummary[]>([])
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)
  const [weekLessons, setWeekLessons] = useState<Record<string, LessonSummary[]>>({})

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })

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

  // 선택된 날짜 수업 목록 조회
  useEffect(() => {
    setIsLoadingLessons(true)
    lessonService
      .getLessons(format(selectedDate, 'yyyy-MM-dd'))
      .then((res) => setLessons(res.data))
      .catch((err) => console.error('수업 목록 조회 실패', err))
      .finally(() => setIsLoadingLessons(false))
  }, [selectedDate])

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
          return (
            <LessonCard
              key={recordId ?? lesson.class_id}
              academyName={lesson.academy_name}
              templateName={lesson.template_name}
              className={lesson.class_name}
              progress={lesson.progress_rate * 100}
              totalStudents={lesson.total_students}
              inputCount={Math.round(lesson.total_students * lesson.progress_rate)}
              isDone={recordId !== null}
              onClick={() => {
                if (recordId) {
                  router.push(`/lesson/${recordId}`)
                } else {
                  router.push(`/lesson/new?class_id=${lesson.class_id}&date=${format(selectedDate, 'yyyy-MM-dd')}&is_adhoc=false`)
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
            router.push(`/lesson/new?class_id=${classId}&date=${format(selectedDate, 'yyyy-MM-dd')}&is_adhoc=true`)
          }}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  )
}