'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/common/Button'
import useToast from '@/hooks/useToast'
import { alimtalkService, type AlimtalkDeliveryMode } from '@/services/alimtalk'
import InfoIcon from '@/assets/icons/icon-info.svg'
import * as styles from './alimtalkSettings.css'

const DEFAULT_INTRO =
  '\uC548\uB155\uD558\uC138\uC694, {\uD559\uC6D0\uBA85} {\uAC15\uC0AC\uBA85}\uC785\uB2C8\uB2E4.\n' +
  '{\uD559\uC0DD\uC774\uB984}\uC758 \uC218\uC5C5 \uACB0\uACFC\uB97C \uC548\uB0B4\uB4DC\uB9BD\uB2C8\uB2E4.'

const DEFAULT_OUTRO = '\uAC10\uC0AC\uD569\uB2C8\uB2E4.\n{\uD559\uC6D0\uBA85} \uB4DC\uB9BC.'

const PREVIEW_MIDDLE =
  '\u25A0 \uC624\uB298\uC758 \uD559\uC2B5 \uB0B4\uC6A9: {\uB0B4\uC6A9}\n' +
  '\u25A0 \uCD9C\uACB0: {\uCD9C\uACB0}\n' +
  '\u25A0 \uC2DC\uD5D8 \uC810\uC218: {\uC810\uC218}\n' +
  '\u25A0 \uD53C\uB4DC\uBC31: {\uD53C\uB4DC\uBC31}'

const VARIABLE_INSERTS: { display: string; snippet: string }[] = [
  { display: '{ \uAC15\uC0AC\uBA85 }', snippet: '{\uAC15\uC0AC\uBA85}' },
  { display: '{ \uD559\uC6D0\uBA85 }', snippet: '{\uD559\uC6D0\uBA85}' },
  { display: '{ \uD559\uC0DD\uC774\uB984 }', snippet: '{\uD559\uC0DD\uC774\uB984}' },
  { display: '{ \uB0A0\uC9DC }', snippet: '{\uB0A0\uC9DC}' },
  { display: '{ \uBC18\uC774\uB984 }', snippet: '{\uBC18\uC774\uB984}' },
]

function insertAtCursor(el: HTMLTextAreaElement, text: string) {
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  const next = el.value.slice(0, start) + text + el.value.slice(end)
  el.value = next
  const pos = start + text.length
  el.setSelectionRange(pos, pos)
  el.focus()
}

