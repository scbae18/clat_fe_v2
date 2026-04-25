import { ReactNode } from 'react'
import TabNav from './_components/TabNav/TabNav'
import * as styles from './aiLayout.css'

export default function AiWorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.pageRoot}>
      <h1 className={styles.pageTitle}>AI 조교</h1>
      <p className={styles.pageSubtitle}>
        조교가 위험 학생을 미리 알려주고, 무엇을 해야 할지 함께 생각해드려요.
      </p>
      <TabNav />
      {children}
    </div>
  )
}
