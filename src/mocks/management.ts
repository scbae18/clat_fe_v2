import type { Student } from '@/types/student'

export const MOCK_CLASSES = [
  {
    id: 1,
    academyName: '엘리에듀학원',
    name: '미적분 A반',
    schedule: '수·금 14:00 – 16:00',
    studentCount: 25,
    isEnded: false,
  },
  {
    id: 2,
    academyName: '엘리에듀학원',
    name: '미적분 A반',
    schedule: '수·금 14:00 – 16:00',
    studentCount: 25,
    isEnded: false,
  },
  {
    id: 3,
    academyName: '엘리에듀학원',
    name: '미적분 A반',
    schedule: '수·금 14:00 – 16:00',
    studentCount: 25,
    isEnded: true,
    startDate: '26.02.14',
    endDate: '26.07.23',
  },
]

export const MOCK_ALL_STUDENTS: Student[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: '홍길동',
  phone: '010-1234-5678',
  parent_phone: '010-1234-5678',
  completion_rate: 0,
  total_incomplete_items: 0,
  classes: [],
}))

export const MOCK_CLASS = {
  id: 1,
  name: '미적분 A반',
  academyName: '엘리에듀학원',
  schedule: '화·금',
  time: '16:00 - 17:30',
  template: '정규 수업 템플릿',
}

export const MOCK_CLASS_STUDENTS: Student[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: '홍길동',
  phone: '010-1234-5678',
  parent_phone: '010-1234-5678',
  completion_rate: 0,
  total_incomplete_items: 0,
  classes: [],
}))

// AddStudentModal에서 반에 추가할 수 있는 학생 목록
export const MOCK_CANDIDATE_STUDENTS = [
  { id: 1, name: '홍길동', phone: '010-1234-5678' },
  { id: 2, name: '김철수', phone: '010-2345-6789' },
  { id: 3, name: '이영희', phone: '010-3456-7890' },
  { id: 4, name: '박민준', phone: '010-4567-8901' },
  { id: 5, name: '최지은', phone: '010-5678-9012' },
]

// AddStudentFormModal에서 학생을 배정할 반 이름 목록
export const MOCK_CLASS_NAMES = ['미적분 A반', '미적분 B반', '미적분 C반', '기하 A반', '기하 B반']
