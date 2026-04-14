import type { TemplateItem } from '@/app/(main)/template/_types/template'

export const MOCK_TEMPLATES = [
  {
    id: 1,
    title: '정규 수업 템플릿1',
    classCount: 4,
    classList: ['미적분 A반', '미적분 B반', '미적분 C반', '미적분 D반'],
  },
  {
    id: 2,
    title: '보강 수업 템플릿',
    classCount: 4,
    classList: ['미적분 A반', '미적분 B반', '미적분 C반', '미적분 D반'],
  },
  {
    id: 3,
    title: '방학 특강 템플릿',
    classCount: 4,
    classList: ['미적분 A반', '미적분 B반', '미적분 C반', '미적분 D반'],
  },
  {
    id: 4,
    title: '정규 수업 템플릿2',
    classCount: 4,
    classList: ['미적분 A반', '미적분 B반', '미적분 C반', '미적분 D반'],
  },
  {
    id: 5,
    title: '시험대비 클리닉 템플릿',
    classCount: 4,
    classList: ['미적분 A반', '미적분 B반', '미적분 C반', '미적분 D반'],
  },
]

export const INITIAL_COMMON_ITEMS: TemplateItem[] = [
  {
    id: 'c-1',
    label: '오늘 학습 내용',
    isActive: true,
    isInMessage: true,
    category: 'common',
    itemType: 'inline',
  },
  {
    id: 'c-2',
    label: '다음 시간 범위',
    isActive: true,
    isInMessage: true,
    category: 'common',
    itemType: 'inline',
  },
  {
    id: 'c-3',
    label: '클리닉 안내',
    isActive: true,
    isInMessage: true,
    category: 'common',
    itemType: 'inline',
  },
  {
    id: 'c-4',
    label: '이번 주 과제',
    isActive: true,
    isInMessage: true,
    category: 'common',
    itemType: 'inline',
  },
  {
    id: 'c-5',
    label: '다음 시험 일정',
    isActive: true,
    isInMessage: true,
    category: 'common',
    itemType: 'inline',
  },
]

export const INITIAL_INDIVIDUAL_ITEMS: TemplateItem[] = [
  {
    id: 'i-1',
    label: '시험 점수',
    isActive: true,
    isInMessage: true,
    category: 'individual',
    itemType: 'number',
  },
  {
    id: 'i-2',
    label: '과제',
    isActive: true,
    isInMessage: true,
    category: 'individual',
    itemType: 'completion',
  },
  {
    id: 'i-3',
    label: '오답노트',
    isActive: true,
    isInMessage: true,
    category: 'individual',
    itemType: 'completion',
  },
]
