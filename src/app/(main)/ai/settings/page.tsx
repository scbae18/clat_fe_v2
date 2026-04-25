'use client'

import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/common/Button/Button'
import useToast from '@/hooks/useToast'
import {
  aiSettingsService,
  type AiDataPeriod,
  type AiFeedbackLength,
  type AiSettings,
  type AiTonePreset,
} from '@/services/aiSettings'
import { MOCK_DISMISSED_STUDENTS } from '../_data/mockAtRisk'
import type { SignalCode } from '../_types/atRisk'
import * as styles from './aiSettings.css'

type TonePresetMeta = {
  value: AiTonePreset
  label: string
  helper: string
  example: string
}
type DataPeriodMeta = { value: AiDataPeriod; label: string }
type LengthMeta = { value: AiFeedbackLength; label: string }

const TONE_PRESETS: TonePresetMeta[] = [
  {
    value: 'WARM',
    label: '따뜻하고 친근하게',
    helper: '잘한 점을 중심으로, 과제나 보완점도 부드럽게 녹여 전달해요.',
    example:
      '오늘도 열심히 해주었어요. 극한 개념을 잘 잡아가고 있어서 보기 좋았어요. 이번 주 과제도 빠짐없이 풀어오면 다음 시간에 훨씬 수월할 거예요.',
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

const SIGNAL_WEIGHT_DEFAULT: Record<SignalCode, number> = {
  ABSENCE_RATE: 30,
  SCORE_TREND: 25,
  HOMEWORK_MISS: 20,
  NEGATIVE_NOTE: 15,
  INACTIVITY: 10,
}

const SIGNAL_LABEL: Record<SignalCode, string> = {
  ABSENCE_RATE: '출석률 하락',
  SCORE_TREND: '성적 하락 추세',
  HOMEWORK_MISS: '과제 미완료',
  NEGATIVE_NOTE: '부정적 메모',
  INACTIVITY: '비활성',
}

const BRIEFING_THRESHOLDS: Array<{ value: 'HIGH' | 'MEDIUM' | 'ALL'; label: string }> = [
  { value: 'HIGH', label: '위험만' },
  { value: 'MEDIUM', label: '주의 이상' },
  { value: 'ALL', label: '관찰 중 포함 전체' },
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

function extractErrorMessage(e: unknown, fallback: string): string {
  const err = e as {
    response?: { data?: { error?: { message?: string }; message?: string } }
  }
  return err?.response?.data?.error?.message || err?.response?.data?.message || fallback
}

export default function AiSettingsPage() {
  const { success, error, warning } = useToast()
  const [settings, setSettings] = useState<AiSettings>(EMPTY_SETTINGS)
  const [sampleFeedback, setSampleFeedback] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // 신규(목업): 브리핑/가중치/무시 학생
  const [briefEnabled, setBriefEnabled] = useState(true)
  const [briefingTime, setBriefingTime] = useState('08:00')
  const [briefingThreshold, setBriefingThreshold] =
    useState<'HIGH' | 'MEDIUM' | 'ALL'>('MEDIUM')
  const [channelInApp, setChannelInApp] = useState(true)
  const [channelEmail, setChannelEmail] = useState(false)
  const [weights, setWeights] = useState<Record<SignalCode, number>>(
    SIGNAL_WEIGHT_DEFAULT,
  )
  const [dismissed, setDismissed] = useState(MOCK_DISMISSED_STUDENTS)

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
      warning('말투 설명이나 예시 메시지 중 하나는 입력해 주세요.')
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
      error(extractErrorMessage(e, '말투 분석에 실패했어요.'))
    } finally {
      setAnalyzing(false)
    }
  }

  const onSave = async () => {
    const includeAny = INCLUDE_FIELDS.some((field) => Boolean(settings[field.key]))
    if (!includeAny) {
      warning('필수 포함 내용은 최소 1개 이상 선택해 주세요.')
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
      error(extractErrorMessage(e, '저장에 실패했어요.'))
    } finally {
      setSaving(false)
    }
  }

  const onResumeDismissed = (studentId: number) => {
    setDismissed((prev) => prev.filter((d) => d.studentId !== studentId))
    success('다시 위험 알림에 포함됐어요.')
  }

  const onWeightChange = (code: SignalCode, value: number) => {
    setWeights((prev) => ({ ...prev, [code]: value }))
  }

  if (loading) return null

  return (
    <div>
      <div className={styles.cardStack}>
        {/* 1. 자동 브리핑 (NEW) */}
        <section className={styles.card}>
          <div className={styles.sectionHeadRow}>
            <div>
              <h2 className={styles.sectionTitle}>자동 브리핑</h2>
              <p className={styles.sectionDesc}>
                매일 정해진 시간에 위험 학생을 모아 알려드려요.
              </p>
            </div>
          </div>

          <div className={`${styles.toggleRow} ${styles.fieldRow}`}>
            <div className={styles.toggleLabelGroup}>
              <span className={styles.toggleLabel}>매일 브리핑 받기</span>
              <span className={styles.toggleHint}>
                꺼두면 ‘학생별 위험도’에서만 직접 확인할 수 있어요.
              </span>
            </div>
            <button
              type="button"
              className={`${styles.toggle} ${briefEnabled ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => setBriefEnabled((v) => !v)}
              aria-label="브리핑 받기"
              aria-pressed={briefEnabled}
            >
              <span
                className={`${styles.toggleKnob} ${briefEnabled ? styles.toggleKnobOn : styles.toggleKnobOff}`}
              />
            </button>
          </div>

          <div className={styles.fieldRow}>
            <h3 className={styles.fieldTitle}>알림 시간</h3>
            <input
              type="time"
              className={styles.textInput}
              value={briefingTime}
              onChange={(e) => setBriefingTime(e.target.value)}
              disabled={!briefEnabled}
            />
          </div>

          <div className={styles.fieldRow}>
            <h3 className={styles.fieldTitle}>알림 임계값</h3>
            <div className={styles.chipRow}>
              {BRIEFING_THRESHOLDS.map((t) => {
                const active = briefingThreshold === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    disabled={!briefEnabled}
                    className={`${styles.chip} ${active ? styles.chipActive : styles.chipInactive}`}
                    onClick={() => setBriefingThreshold(t.value)}
                  >
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <h3 className={styles.fieldTitle}>알림 채널</h3>
            <div className={styles.radioRow}>
              <label className={styles.radio}>
                <input
                  type="checkbox"
                  checked={channelInApp}
                  disabled={!briefEnabled}
                  onChange={(e) => setChannelInApp(e.target.checked)}
                />
                서비스 안에서
              </label>
              <label className={styles.radio}>
                <input
                  type="checkbox"
                  checked={channelEmail}
                  disabled={!briefEnabled}
                  onChange={(e) => setChannelEmail(e.target.checked)}
                />
                이메일
              </label>
            </div>
          </div>
        </section>

        {/* 2. 위험 신호 가중치 (NEW) */}
        <section className={styles.card}>
          <div className={styles.sectionHeadRow}>
            <div>
              <h2 className={styles.sectionTitle}>위험 신호 가중치</h2>
              <p className={styles.sectionDesc}>
                선생님 수업 스타일에 맞춰 어떤 신호를 더 중요하게 볼지 조정할 수 있어요.
                값이 클수록 해당 신호가 위험도에 더 크게 반영돼요.
              </p>
            </div>
          </div>

          <div>
            {(Object.keys(SIGNAL_WEIGHT_DEFAULT) as SignalCode[]).map((code) => (
              <div key={code} className={styles.weightRow}>
                <span className={styles.weightLabel}>{SIGNAL_LABEL[code]}</span>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={weights[code]}
                  className={styles.slider}
                  onChange={(e) => onWeightChange(code, Number(e.target.value))}
                />
                <span className={styles.sliderValue}>{weights[code]}점</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 피드백 톤 (기존) */}
        <section className={styles.card}>
          <div className={styles.sectionHeadRow}>
            <div>
              <h2 className={styles.sectionTitle}>피드백 톤</h2>
              <p className={styles.sectionDesc}>
                학부모 피드백·문구 초안에 사용되는 기본 말투를 정해요.
              </p>
            </div>
          </div>

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
                <span className={styles.customHint}>
                  AI에게 원하는 말투를 자유롭게 설명해 주세요
                </span>
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
                <Button
                  variant="primary"
                  size="md"
                  onClick={onAnalyzeTone}
                  disabled={analyzing}
                >
                  {analyzing ? 'AI가 말투를 분석하고 있어요…' : '말투 분석하기'}
                </Button>
              </div>
            </div>
          )}

          <h3 className={styles.fieldTitle} style={{ marginTop: '20px' }}>
            예시 피드백
          </h3>
          <div className={styles.sampleBox}>
            {sampleFeedback || selectedPreset.example}
          </div>
        </section>

        {/* 4. 피드백 생성 기준 (기존) */}
        <section className={styles.card}>
          <div className={styles.sectionHeadRow}>
            <div>
              <h2 className={styles.sectionTitle}>피드백 생성 기준</h2>
              <p className={styles.sectionDesc}>
                AI가 피드백을 만들 때 어떤 데이터를 참고하고, 무엇을 꼭 언급할지 정해요.
              </p>
            </div>
          </div>

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
              <span className={styles.includeHint}>
                항상 피드백에 언급할 내용을 선택하세요
              </span>
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

        {/* 5. 위험 알림에서 제외한 학생 (NEW) */}
        <section className={styles.card}>
          <div className={styles.sectionHeadRow}>
            <div>
              <h2 className={styles.sectionTitle}>위험 알림에서 제외한 학생</h2>
              <p className={styles.sectionDesc}>
                ‘해당 없음’ 또는 ‘나중에 보기’로 보류한 학생들을 관리할 수 있어요.
              </p>
            </div>
          </div>

          {dismissed.length === 0 ? (
            <p className={styles.sectionDesc}>현재 제외 중인 학생이 없어요.</p>
          ) : (
            <table className={styles.dismissedTable}>
              <thead>
                <tr>
                  <th className={styles.dismissedTh}>학생</th>
                  <th className={styles.dismissedTh}>반</th>
                  <th className={styles.dismissedTh}>제외 시점</th>
                  <th className={styles.dismissedTh}>다시 보일 때</th>
                  <th className={styles.dismissedTh}></th>
                </tr>
              </thead>
              <tbody>
                {dismissed.map((d) => (
                  <tr key={d.studentId}>
                    <td className={styles.dismissedTd}>{d.studentName}</td>
                    <td className={styles.dismissedTd}>{d.className}</td>
                    <td className={styles.dismissedTd}>{d.dismissedAt.slice(0, 10)}</td>
                    <td className={styles.dismissedTd}>
                      {d.snoozeUntil ? d.snoozeUntil.slice(0, 10) : '—'}
                    </td>
                    <td className={styles.dismissedTd}>
                      <button
                        type="button"
                        className={styles.linkButton}
                        onClick={() => onResumeDismissed(d.studentId)}
                      >
                        다시 알림 받기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <div className={styles.saveRow}>
        <Button variant="primary" size="lg" onClick={onSave} disabled={saving}>
          {saving ? '저장 중...' : '저장'}
        </Button>
      </div>
    </div>
  )
}
