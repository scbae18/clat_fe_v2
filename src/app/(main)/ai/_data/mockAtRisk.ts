import type {
  DismissedStudent,
  RecentLessonSummary,
  RiskHistoryPoint,
  RiskSnapshot,
  RiskTimelineItem,
} from '../_types/atRisk'

const SIGNAL_LABEL = {
  ABSENCE_RATE: '출석',
  SCORE_TREND: '성적',
  HOMEWORK_MISS: '과제',
  NEGATIVE_NOTE: '메모',
  INACTIVITY: '비활성',
} as const

function buildHistory(
  baseScore: number,
  weeks = 12,
  pattern: 'rising' | 'stable' | 'declining' = 'stable',
): RiskHistoryPoint[] {
  const today = new Date('2026-04-25')
  const out: RiskHistoryPoint[] = []
  for (let i = weeks - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(d.getDate() - i * 7)
    const noise = ((i * 13) % 7) - 3
    let trend = 0
    if (pattern === 'rising') trend = -((weeks - 1 - i) * 2)
    if (pattern === 'declining') trend = (weeks - 1 - i) * 3
    const score = Math.max(5, Math.min(95, baseScore + trend + noise))
    const level =
      score >= 70 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW'
    out.push({
      date: d.toISOString().slice(0, 10),
      score,
      level,
    })
  }
  return out
}

