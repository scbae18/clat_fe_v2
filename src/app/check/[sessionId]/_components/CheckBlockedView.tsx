'use client'

import * as styles from '../checkSession.css'
import type { CheckBlockedState } from '../_lib/checkShared'
import { ClosedWarningIcon } from './CheckIcons'

export function CheckBlockedView({ blocked }: { blocked: CheckBlockedState }) {
  return (
    <div className={styles.page}>
      <div className={styles.contentColumn}>
        <div className={styles.blockedStack}>
          <ClosedWarningIcon className={styles.blockedIconWrap} />
          <h1 className={styles.blockedTitle}>{blocked.title}</h1>
          {blocked.sub ? <p className={styles.blockedSub}>{blocked.sub}</p> : null}
        </div>
      </div>
    </div>
  )
}
