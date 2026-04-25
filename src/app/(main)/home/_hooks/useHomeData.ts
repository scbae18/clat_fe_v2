'use client'

import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { lessonService, type LessonSummary } from '@/services/lesson'
import { studentService } from '@/services/student'
import type { Student } from '@/types/student'

export interface UseHomeDataResult {
  todayLessons: LessonSummary[] | null
  students: Student[] | null
  todayDate: string
  todayLessonsError: boolean
  studentsError: boolean
}

export default function useHomeData(): UseHomeDataResult {
  const todayDate = useMemo(() => format(new Date(), 'yyyy-MM-dd'), [])
  const [todayLessons, setTodayLessons] = useState<LessonSummary[] | null>(null)
  const [students, setStudents] = useState<Student[] | null>(null)
  const [todayLessonsError, setTodayLessonsError] = useState(false)
  const [studentsError, setStudentsError] = useState(false)

  useEffect(() => {
    let cancelled = false

    lessonService
      .getLessons(todayDate)
      .then((res) => {
        if (cancelled) return
        setTodayLessons(res.data)
      })
      .catch(() => {
        if (cancelled) return
        setTodayLessons([])
        setTodayLessonsError(true)
      })

    studentService
      .getStudents()
      .then((res) => {
        if (cancelled) return
        setStudents(res.data)
      })
      .catch(() => {
        if (cancelled) return
        setStudents([])
        setStudentsError(true)
      })

    return () => {
      cancelled = true
    }
  }, [todayDate])

  return {
    todayLessons,
    students,
    todayDate,
    todayLessonsError,
    studentsError,
  }
}
