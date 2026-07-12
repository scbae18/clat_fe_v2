import type {
  AiDataPeriod,
  AiFeedbackLength,
  AiSettings,
  AiTonePreset,
} from '@/services/aiSettings'

export type TonePresetMeta = { value: AiTonePreset; label: string; helper: string; example: string }
export type DataPeriodMeta = { value: AiDataPeriod; label: string }
export type LengthMeta = { value: AiFeedbackLength; label: string }

export const TONE_PRESETS: TonePresetMeta[] = [
  {
    value: 'WARM',
    label: '따뜻하고 친근하게',
    helper: '잘한 점을 중심으로, 과제나 보완점도 부드럽게 녹여 전달해요.',
    example:
      '오늘도 열심히 해주었어요 😊 극한 개념을 잘 잡아가고 있어서 보기 좋았어요! 이번 주 과제도 빠짐없이 풀어오면 다음 시간에 훨씬 수월할 거예요.',
  },
  {
    value: 'ANALYTICAL',
    label: '꼼꼼하게 분석해서',
    helper: '성과와 데이터를 근거로 신뢰감 있게 전달해요.',
    example:
      '오늘 극한 기본 개념 이해도는 양호하였습니다. 다만 합성함수 극한 적용 문제에서 실수가 반복되고 있어 해당 유형 집중 연습이 필요한 상황입니다. 이번 주 과제에 관련 유형을 담아두었으니 반드시 풀어오시기 바랍니다.',
  },
  {
    value: 'CONCISE',
    label: '간결하게 핵심만',
    helper: '2~3문장으로 핵심만 담아, 바쁜 학부모도 한눈에 읽을 수 있어요.',
    example:
      '오늘 극한 파트 수업 잘 마쳤습니다. 합성함수 유형 복습이 필요하니 이번 주 과제 꼭 풀어오시기 바랍니다.',
  },
  {
    value: 'CUSTOM',
    label: '직접 입력',
    helper: '나만의 말투와 예시를 입력하면 AI가 따라해요.',
    example: '직접 입력한 말투 설명과 예시 메시지를 기준으로 샘플 피드백이 생성됩니다.',
  },
]

export const DATA_PERIODS: DataPeriodMeta[] = [
  { value: 'THIS_LESSON', label: '이번 수업만' },
  { value: 'RECENT_3', label: '최근 3회' },
  { value: 'RECENT_5', label: '최근 5회' },
  { value: 'RECENT_1MONTH', label: '최근 1개월' },
]

export const FEEDBACK_LENGTHS: LengthMeta[] = [
  { value: 'SHORT', label: '짧게 (1~2문장)' },
  { value: 'MEDIUM', label: '보통 (3~4문장)' },
  { value: 'LONG', label: '길게 (5문장 이상)' },
]

export const INCLUDE_FIELDS: Array<{ key: keyof AiSettings; label: string }> = [
  { key: 'include_improvement', label: '보완할 점' },
  { key: 'include_homework', label: '과제·수업 메모' },
  { key: 'include_attendance', label: '출결' },
  { key: 'include_score', label: '점수' },
  { key: 'include_praise', label: '칭찬 포인트' },
]

export const EMPTY_SETTINGS: AiSettings = {
  tone_preset: 'WARM',
  custom_tone_description: '',
  custom_tone_messages: '',
  data_period: 'THIS_LESSON',
  feedback_length: 'MEDIUM',
  include_score: true,
  include_homework: true,
  include_attendance: true,
  include_improvement: false,
  include_praise: true,
}

export function parseSampleMessages(input: string): string[] {
  return input
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

export function extractApiErrorMessage(e: unknown, fallback: string): string {
  return (
    (e as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response
      ?.data?.error?.message ||
    (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    fallback
  )
}
