'use client'

import * as styles from './aiSettings.css'
import { useAiSettingsForm } from './_hooks/useAiSettingsForm'
import { AiToneSection } from './_components/AiToneSection'
import { AiCriteriaSection } from './_components/AiCriteriaSection'
import { AiMiscSection } from './_components/AiMiscSection'

export default function AiSettingsPage() {
  const form = useAiSettingsForm()

  if (form.loading) return null

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>AI 조교</h1>

      <div className={styles.cardStack}>
        <AiToneSection
          settings={form.settings}
          selectedPreset={form.selectedPreset}
          sampleFeedback={form.sampleFeedback}
          analyzing={form.analyzing}
          onUpdate={form.updateSetting}
          onAnalyzeTone={() => void form.onAnalyzeTone()}
        />
        <AiCriteriaSection settings={form.settings} onUpdate={form.updateSetting} />
        <AiMiscSection settings={form.settings} onUpdate={form.updateSetting} />
      </div>

      <div className={styles.saveRow}>
        <button
          type="button"
          className={styles.saveButton}
          onClick={() => void form.onSave()}
          disabled={form.saving}
        >
          {form.saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}
