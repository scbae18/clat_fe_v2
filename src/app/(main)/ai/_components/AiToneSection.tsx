'use client'

import type { AiSettings } from '@/services/aiSettings'
import * as styles from '../aiSettings.css'
import { TONE_PRESETS, type TonePresetMeta } from '../_lib/aiSettingsShared'

type AiToneSectionProps = {
  settings: AiSettings
  selectedPreset: TonePresetMeta
  sampleFeedback: string
  analyzing: boolean
  onUpdate: <K extends keyof AiSettings>(key: K, value: AiSettings[K]) => void
  onAnalyzeTone: () => void
}

export function AiToneSection({
  settings,
  selectedPreset,
  sampleFeedback,
  analyzing,
  onUpdate,
  onAnalyzeTone,
}: AiToneSectionProps) {
  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>피드백 톤</h2>

      <div className={styles.fieldRow}>
        <h3 className={styles.fieldTitle}>톤 프리셋</h3>
        <div className={styles.chipRow}>
          {TONE_PRESETS.map((preset) => {
            const active = settings.tone_preset === preset.value
            return (
              <button
                key={preset.value}
                type="button"
                className={`${styles.chip} ${active ? styles.chipActive : styles.chipInactive}`}
                onClick={() => onUpdate('tone_preset', preset.value)}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
        <p className={styles.presetHelper}>{selectedPreset.helper}</p>
      </div>

      {settings.tone_preset === 'CUSTOM' && (
        <div className={styles.customWrap}>
          <div className={styles.customLabelRow}>
            <strong className={styles.customLabel}>나만의 말투 설명</strong>
            <span className={styles.customHint}>AI에게 원하는 말투를 자유롭게 설명해 주세요</span>
          </div>
          <textarea
            className={styles.textarea}
            rows={3}
            value={settings.custom_tone_description ?? ''}
            onChange={(e) => onUpdate('custom_tone_description', e.target.value)}
          />
          <div className={styles.customLabelRow}>
            <strong className={styles.customLabel}>예시 메시지</strong>
            <span className={styles.customHint}>줄바꿈으로 여러 개를 입력할 수 있어요</span>
          </div>
          <textarea
            className={styles.textarea}
            rows={4}
            value={settings.custom_tone_messages ?? ''}
            onChange={(e) => onUpdate('custom_tone_messages', e.target.value)}
          />
          <div className={styles.analyzeRow}>
            <button
              type="button"
              className={styles.analyzeButton}
              onClick={onAnalyzeTone}
              disabled={analyzing}
            >
              {analyzing ? 'AI가 말투를 분석하고 있어요 ...' : '말투 분석하기'}
            </button>
          </div>
        </div>
      )}

      <h3 className={styles.fieldTitle}>예시 피드백</h3>
      <div className={styles.sampleBox}>{sampleFeedback || selectedPreset.example}</div>
    </section>
  )
}
