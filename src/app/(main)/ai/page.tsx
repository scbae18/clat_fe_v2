'use client'

import * as styles from './aiSettings.css'
import { useAiSettingsForm } from './_hooks/useAiSettingsForm'
import { UnsavedChangesGuard } from './_hooks/useUnsavedChangesGuard'
import { AiModeSection } from './_components/AiModeSection'
import { AiToneSection } from './_components/AiToneSection'
import { AiCriteriaSection } from './_components/AiCriteriaSection'
import { AiMiscSection } from './_components/AiMiscSection'

export default function AiSettingsPage() {
  const form = useAiSettingsForm()

  return (
    <>
      <UnsavedChangesGuard dirty={!form.loading && form.dirty} />
      {form.loading ? null : (
    <div className={styles.pageRoot}>
      <div className={styles.saveBar}>
        <h1 className={styles.pageTitle}>AI 조교</h1>
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

      <div className={styles.cardStack}>
        <AiModeSection settings={form.settings} onUpdate={form.updateSetting} />
        <div className={form.settings.feedback_mode === 'MANUAL' ? styles.sectionDisabled : undefined}>
          <AiToneSection
            settings={form.settings}
            selectedPreset={form.selectedPreset}
            sampleFeedback={form.sampleFeedback}
            analyzing={form.analyzing}
            onUpdate={form.updateSetting}
            onAnalyzeTone={() => void form.onAnalyzeTone()}
          />
        </div>
        <AiCriteriaSection
          settings={form.settings}
          onUpdate={form.updateSetting}
          lengthLocked={form.settings.feedback_mode === 'MANUAL'}
        />
        <AiMiscSection settings={form.settings} onUpdate={form.updateSetting} />
      </div>
    </div>
    )}
    </>
  )
}
