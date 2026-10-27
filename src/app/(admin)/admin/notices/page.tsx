'use client'

import { AdminHeader } from '../_components/AdminUi'
import * as styles from '../admin.css'

export default function AdminNoticesPage() {
  return (
    <div className={styles.stack}>
      <AdminHeader
        title="안내 알림톡"
        subtitle="선생님에게 안내나 업데이트 내용을 보내는 자리입니다. 지금은 메뉴만 열려 있습니다."
      />
      <section className={styles.card}>
        <p className={styles.empty}>
          카카오 알림톡 템플릿이 아직 없어서 발송은 연결하지 않았습니다. 작성·발송은 추후 개발합니다.
        </p>
      </section>
    </div>
  )
}
