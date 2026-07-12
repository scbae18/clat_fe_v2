import { useEffect, useMemo, useState } from 'react'

import useToast from '@/hooks/useToast'
import { aiSettingsService, type AiSettings } from '@/services/aiSettings'

import {
  EMPTY_SETTINGS,
  INCLUDE_FIELDS,
  TONE_PRESETS,
  extractApiErrorMessage,
  parseSampleMessages,
} from '../_lib/aiSettingsShared'

export function useAiSettingsForm() {
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
    [settings.tone_preset],
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
      error(extractApiErrorMessage(e, '말투 분석에 실패했어요.'))
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
      error(extractApiErrorMessage(e, '저장에 실패했어요.'))
    } finally {
      setSaving(false)
    }
  }

  return {
    settings,
    sampleFeedback,
    loading,
    saving,
    analyzing,
    selectedPreset,
    updateSetting,
    onAnalyzeTone,
    onSave,
  }
}
