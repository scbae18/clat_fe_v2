import type { TutorialAction } from './tutorialEvents'

export interface TutorialBeat {
  anchor: string
  title: string
  body: string
  note?: string
  mode: 'next' | 'click' | 'action'
  action?: TutorialAction
  allowSkip?: boolean
}

export const TUTORIAL_BEATS: Record<number, TutorialBeat[]> = {
  1: [
    {
      anchor: 'template-attendance',
      title: '출결 칸이에요',
      body: '학생마다 다르게 적는 칸이에요. 출결은 빼지 않아요.',
      mode: 'next',
    },
    {
      anchor: 'template-preview',
      title: '문자에 이렇게 나와요',
      body: '오른쪽이 보낼 문자 모양이에요. 학원 이름은 예시예요.',
      mode: 'next',
    },
    {
      anchor: 'template-save',
      title: '이 틀을 써요',
      body: '저장을 누르면 체험 수업에 이 틀이 붙어요.',
      mode: 'action',
      action: 'template-save',
    },
  ],
  2: [
    {
      anchor: 'ai-mode',
      title: '학부모 문장을 정해요',
      body: '자동이면 수업 내용으로 문장을 만들어요.',
      mode: 'next',
    },
    {
      anchor: 'ai-save',
      title: '이 설정을 저장해요',
      body: '위쪽 저장을 눌러 주세요.',
      mode: 'action',
      action: 'ai-save',
    },
  ],
  3: [
    {
      anchor: 'attendance-start',
      title: '출결 문자를 보내요',
      body: '선생님 번호로 출결 문자가 나가요. 출결 시작을 눌러 주세요.',
      mode: 'action',
      action: 'attendance-start',
      allowSkip: true,
    },
  ],
  4: [
    {
      anchor: 'lesson-attend',
      title: '출석을 눌러요',
      body: '내 이름 줄의 출석을 눌러 주세요. 저장되면 수업 내용이 생겨요.',
      mode: 'action',
      action: 'lesson-attend',
    },
  ],
  5: [
    {
      anchor: 'alimtalk-send-open',
      title: '수업 결과를 보내요',
      body: '이 버튼을 누르면 확인창이 열려요.',
      note: '진짜 학생은 학부모 번호를 여기에 넣어요.',
      mode: 'click',
      allowSkip: true,
    },
    {
      anchor: 'alimtalk-send',
      title: '선생님 번호로 나가요',
      body: '발송을 누르면 결과 문자가 나가요. 출결 문자와는 달라요.',
      mode: 'action',
      action: 'alimtalk-send',
      allowSkip: true,
    },
  ],
  6: [
    {
      anchor: 'parent-dashboard',
      title: '학부모 화면을 봐요',
      body: '학부모 대시보드 보기를 눌러 주세요. 방금 수업이 거기 보여요.',
      mode: 'action',
      action: 'parent-open',
      allowSkip: true,
    },
  ],
}

export function lessonCue(step: number): 'attendance' | 'send' | null {
  if (step === 3) return 'attendance'
  if (step === 5) return 'send'
  return null
}
