'use client'

import type { RefObject } from 'react'
import * as styles from '../checkSession.css'
import { formatRemaining } from '../_lib/checkShared'

type CheckCodeFormProps = {
  inputRef: RefObject<HTMLInputElement | null>
  className: string
  studentName: string | null
  loadErr: string | null
  code: string
  remain: number
  submitErr: string | null
  submitting: boolean
  onCodeInput: (raw: string) => void
  onConfirm: () => void
}

export function CheckCodeForm({
  inputRef,
  className,
  studentName,
  loadErr,
  code,
  remain,
  submitErr,
  submitting,
  onCodeInput,
  onConfirm,
}: CheckCodeFormProps) {
  const digits = [code[0] ?? '', code[1] ?? '', code[2] ?? '', code[3] ?? '']

  return (
    <div className={styles.page}>
      <input
        ref={inputRef}
        className={styles.hiddenNumericInput}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={4}
        value={code}
        onChange={(e) => onCodeInput(e.target.value)}
        aria-label="출결 코드 4자리"
      />
      <div className={styles.contentColumn}>
        {className ? (
          <div className={styles.chip}>{className}</div>
        ) : (
          <div style={{ height: '25px', marginBottom: '20px' }} />
        )}
        <h1 className={styles.title}>출결 코드를 입력해주세요</h1>
        <div className={styles.subStack}>
          <p style={{ margin: 0 }}>선생님께 받은</p>
          <p style={{ margin: 0 }}>4자리 코드를 입력해주세요</p>
        </div>
        {studentName ? <p className={styles.studentName}>{studentName}</p> : null}
        {loadErr ? <p className={styles.loadErrText}>{loadErr}</p> : null}

        <div className={styles.timerDigitsBlock} onClick={() => inputRef.current?.focus()}>
          <div className={styles.timerLine}>
            <span className={styles.timerLabel}>남은 시간 </span>
            <span className={styles.timerValue}>{formatRemaining(remain)}</span>
          </div>
          <div className={styles.digitsRow}>
            {digits.map((ch, i) => (
              <div
                key={i}
                className={`${styles.digitBox}${ch ? ` ${styles.digitBoxFilled}` : ''}`}
              >
                {ch}
              </div>
            ))}
          </div>
        </div>

        {submitErr ? <p className={styles.errorText}>{submitErr}</p> : null}

        <button
          type="button"
          className={styles.confirmBtn}
          disabled={submitting || code.length !== 4}
          onClick={onConfirm}
        >
          확인
        </button>
      </div>
    </div>
  )
}