export const MOCK_AT_RISK_SNAPSHOTS: RiskSnapshot[] = [
  {
    studentId: 1001,
    studentName: '김서현',
    className: '수학A반',
    schoolName: '서림중학교',
    grade: '중2',
    joinedDays: 184,
    level: 'HIGH',
    score: 78,
    scoreDelta: 12,
    topSignalCodes: ['ABSENCE_RATE', 'SCORE_TREND', 'HOMEWORK_MISS'],
    signals: [
      {
        code: 'ABSENCE_RATE',
        label: SIGNAL_LABEL.ABSENCE_RATE,
        value: '50%',
        threshold: '≥ 30%',
        points: 32,
        detail: '최근 4주 12회 중 6회 결석',
      },
      {
        code: 'SCORE_TREND',
        label: SIGNAL_LABEL.SCORE_TREND,
        value: '-1.6/회',
        threshold: '≤ -0.5',
        points: 22,
        detail: '단원평가 84 → 78 → 72 → 68',
      },
      {
        code: 'HOMEWORK_MISS',
        label: SIGNAL_LABEL.HOMEWORK_MISS,
        value: '5중 3',
        threshold: '≥ 3회',
        points: 14,
        detail: '최근 5회 중 3회 미완료',
      },
      {
        code: 'NEGATIVE_NOTE',
        label: SIGNAL_LABEL.NEGATIVE_NOTE,
        value: '2건',
        threshold: '≥ 2건',
        points: 7,
        detail: '"산만함", "의욕 저하" 등',
      },
      {
        code: 'INACTIVITY',
        label: SIGNAL_LABEL.INACTIVITY,
        value: '4일 전',
        threshold: '≥ 14일',
        points: 3,
      },
    ],
    brief: {
      oneLiner:
        '서현이 최근 3주 출석률이 50%까지 떨어졌고, 단원평가도 2회 연속 하락했어요. 지난주 알림톡도 학부모님이 안 여신 것 같아요. 조용히 멀어지고 있는 신호 같아요.',
      causes: [
        '학습 부담 누적으로 동기 저하 가능성',
        '과제 적체로 결석 → 이해 부족 → 또 결석의 악순환',
      ],
      actions: [
        { id: 'a1', label: '다음 수업 시작 전 1:1로 가볍게 안부 묻기', type: 'note' },
        { id: 'a2', label: '쉬운 문제로 성공 경험 만들기', type: 'review' },
        { id: 'a3', label: '학부모께 상담 제안 메시지 보내기', type: 'memo' },
      ],
    },
    computedAt: '2026-04-25T03:00:00+09:00',
  },
  {
    studentId: 1002,
    studentName: '박준우',
    className: '영어B반',
    schoolName: '대치초등학교',
    grade: '초6',
    joinedDays: 92,
    level: 'MEDIUM',
    score: 58,
    scoreDelta: 8,
    topSignalCodes: ['HOMEWORK_MISS', 'NEGATIVE_NOTE'],
    signals: [
      {
        code: 'ABSENCE_RATE',
        label: SIGNAL_LABEL.ABSENCE_RATE,
        value: '17%',
        threshold: '≥ 30%',
        points: 8,
      },
      {
        code: 'SCORE_TREND',
        label: SIGNAL_LABEL.SCORE_TREND,
        value: '-0.4/회',
        threshold: '≤ -0.5',
        points: 10,
      },
      {
        code: 'HOMEWORK_MISS',
        label: SIGNAL_LABEL.HOMEWORK_MISS,
        value: '5중 4',
        threshold: '≥ 3회',
        points: 22,
        detail: '단어 외우기 4회 연속 미완료',
      },
      {
        code: 'NEGATIVE_NOTE',
        label: SIGNAL_LABEL.NEGATIVE_NOTE,
        value: '3건',
        threshold: '≥ 2건',
        points: 12,
        detail: '"수업 중 졸음", "딴짓"',
      },
      {
        code: 'INACTIVITY',
        label: SIGNAL_LABEL.INACTIVITY,
        value: '2일 전',
        threshold: '≥ 14일',
        points: 6,
      },
    ],
    brief: {
      oneLiner:
        '준우가 단어 숙제를 4회 연속 안 해오고 있어요. 수업 메모에도 "졸음", "딴짓" 키워드가 늘었어요. 학습 흥미가 떨어지기 시작한 것 같아요.',
      causes: [
        '수업 난이도가 본인 수준과 안 맞을 가능성',
        '학교/가정 외부 요인으로 피로 누적 가능성',
      ],
      actions: [
        { id: 'a1', label: '단어 분량 절반으로 줄여서 성공 경험 만들기', type: 'review' },
        { id: 'a2', label: '학부모께 가벼운 톤의 안내 남기기', type: 'memo' },
      ],
    },
    computedAt: '2026-04-25T03:00:00+09:00',
  },
  {
    studentId: 1003,
    studentName: '이하영',
    className: '수학C반',
    schoolName: '강남고등학교',
    grade: '고1',
    joinedDays: 312,
    level: 'MEDIUM',
    score: 49,
    scoreDelta: 4,
    topSignalCodes: ['SCORE_TREND', 'ABSENCE_RATE'],
    signals: [
      {
        code: 'ABSENCE_RATE',
        label: SIGNAL_LABEL.ABSENCE_RATE,
        value: '25%',
        threshold: '≥ 30%',
        points: 14,
      },
      {
        code: 'SCORE_TREND',
        label: SIGNAL_LABEL.SCORE_TREND,
        value: '-0.9/회',
        threshold: '≤ -0.5',
        points: 18,
        detail: '모의고사 2등급 → 3등급',
      },
      {
        code: 'HOMEWORK_MISS',
        label: SIGNAL_LABEL.HOMEWORK_MISS,
        value: '5중 1',
        threshold: '≥ 3회',
        points: 4,
      },
      {
        code: 'NEGATIVE_NOTE',
        label: SIGNAL_LABEL.NEGATIVE_NOTE,
        value: '1건',
        threshold: '≥ 2건',
        points: 5,
      },
      {
        code: 'INACTIVITY',
        label: SIGNAL_LABEL.INACTIVITY,
        value: '오늘',
        threshold: '≥ 14일',
        points: 2,
      },
    ],
    brief: {
      oneLiner:
        '하영이 성적이 최근 2회 모의고사에서 한 등급 떨어졌어요. 출석은 괜찮은데 시험 직전에 결석하는 패턴이 보여요.',
      causes: [
        '시험 부담감으로 회피 행동 가능성',
        '특정 단원에서 막혀 있을 가능성',
      ],
      actions: [
        { id: 'a1', label: '취약 단원 진단 후 보강 일정 제안', type: 'review' },
        { id: 'a2', label: '결석한 회차 보충 자료 보내기', type: 'memo' },
      ],
    },
    computedAt: '2026-04-25T03:00:00+09:00',
  },
]

