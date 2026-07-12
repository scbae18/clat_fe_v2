'use client'

import type { AiSettings } from '@/services/aiSettings'
import * as styles from '../aiSettings.css'

type AiMiscSectionProps = {
  settings: AiSettings
  onUpdate: <K extends keyof AiSettings>(key: K, value: AiSettings[K]) => void
}

/** Preserves existing UI: “이모지 사용” toggles include_praise. */
export function AiMiscSection({ settings, onUpdate }: AiMiscSectionProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>기타 설정</h2>
      <div className={styles.toggleRow}>
        <h3 className={styles.fieldTitle} style={{ marginBottom: 0 }}>
          이모지 사용
        </h3>
        <button
          type="button"
          className={`${styles.toggle} ${
            settings.include_praise ? styles.toggleOn : styles.toggleOff
          }`}
          onClick={() => onUpdate('include_praise', !settings.include_praise)}
          aria-label="이모지 사용"
          aria-pressed={settings.include_praise}
        >
          <span
            className={`${styles.toggleKnob} ${
              settings.include_praise ? styles.toggleKnobOn : styles.toggleKnobOff
            }`}
          />
        </button>
      </div>
      <p className={styles.toggleHelp}>피드백에 이모지를 포함해요</p>
    </section>
  )
}
