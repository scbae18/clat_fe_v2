import type { ScorePeriod } from '@/services/studentDashboard'

export type MainTab = 'scores' | 'lessons' | 'alimtalk'

export type AiSection = { title: string; items: string[]; kind: 'list' | 'para' }

export const MSG = {
  loadStudentFail: '학생 정보를 불러오지 못했어요.',
  loadScoresFail: '점수 이력을 불러오지 못했어요.',
  loadLessonsFail: '수업 이력을 불러오지 못했어요.',
  loadAlimFail: '알림톡 이력을 불러오지 못했어요.',
  loadAiFail: 'AI 분석을 불러오지 못했어요.',
  confirmComplete: '이 항목을 완료 처리할까요?',
  confirmCompleteDesc: [
    '완료 처리하면 해당 항목은 미완료 목록에서 사라집니다.',
    '계속하시겠습니까?',
  ],
  completeActionLabel: '완료 처리',
  completeOk: '완료 처리되었어요.',
  completeFail: '완료 처리에 실패했어요.',
  editStudent: '학생 정보 수정',
  editStudentOk: '학생 정보가 수정됐어요.',
  editStudentFail: '학생 정보 수정에 실패했어요.',
  loading: '불러오는 중…',
  back: '뒤로',
  pageTitle: '학생 대시보드',
  academy: '학원명',
  className: '소속 반',
  school: '학교명',
  phone: '학생 전화번호',
  parentPhone: '학부모 전화번호',
  monthComplete: '이번 달 완료율',
  vsLastMonth: '지난 달 대비',
  recentScore: '최근 점수',
  recentScoreTitle: '가장 최근 입력된 점수 항목 기준',
  vsClassAvg: '반 평균 대비',
  monthAttend: '이번 달 출석률',
  incompleteTitle: '미완료 항목',
  noIncomplete: '미완료 항목이 없어요.',
  tabScores: '점수 추이',
  tabLessons: '수업 이력',
  tabAlim: '알림톡',
  aiTitle: 'AI 분석',
  analyzing: '분석 중…',
  aiEmpty: '분석을 불러오지 못했어요.',
  refreshAi: '다시 분석',
  noLessons: '수업 이력이 없어요.',
  thDate: '날짜',
  thClass: '반',
  thTemplate: '템플릿',
  noAlim: '알림톡 이력이 없어요.',
  thSentDate: '발송 날짜',
  thSentTime: '발송 시간',
  thType: '유형',
  thSentClass: '반',
  today: '오늘',
  daysOverdue: (n: number) => `${n}일 지남`,
  arrowUp: '↗',
  arrowDown: '↘',
} as const

export const PERIODS: { key: ScorePeriod; label: string }[] = [
  { key: 'recent5', label: '최근 5회' },
  { key: 'recent10', label: '최근 10회' },
  { key: '1month', label: '1개월' },
  { key: '3month', label: '3개월' },
  { key: 'all', label: '전체' },
]

export function parseScoreEntry(raw: unknown): { value: string } | null {
  if (!raw || typeof raw !== 'object') return null
  const v = (raw as { value?: unknown }).value
  if (typeof v !== 'string') return null
  return { value: v }
}

export function formatScoreNum(n: number): string {
  if (!Number.isFinite(n)) return '—'
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1)
}

export function parseAiAnalysis(raw: string | null | undefined): AiSection[] {
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