export const MOCK_LOW_SNAPSHOTS: RiskSnapshot[] = [
  {
    studentId: 2001,
    studentName: '정민호',
    className: '수학A반',
    schoolName: '서림중학교',
    grade: '중2',
    joinedDays: 220,
    level: 'LOW',
    score: 18,
    scoreDelta: -2,
    topSignalCodes: [],
    signals: [
      {
        code: 'ABSENCE_RATE',
        label: SIGNAL_LABEL.ABSENCE_RATE,
        value: '8%',
        threshold: '≥ 30%',
        points: 4,
      },
      {
        code: 'SCORE_TREND',
        label: SIGNAL_LABEL.SCORE_TREND,
        value: '+0.6/회',
        threshold: '≤ -0.5',
        points: 0,
      },
      {
        code: 'HOMEWORK_MISS',
        label: SIGNAL_LABEL.HOMEWORK_MISS,
        value: '5중 0',
        threshold: '≥ 3회',
        points: 0,
      },
      {
        code: 'NEGATIVE_NOTE',
        label: SIGNAL_LABEL.NEGATIVE_NOTE,
        value: '0건',
        threshold: '≥ 2건',
        points: 0,
      },
      {
        code: 'INACTIVITY',
        label: SIGNAL_LABEL.INACTIVITY,
        value: '2일 전',
        threshold: '≥ 14일',
        points: 14,
      },
    ],
    brief: {
      oneLiner: '민호는 안정적으로 잘 따라오고 있어요. 이번 주도 칭찬 한 번 어떨까요?',
      causes: [],
      actions: [
        { id: 'a1', label: '수업 시작 시 칭찬 한마디', type: 'praise' },
      ],
    },
    computedAt: '2026-04-25T03:00:00+09:00',
  },
  {
    studentId: 2002,
    studentName: '최지수',
    className: '영어B반',
    schoolName: '대치초등학교',
    grade: '초6',
    joinedDays: 145,
    level: 'LOW',
    score: 24,
    scoreDelta: 0,
    topSignalCodes: [],
    signals: [
      {
        code: 'ABSENCE_RATE',
        label: SIGNAL_LABEL.ABSENCE_RATE,
        value: '12%',
        threshold: '≥ 30%',
        points: 6,
      },
      {
        code: 'SCORE_TREND',
        label: SIGNAL_LABEL.SCORE_TREND,
        value: '+0.2/회',
        threshold: '≤ -0.5',
        points: 0,
      },
      {
        code: 'HOMEWORK_MISS',
        label: SIGNAL_LABEL.HOMEWORK_MISS,
        value: '5중 1',
        threshold: '≥ 3회',
        points: 4,
      },
      {
        code: 'NEGATIVE_NOTE',
        label: SIGNAL_LABEL.NEGATIVE_NOTE,
        value: '0건',
        threshold: '≥ 2건',
        points: 0,
      },
      {
        code: 'INACTIVITY',
        label: SIGNAL_LABEL.INACTIVITY,
        value: '오늘',
        threshold: '≥ 14일',
        points: 0,
      },
    ],
    brief: {
      oneLiner: '지수도 잘 따라오고 있어요. 특별히 챙길 신호는 없어요.',
      causes: [],
      actions: [],
    },
    computedAt: '2026-04-25T03:00:00+09:00',
  },
]

export const MOCK_NEW_SNAPSHOT: RiskSnapshot = {
  studentId: 3001,
  studentName: '강한별',
  className: '수학B반',
  grade: '중1',
  joinedDays: 7,
  level: 'NEW',
  score: 0,
  scoreDelta: 0,
  topSignalCodes: [],
  signals: [],
  brief: {
    oneLiner: '아직 학생을 알아가는 중이에요. 수업 기록이 3회 이상 쌓이면 분석을 시작할게요.',
    causes: [],
    actions: [],
  },
  computedAt: '2026-04-25T03:00:00+09:00',
}

export const MOCK_RISK_HISTORY: Record<number, RiskHistoryPoint[]> = {
  1001: buildHistory(40, 12, 'declining'),
  1002: buildHistory(35, 12, 'stable'),
  1003: buildHistory(30, 12, 'declining'),
  2001: buildHistory(20, 12, 'rising'),
  2002: buildHistory(28, 12, 'stable'),
}

