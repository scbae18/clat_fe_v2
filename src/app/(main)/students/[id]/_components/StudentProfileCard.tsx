'use client'

import EditIcon from '@/assets/icons/icon-edit.svg'
import type { StudentDetail } from '@/types/student'
import * as styles from '../studentDashboard.css'
import { MSG } from '../_lib/studentDashboardShared'
import { IconBook, IconBuilding, IconPhone, IconSchool } from './StudentDashboardIcons'

type ClassLabel = { display: string; full: string }

type StudentProfileCardProps = {
  detail: StudentDetail
  academyName: string
  classLabel: ClassLabel
  onEdit: () => void
}

export function StudentProfileCard({
  detail,
  academyName,
  classLabel,
  onEdit,
}: StudentProfileCardProps) {
  return (
    <section className={styles.profileCard}>
      <div className={styles.profileTop}>
        <div className={styles.avatar} />
        <div className={styles.profileName} title={detail.name}>
          {detail.name}
        </div>
        <button
          type="button"
          className={styles.profileEditButton}
          onClick={onEdit}
          aria-label={MSG.editStudent}
          title={MSG.editStudent}
        >
          <EditIcon width={16} height={16} />
          <span>{MSG.editStudent}</span>
        </button>
      </div>
      <div className={styles.infoGrid}>
        <div className={styles.infoLabelCell}>
          <IconBuilding />
          {MSG.academy}
        </div>
        <div className={styles.infoValueCell} title={academyName}>
          {academyName}
        </div>

        <div className={styles.infoLabelCell}>
          <IconBook />
          {MSG.className}
        </div>
        <div className={styles.infoValueCell} title={classLabel.full}>
          {classLabel.display}
        </div>

        <div className={styles.infoLabelCell}>
          <IconSchool />
          {MSG.school}
        </div>
        <div className={styles.infoValueCell} title={detail.school_name?.trim() || '-'}>
          {detail.school_name?.trim() || '-'}
        </div>

        <div className={styles.infoLabelCell}>
          <IconPhone />
          {MSG.phone}
        </div>
        <div className={styles.infoPhoneValueCell} title={detail.phone?.trim() || '-'}>
          {detail.phone?.trim() || '-'}
        </div>

        <div className={styles.infoLabelCell}>
          <IconPhone />
          {MSG.parentPhone}
        </div>
        <div className={styles.infoPhoneValueCell} title={detail.parent_phone?.trim() || '-'}>
          {detail.parent_phone?.trim() || '-'}
        </div>
      </div>
    </section>
  )
}
