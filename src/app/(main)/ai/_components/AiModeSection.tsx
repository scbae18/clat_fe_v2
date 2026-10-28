'use client'

import type { AiFeedbackMode, AiSettings } from '@/services/aiSettings'
import * as styles from '../aiSettings.css'

const MODES: Array<{ value: AiFeedbackMode; label: string; help: string }> = [
  {
    value: 'AUTO',
    label: '자동',
    help: '수업 기록으로 AI가 글을 씁니다.',
  },
  {
    value: 'ASSIST',
    label: '다듬기',
    help: '적은 메모만 선생님 말투로 다듬습니다. 없는 내용은 보태지 않습니다.',
  },
  {
    value: 'MANUAL',
    label: '직접 쓰기',
    help: '선생님이 피드백 본문을 직접 씁니다.',
  },
]

type AiModeSectionProps = {
  settings: AiSettings
  onUpdate: <K extends keyof AiSettings>(key: K, value: AiSettings[K]) => void
}

export function AiModeSection({ settings, onUpdate }: AiModeSectionProps) {
  const current = MODES.find((mode) => mode.value === settings.feedback_mode) ?? MODES[0]
  return (
    <section className={styles.card} data-tour="ai-mode">
      <h2 className={styles.sectionTitle}>피드백 방식</h2>
      <div className={styles.chipRow}>
        {MODES.map((mode) => {
          const active = settings.feedback_mode === mode.value
          return (
            <button
              key={mode.value}
              type="button"
              className={`${styles.chip} ${active ? styles.chipActive : styles.chipInactive}`}
              onClick={() => onUpdate('feedback_mode', mode.value)}
            >
              {mode.label}
            </button>
          )
        })}
      </div>
      <p className={styles.modeHelp}>{current.help}</p>
    </section>
  )
}
