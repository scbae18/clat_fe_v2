'use client'

import { useEffect, useMemo, useState } from 'react'
import useToast from '@/hooks/useToast'
import {
  aiSettingsService,
  type AiDataPeriod,
  type AiFeedbackLength,
  type AiSettings,
  type AiTonePreset,
} from '@/services/aiSettings'
import * as styles from './aiSettings.css'

type TonePresetMeta = { value: AiTonePreset; label: string; helper: string; example: string }
type DataPeriodMeta = { value: AiDataPeriod; label: string }
type LengthMeta = { value: AiFeedbackLength; label: string }

const TONE_PRESETS: TonePresetMeta[] = [
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

const DATA_PERIODS: DataPeriodMeta[] = [
  { value: 'THIS_LESSON', label: '이번 수업만' },
  { value: 'RECENT_3', label: '최근 3회' },
  { value: 'RECENT_5', label: '최근 5회' },
  { value: 'RECENT_1MONTH', label: '최근 1개월' },
]

const FEEDBACK_LENGTHS: LengthMeta[] = [
  { value: 'SHORT', label: '짧게 (1~2문장)' },
  { value: 'MEDIUM', label: '보통 (3~4문장)' },
  { value: 'LONG', label: '길게 (5문장 이상)' },
]

const INCLUDE_FIELDS: Array<{ key: keyof AiSettings; label: string }> = [
  { key: 'include_improvement', label: '보완할 점' },
  { key: 'include_homework', label: '과제·수업 메모' },
  { key: 'include_attendance', label: '출결' },
  { key: 'include_score', label: '점수' },
  { key: 'include_praise', label: '칭찬 포인트' },
]

const EMPTY_SETTINGS: AiSettings = {
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

function parseSampleMessages(input: string): string[] {
  return input
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
}

export default function AiSettingsPage() {
  const { success, error } = useToast()
  const [settings, setSettings] = useState<AiSettings>(EMPTY_SETTINGS)
  const [sampleFeedback, setSampleFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await aiSettingsService.getSettings()
        if (cancelled) return
        setSettings({
          ...data,
          custom_tone_description: data.custom_tone_description ?? '',
          custom_tone_messages: data.custom_tone_messages ?? '',
        })
      } catch {
        if (!cancelled) error('AI 조교 설정을 불러오지 못했어요.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // useToast() returns new function refs each render; [error] would refetch and reset form state.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load settings once on mount
  }, [])

  const selectedPreset = useMemo(
    () => TONE_PRESETS.find((p) => p.value === settings.tone_preset) ?? TONE_PRESETS[0],
    [settings.tone_preset]
  )

  const updateSetting = <K extends keyof AiSettings>(key: K, value: AiSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const onAnalyzeTone = async () => {
    const toneDescription = (settings.custom_tone_description ?? '').trim()
    const sampleMessages = parseSampleMessages(settings.custom_tone_messages ?? '')
    if (!toneDescription && sampleMessages.length === 0) {
      error('말투 설명이나 예시 메시지 중 하나는 입력해 주세요.')
      return
    }
    setAnalyzing(true)
    try {
      const res = await aiSettingsService.analyzeTone({
        tone_description: toneDescription || undefined,
        sample_messages: sampleMessages.length ? sampleMessages : undefined,
      })
      setSampleFeedback(res.sample_feedback ?? '')
      success('말투 분석이 완료됐어요.')
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response
          ?.data?.error?.message ||
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '말투 분석에 실패했어요.'
      error(msg)
    } finally {
      setAnalyzing(false)
    }
  }

  const onSave = async () => {
    const includeAny = INCLUDE_FIELDS.some((field) => Boolean(settings[field.key]))
    if (!includeAny) {
      error('필수 포함 내용은 최소 1개 이상 선택해 주세요.')
      return
    }
    setSaving(true)
    try {
      const saved = await aiSettingsService.putSettings({
        tone_preset: settings.tone_preset,
        custom_tone_description: settings.custom_tone_description?.trim() || null,
        custom_tone_messages: settings.custom_tone_messages?.trim() || null,
        data_period: settings.data_period,
        feedback_length: settings.feedback_length,
        include_score: settings.include_score,
        include_homework: settings.include_homework,
        include_attendance: settings.include_attendance,
        include_improvement: settings.include_improvement,
        include_praise: settings.include_praise,
      })
      setSettings({
        ...saved,
        custom_tone_description: saved.custom_tone_description ?? '',
        custom_tone_messages: saved.custom_tone_messages ?? '',
      })
      success('AI 조교 설정을 저장했어요.')
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response
          ?.data?.error?.message ||
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '저장에 실패했어요.'
      error(msg)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return null

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>AI 조교</h1>

      <div className={styles.cardStack}>
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
                    onClick={() => updateSetting('tone_preset', preset.value)}
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
                onChange={(e) => updateSetting('custom_tone_description', e.target.value)}
              />
              <div className={styles.customLabelRow}>
                <strong className={styles.customLabel}>예시 메시지</strong>
                <span className={styles.customHint}>줄바꿈으로 여러 개를 입력할 수 있어요</span>
              </div>
              <textarea
                className={styles.textarea}
                rows={4}
                value={settings.custom_tone_messages ?? ''}
                onChange={(e) => updateSetting('custom_tone_messages', e.target.value)}
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
          <div className={styles.sampleBox}>
            {sampleFeedback || selectedPreset.example}
          </div>
        </section>

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
                    onClick={() => updateSetting('data_period', it.value)}
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
                    onClick={() => updateSetting('feedback_length', it.value)}
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
                    onClick={() => updateSetting(field.key, !active)}
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
              onClick={() => updateSetting('include_praise', !settings.include_praise)}
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
      </div>

      <div className={styles.saveRow}>
        <button type="button" className={styles.saveButton} onClick={onSave} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </button>
      </div>
    </div>
  )
}

