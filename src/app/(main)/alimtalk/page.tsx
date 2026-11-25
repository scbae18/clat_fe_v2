'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import { alimtalkService, type AlimtalkDeliveryMode } from '@/services/alimtalk'
import { classService, type Class } from '@/services/class'
import { useUserStore } from '@/stores/userStore'
import SaveIcon from '@/assets/icons/icon-save.svg'
import clatIcon from '@/assets/images/clat-alimtalk-icon.png'
import {
  LESSON_ALIMTALK_CTA_LABEL,
  LESSON_ALIMTALK_FRAME_FOOTER,
  fillLessonAlimtalkFrameHeader,
} from '@/lib/lessonAlimtalkFrame'
import { AlimtalkTabs } from './_components/AlimtalkTabs'
import VariablePhraseField, {
  VARIABLE_INSERTS,
  type VariablePhraseFieldHandle,
} from './_components/VariablePhraseField/VariablePhraseField'
import * as styles from './alimtalkSettings.css'

const LESSON_SAMPLE = [
  '■ 오늘 학습 내용: 이차함수의 그래프',
  '■ 출결: 출석',
  '■ 시험 점수: 84점',
  '■ 피드백: 꾸준히 노력한 흔적이 보여요.',
].join('\n')

const PREVIEW_STUDENT_NAME = '홍길동'
const PREVIEW_DATE = '11월 25일'

function pickPreviewClass(classes: Class[]) {
  return classes.find((item) => !item.ended_at) ?? classes[0] ?? null
}