export default function AlimtalkSettingsPage() {
  const pathname = usePathname()
  const { success, error } = useToast()
  const introRef = useRef<HTMLTextAreaElement>(null)
  const outroRef = useRef<HTMLTextAreaElement>(null)

  const [intro, setIntro] = useState('')
  const [outro, setOutro] = useState('')
  const [deliveryMode, setDeliveryMode] = useState<AlimtalkDeliveryMode>('mock')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await alimtalkService.getSettings()
        if (cancelled) return
        setIntro(s.intro_text?.trim() ? s.intro_text : DEFAULT_INTRO)
        setOutro(s.outro_text?.trim() ? s.outro_text : DEFAULT_OUTRO)
        setDeliveryMode(s.delivery_mode)
      } catch {
        if (!cancelled) error('\uC124\uC815\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC5B4\uC694.')
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

  const onInsertIntro = useCallback((snippet: string) => {
    const el = introRef.current
    if (!el) return
    insertAtCursor(el, snippet)
    setIntro(el.value)
  }, [])

  const onInsertOutro = useCallback((snippet: string) => {
    const el = outroRef.current
    if (!el) return
    insertAtCursor(el, snippet)
    setOutro(el.value)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await alimtalkService.putSettings({
        intro_text: intro,
        outro_text: outro,
      })
      success('\uC800\uC7A5\uD588\uC5B4\uC694.')
    } catch {
      error('\uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC5B4\uC694.')
    } finally {
      setSaving(false)
    }
  }

  const previewBlock = [intro.trim() || DEFAULT_INTRO, PREVIEW_MIDDLE, outro.trim() || DEFAULT_OUTRO].join(
    '\n\n'
  )

  if (loading) {
    return null
  }

  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>{'\uC54C\uB9BC\uD1A1'}</h1>

      {deliveryMode === 'mock' && (
        <div className={styles.deliveryBanner}>
          {'\uD604\uC7AC '}
          <strong>{'\uBAA8\uC758 \uC804\uC1A1(mock)'}</strong>
          {
            ' \uBAA8\uB4DC\uC785\uB2C8\uB2E4. \uC2E4\uC81C \uCE74\uCE74\uC624 \uC54C\uB9BC\uD1A1\uC740 \uBC1C\uC1A1\uB418\uC9C0 \uC54A\uC544\uC694.'
          }
        </div>
      )}

      <div className={styles.tabRow}>
        <Link
          href="/alimtalk"
          className={`${styles.tabLink} ${pathname === '/alimtalk' || pathname === '/alimtalk/' ? styles.tabActive : styles.tabInactive}`}
        >
          {'\uBB38\uC790 \uC124\uC815'}
        </Link>
        <Link
          href="/alimtalk/history"
          className={`${styles.tabLink} ${pathname.startsWith('/alimtalk/history') ? styles.tabActive : styles.tabInactive}`}
        >
          {'\uBC1C\uC1A1 \uB0B4\uC5ED'}
        </Link>
      </div>

      <div className={styles.columns}>
        <div className={styles.formColumn}>
          <div className={styles.hintRow}>
            <InfoIcon width={20} height={20} />
            <span className={styles.hintText}>
              {
                '\uBB38\uC790\uC5D0 \uD3EC\uD568\uD560 \uD56D\uBAA9\uC740 \uAC01 \uC218\uC5C5 \uD654\uBA74\uC5D0\uC11C \uC124\uC815\uD560 \uC218 \uC788\uC5B4\uC694'
              }
            </span>
          </div>

          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionLabel}>{'\uC778\uD2B8\uB85C'}</h2>
            <textarea
              ref={introRef}
              className={styles.textareaBox}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              rows={4}
              aria-label={'\uC778\uD2B8\uB85C \uBB38\uAD6C'}
            />
            <div className={styles.varSectionLabel}>
              <span className={styles.varIconBox} aria-hidden />
              <span className={styles.varLabelText}>{'\uBCC0\uC218 \uC0BD\uC785'}</span>
            </div>
            <div className={styles.varChipsRow}>
              {VARIABLE_INSERTS.map((v) => (
                <button
                  key={`intro-${v.snippet}`}
                  type="button"
                  className={styles.varChip}
                  onClick={() => onInsertIntro(v.snippet)}
                >
                  {v.display}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sectionBlock}>
            <h2 className={styles.sectionLabel}>{'\uC544\uC6C3\uD2B8\uB85C'}</h2>
            <textarea
              ref={outroRef}
              className={styles.textareaBox}
              value={outro}
              onChange={(e) => setOutro(e.target.value)}
              rows={4}
              aria-label={'\uC544\uC6C3\uD2B8\uB85C \uBB38\uAD6C'}
            />
            <div className={styles.varSectionLabel}>
              <span className={styles.varIconBox} aria-hidden />
              <span className={styles.varLabelText}>{'\uBCC0\uC218 \uC0BD\uC785'}</span>
            </div>
            <div className={styles.varChipsRow}>
              {VARIABLE_INSERTS.map((v) => (
                <button
                  key={`outro-${v.snippet}`}
                  type="button"
                  className={styles.varChip}
                  onClick={() => onInsertOutro(v.snippet)}
                >
                  {v.display}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.saveRow}>
            <Button variant="primary" size="md" onClick={handleSave} disabled={saving}>
              {saving ? '\uC800\uC7A5 \uC911\u2026' : '\uC800\uC7A5'}
            </Button>
          </div>
        </div>

        <div className={styles.previewColumn}>
          <h2 className={styles.previewTitle}>{'\uC54C\uB9BC\uD1A1 \uBBF8\uB9AC\uBCF4\uAE30'}</h2>
          <div className={styles.previewPhoneShell}>
            <div className={styles.previewLogoRow}>
              <div className={styles.previewLogoPlaceholder} />
              <span className={styles.previewAppLabel}>{'\uD074\uB7AB \uC218\uC5C5 \uC54C\uB9BC'}</span>
            </div>
            <div className={styles.previewHeaderBar}>
              <p className={styles.previewHeaderText}>{'\uC54C\uB9BC\uD1A1 \uC0C1\uC138 \uB3C4\uCC29'}</p>
            </div>
            <div className={styles.previewBubble}>
              <p className={styles.previewBodyText}>{previewBlock}</p>
              <div className={styles.previewCta}>{'\uD559\uC2B5 \uB300\uC2DC\uBCF4\uB4DC \uBCF4\uAE30'}</div>
            </div>
            <p className={styles.previewTime}>{'\uC624\uD6C4 09:54'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
