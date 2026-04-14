import type { LessonStudent } from '@/types/lessonStudent'

export const MOCK_LESSONS = [
  {
    id: 1,
    academyName: '엘리에듀학원',
    templateName: '정규 수업 템플릿',
    className: '미적분 A반',
    progress: 100,
    totalStudents: 29,
    inputCount: 29,
    isDone: true,
  },
  {
    id: 2,
    academyName: '엘리에듀학원',
    templateName: '겨울방학 특강 템플릿',
    className: '미적분 A반',
    progress: 0,
    totalStudents: 29,
    inputCount: 0,
    isDone: false,
  },
  {
    id: 3,
    academyName: '엘리에듀학원',
    templateName: '겨울방학 특강 템플릿',
    className: '미적분 A반',
    progress: 0,
    totalStudents: 29,
    inputCount: 0,
    isDone: false,
  },
]

export const MOCK_LESSON_TEMPLATES = [
  { id: 1, name: '정규 수업 템플릿' },
  { id: 2, name: '클리닉 템플릿' },
  { id: 3, name: '보강 템플릿' },
]

export const MOCK_COMMON_ITEMS = [
  { id: 1, label: '오늘 학습 내용' },
  { id: 2, label: '다음 시간 범위' },
  { id: 3, label: '클리닉 안내' },
  { id: 4, label: '이번 주 과제' },
]

export const MOCK_LESSON_STUDENTS: LessonStudent[] = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: '홍길동',
  attendance: null,
  homework: null,
  answerNote: null,
  score: '',
  memo: '',
  items: [],
}))

// AddLessonModal에서 수업을 추가할 수 있는 반 목록
export const MOCK_LESSON_CLASSES = [
  { id: 1, name: '미적분 B반', academyName: '엘리에듀학원', schedule: '수·금' },
  { id: 2, name: '토요 클리닉', academyName: '엘리에듀학원', schedule: '수·금' },
  { id: 3, name: '기하 A반', academyName: '엘리에듀학원', schedule: '수·금' },
]
