'use client'

import type { TutorialScreen } from './tutorialApi'
import { useTutorial } from './TutorialProvider'
import * as styles from './tutorial.css'

const HINTS: Record<TutorialScreen, string> = {
  management: '반은 반 추가, 학생은 학생 등록이에요. 여러 명이면 일괄 등록을 써요.',
  student: '학생 줄을 누르면 출결과 수업이 모여요.',
  home: '오늘 수업이 여기 모여요.',
  alimtalk: '보낸 기록과 공지가 여기 있어요. 내 폰으로 받아보기도 여기 있어요.',
  me: '이름과 번호를 여기서 고쳐요.',
}

export default function TutorialScreenHint({ screen }: { screen: TutorialScreen }) {
  const tour = useTutorial()
  if (tour.status !== 'completed' || tour.seenScreens.includes(screen)) return null
  return (
    <div className={styles.hint}>
      <p className={styles.tooltipBody}>{HINTS[screen]}</p>
      <button type="button" className={styles.textButton} onClick={() => tour.markSeen(screen)}>
        닫기
      </button>
    </div>
  )
}
