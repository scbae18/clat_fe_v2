'use client'

import { AdminHeader } from '../_components/AdminUi'
import * as styles from '../admin.css'

export default function AdminAnomaliesPage() {
  return (
    <div className={styles.stack}>
      <AdminHeader
        title="이상 감지"
        subtitle="서비스 목적과 다른 문자만 나중에 여기에 모읍니다. 지금은 메뉴만 열려 있습니다."
      />
      <section className={styles.card}>
        <p className={styles.empty}>이상 감지는 추후 개발합니다. 알림톡 발송은 지금과 같이 그대로 나갑니다.</p>
      </section>
    </div>
  )
}