export const MOCK_RISK_TIMELINE: Record<number, RiskTimelineItem[]> = {
  1001: [
    {
      date: '2026-04-25',
      score: 78,
      level: 'HIGH',
      oneLiner: '출석이 흔들리고 있어요. 1:1 확인이 필요해 보여요.',
    },
    {
      date: '2026-04-18',
      score: 66,
      level: 'MEDIUM',
      oneLiner: '점수 하락이 시작됐어요. 한 번 살펴봐 주세요.',
      decision: 'SNOOZED',
    },
    {
      date: '2026-04-11',
      score: 52,
      level: 'MEDIUM',
      oneLiner: '과제 미완료가 늘고 있어요.',
      decision: 'ACTED',
    },
    {
      date: '2026-04-04',
      score: 38,
      level: 'LOW',
      oneLiner: '안정적이에요.',
    },
  ],
  1002: [
    {
      date: '2026-04-25',
      score: 58,
      level: 'MEDIUM',
      oneLiner: '단어 숙제 4회 연속 미완료. 흥미가 떨어지는 신호예요.',
    },
    {
      date: '2026-04-18',
      score: 50,
      level: 'MEDIUM',
      oneLiner: '수업 중 졸음 메모가 누적되고 있어요.',
    },
    {
      date: '2026-04-11',
      score: 42,
      level: 'MEDIUM',
      oneLiner: '주의 깊게 살펴봐 주세요.',
      decision: 'ACTED',
    },
  ],
  1003: [
    {
      date: '2026-04-25',
      score: 49,
      level: 'MEDIUM',
      oneLiner: '시험 직전 결석 패턴이 보여요.',
    },
    {
      date: '2026-04-18',
      score: 45,
      level: 'MEDIUM',
      oneLiner: '모의고사 한 등급 하락.',
    },
  ],
}

export const MOCK_RECENT_LESSONS: Record<number, RecentLessonSummary[]> = {
  1001: [
    { date: '2026-04-22', templateName: '중등 수학 단원평가', score: 68, homeworkCompleted: false, attendance: '결석' },
    { date: '2026-04-19', templateName: '중등 수학 정규', score: null, homeworkCompleted: true, attendance: '출석', note: '집중도 평소보다 낮았음' },
    { date: '2026-04-15', templateName: '중등 수학 정규', score: 72, homeworkCompleted: false, attendance: '지각' },
    { date: '2026-04-12', templateName: '중등 수학 단원평가', score: 78, homeworkCompleted: true, attendance: '출석' },
    { date: '2026-04-08', templateName: '중등 수학 정규', score: 84, homeworkCompleted: true, attendance: '출석' },
  ],
  1002: [
    { date: '2026-04-23', templateName: '초등 영어 정규', score: 72, homeworkCompleted: false, attendance: '출석', note: '단어 숙제 또 안 해옴' },
    { date: '2026-04-20', templateName: '초등 영어 정규', score: 68, homeworkCompleted: false, attendance: '출석', note: '수업 중 졸음' },
    { date: '2026-04-16', templateName: '초등 영어 정규', score: 74, homeworkCompleted: false, attendance: '출석' },
    { date: '2026-04-13', templateName: '초등 영어 정규', score: 78, homeworkCompleted: false, attendance: '출석' },
    { date: '2026-04-09', templateName: '초등 영어 정규', score: 80, homeworkCompleted: true, attendance: '출석' },
  ],
  1003: [
    { date: '2026-04-24', templateName: '고등 수학 정규', score: 76, homeworkCompleted: true, attendance: '출석' },
    { date: '2026-04-21', templateName: '고등 모의고사', score: 64, homeworkCompleted: true, attendance: '출석', note: '미적분 단원 약함' },
    { date: '2026-04-17', templateName: '고등 수학 정규', score: null, homeworkCompleted: true, attendance: '결석' },
    { date: '2026-04-14', templateName: '고등 수학 정규', score: 80, homeworkCompleted: true, attendance: '출석' },
    { date: '2026-04-10', templateName: '고등 수학 정규', score: 82, homeworkCompleted: true, attendance: '출석' },
  ],
}

export const MOCK_DISMISSED_STUDENTS: DismissedStudent[] = [
  {
    studentId: 4001,
    studentName: '박민호',
    className: '수학A반',
    dismissedAt: '2026-04-15T10:00:00+09:00',
    snoozeUntil: '2026-05-15T10:00:00+09:00',
  },
  {
    studentId: 4002,
    studentName: '정수아',
    className: '영어A반',
    dismissedAt: '2026-04-20T14:30:00+09:00',
    snoozeUntil: '2026-05-20T14:30:00+09:00',
  },
]