function PreviewPhrase({ text, samples }: { text: string; samples: Record<string, string> }) {
  const parts = text.split(/(\{[^}]+\})/g)
  return (
    <p className={styles.previewPhrase}>
      {parts.map((part, index) =>
        part.startsWith('{') && part.endsWith('}') ? (
          <strong key={`${part}-${index}`} className={styles.previewFilled}>
            {samples[part] ?? part.slice(1, -1)}
          </strong>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </p>
  )
}

function InsertChips({ onInsert }: { onInsert: (token: string) => void }) {
  return (
    <div className={styles.autoInsert}>
      <div className={styles.autoInsertHelp}>
        <p className={styles.autoInsertTitle}>자동 정보 넣기</p>
        <p className={styles.autoInsertText}>보낼 때 실제 정보로 바뀌어요.</p>
      </div>
      <div className={styles.insertChipRow}>
        {VARIABLE_INSERTS.map((item) => (
          <button
            key={item.token}
            type="button"
            className={styles.insertChip}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onInsert(item.token)}
          >
            {`+ ${item.label}`}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AlimtalkSettingsPage() {
  const { success, error } = useToast()
  const teacherName = useUserStore((state) => state.user?.name)?.trim() || '선생님'
  const introRef = useRef<VariablePhraseFieldHandle>(null)
  const outroRef = useRef<VariablePhraseFieldHandle>(null)

  const [intro, setIntro] = useState('')
  const [outro, setOutro] = useState('')
  const [deliveryMode, setDeliveryMode] = useState<AlimtalkDeliveryMode>('mock')
  const [academyName, setAcademyName] = useState('학원명')
  const [className, setClassName] = useState('반 이름')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [settings, classRes] = await Promise.all([
          alimtalkService.getSettings(),
          classService.getClasses().catch(() => null),
        ])
        if (cancelled) return
        setIntro(settings.intro_text ?? '')
        setOutro(settings.outro_text ?? '')
        setDeliveryMode(settings.delivery_mode)
        const picked = pickPreviewClass(classRes?.data ?? [])
        if (!picked) return
        const academy = picked.academy_name.trim()
        const name = picked.name.trim()
        if (academy) setAcademyName(academy)
        if (name) setClassName(name)
      } catch {
        if (!cancelled) error('설정을 불러오지 못했어요.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // useToast() returns new function refs each render; [error] would refetch and reset fields on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load settings once on mount
  }, [])

  const previewSamples: Record<string, string> = {
    '{학원명}': academyName,
    '{강사명}': teacherName,
    '{학생이름}': PREVIEW_STUDENT_NAME,
    '{날짜}': PREVIEW_DATE,
    '{수업일}': PREVIEW_DATE,
    '{반이름}': className,
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await alimtalkService.putSettings({
        intro_text: intro.trim() || null,
        outro_text: outro.trim() || null,
      })
      success('저장했어요.')
    } catch {
      error('저장에 실패했어요.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>알림톡</h1>
      {deliveryMode === 'mock' && (
        <div className={styles.deliveryBanner}>
          {'현재 '}
          <strong>모의 전송(mock)</strong>
          {' 모드입니다. 실제 카카오 알림톡은 발송되지 않아요.'}
        </div>
      )}

      <AlimtalkTabs />

      <div className={styles.settingsColumns}>
        <div className={styles.settingsFormSide}>
          <div className={styles.settingsCard}>
            <section className={styles.settingsSection} data-tour="alimtalk-intro">
              <div className={styles.settingsTitleRow}>
                <h2 className={styles.settingsTitle}>인트로</h2>
                <span className={styles.settingsTitleHint}>문자 맨 앞에 들어가는 첫인사</span>
              </div>
              <VariablePhraseField
                ref={introRef}
                value={intro}
                onChange={setIntro}
                placeholder="비워 두면 문자에 넣지 않아요"
                ariaLabel="인트로 문구"
              />
              <InsertChips onInsert={(token) => introRef.current?.insertToken(token)} />
            </section>

            <section className={styles.settingsSection} data-tour="alimtalk-outro">
              <div className={styles.settingsTitleRow}>
                <h2 className={styles.settingsTitle}>아웃트로</h2>
                <span className={styles.settingsTitleHint}>문자 맨 끝에 들어가는 끝인사</span>
              </div>
              <VariablePhraseField
                ref={outroRef}
                value={outro}
                onChange={setOutro}
                placeholder="비워 두면 문자에 넣지 않아요"
                ariaLabel="아웃트로 문구"
              />
              <InsertChips onInsert={(token) => outroRef.current?.insertToken(token)} />
            </section>

            <Button
              variant="primary"
              size="sm"
              className={styles.saveButton}
              leftIcon={<SaveIcon width={20} height={20} />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '저장 중…' : '저장'}
            </Button>
          </div>

          <Link href="/template" className={styles.templateBox}>
            <p className={styles.templateBoxText}>
              가운데 수업 내용(학습 내용·출결·점수 등)은 수업 템플릿에서 정해져요.
            </p>
            <p className={styles.templateBoxAction}>수업 템플릿 보기 →</p>
          </Link>
        </div>

        <aside className={styles.settingsPreview} data-tour="alimtalk-preview">
          <div className={styles.previewHeading}>
            <h2 className={styles.previewHeadingTitle}>알림톡 미리보기</h2>
            <p className={styles.previewHeadingText}>
              실제로 받는 예시 모습이에요. 파란 글씨는 자동으로 정보가 채워져요.
            </p>
          </div>
          <div className={styles.previewChat}>
            <Image src={clatIcon} alt="" width={36} height={36} className={styles.previewAvatar} />
            <div className={styles.previewThread}>
              <p className={styles.previewName}>클랫 수업 알림</p>
              <div className={styles.previewBubbleRow}>
                <div className={styles.previewMessage}>
                  <div className={styles.previewArrive}>알림톡 도착</div>
                  <div className={styles.previewBody}>
                    <p className={styles.previewLesson}>
                      {fillLessonAlimtalkFrameHeader({
                        academyName,
                        teacherName,
                        studentName: PREVIEW_STUDENT_NAME,
                        lessonDate: PREVIEW_DATE,
                      })}
                    </p>
                    {intro.trim() ? <PreviewPhrase text={intro.trim()} samples={previewSamples} /> : null}
                    <p className={styles.previewLesson}>{LESSON_SAMPLE}</p>
                    {outro.trim() ? <PreviewPhrase text={outro.trim()} samples={previewSamples} /> : null}
                    <p className={styles.previewLesson}>{LESSON_ALIMTALK_FRAME_FOOTER}</p>
                    <div className={styles.settingsCta}>{LESSON_ALIMTALK_CTA_LABEL}</div>
                  </div>
                </div>
                <p className={styles.previewClock}>오후 09:54</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
