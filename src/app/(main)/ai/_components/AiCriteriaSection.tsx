'use client'

import type { AiSettings } from '@/services/aiSettings'
import * as styles from '../aiSettings.css'
import {
  DATA_PERIODS,
  FEEDBACK_LENGTHS,
  INCLUDE_FIELDS,
} from '../_lib/aiSettingsShared'

type AiCriteriaSectionProps = {
  settings: AiSettings
  onUpdate: <K extends keyof AiSettings>(key: K, value: AiSettings[K]) => void
}

export function AiCriteriaSection({ settings, onUpdate }: AiCriteriaSectionProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>피드백 생성 기준</h2>

      <div className={styles.fieldRow}>
        <h3 className={styles.fieldTitle}>데이터 기간</h3>
        <div className={styles.chipRow}>
          {DATA_PERIODS.map((it) => {
            const active = settings.data_period === it.value
            return (
              <button
                key={it.value}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : styles.chipInactive}`}
                onClick={() => onUpdate('data_period', it.value)}
              >
                {it.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={styles.fieldRow}>
        <h3 className={styles.fieldTitle}>피드백 길이</h3>
        <div className={styles.chipRow}>
          {FEEDBACK_LENGTHS.map((it) => {
            const active = settings.feedback_length === it.value
            return (
              <button
                key={it.value}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : styles.chipInactive}`}
                onClick={() => onUpdate('feedback_length', it.value)}
              >
                {it.label}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div className={styles.includeTitleRow}>
          <h3 className={styles.fieldTitle} style={{ marginBottom: 0 }}>
            필수 포함 내용
          </h3>
          <span className={styles.includeHint}>항상 피드백에 언급할 내용을 입력하세요</span>
        </div>
        <div className={styles.chipRow}>
          {INCLUDE_FIELDS.map((field) => {
            const active = Boolean(settings[field.key])
            return (
              <button
                key={field.key}
                type="button"
                className={`${styles.chip} ${styles.checkChip} ${
                  active ? styles.chipActive : styles.chipInactive
                }`}
                onClick={() => onUpdate(field.key, !active)}
              >
                <span
                  className={`${styles.checkIcon} ${
                    active ? styles.checkIconActive : styles.checkIconInactive
                  }`}
                >
                  ✓
                </span>
                {field.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
