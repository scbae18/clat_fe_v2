'use client'

import { Suspense, use } from 'react'
import * as styles from './checkSession.css'
import { usePublicCheckSession } from './_hooks/usePublicCheckSession'
import { CheckBlockedView } from './_components/CheckBlockedView'
import { CheckSuccessView } from './_components/CheckSuccessView'
import { CheckCodeForm } from './_components/CheckCodeForm'

function CheckSessionInner({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId: sidStr } = use(params)
  const sessionId = Number(sidStr)
  const check = usePublicCheckSession(sessionId)

  if (!Number.isFinite(check.studentId)) {
    return (
      <div className={styles.page}>
        <div className={styles.contentColumn}>
          <h1 className={styles.title}>학생 정보가 없어요.</h1>
          <p className={styles.subStack} style={{ marginTop: '14px' }}>
            URL에 studentId가 포함되어 있는지 확인해 주세요.
          </p>
        </div>
      </div>
    )
  }

  if (check.blocked) {
    return <CheckBlockedView blocked={check.blocked} />
  }

  if (check.done) {
    return <CheckSuccessView done={check.done} fallbackClassName={check.className} />
  }

  return (
    <CheckCodeForm
      inputRef={check.inputRef}
      className={check.className}
      studentName={check.studentName}
      loadErr={check.loadErr}
      code={check.code}
      remain={check.remain}
      submitErr={check.submitErr}
      submitting={check.submitting}
      onCodeInput={check.onCodeInput}
      onConfirm={() => void check.onConfirm()}
    />
  )
}

export default function StudentCheckPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  return (
    <Suspense
      fallback={
        <div className={styles.page}>
          <p className={styles.subStack}>…</p>
        </div>
      }
    >
      <CheckSessionInner params={params} />
    </Suspense>
  )
}
