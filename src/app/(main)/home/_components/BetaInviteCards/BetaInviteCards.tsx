'use client'

import Image from 'next/image'
import giftBox from '@/assets/images/gift-box.png'
import envelope from '@/assets/images/envelope.png'
import ChevronRightIcon from '@/assets/icons/icon-chevron-right.svg'
import * as styles from './BetaInviteCards.css'

const INVITE_FORM_URL = 'https://forms.gle/GnAunK7KUQQuHCSY8'

export default function BetaInviteCards() {
  return (
    <div className={styles.grid}>
      <div className={styles.betaCard}>
        <div className={styles.cardContent}>
          <div className={styles.tag}>베타 테스터 혜택</div>
          <div className={styles.title}>
            지금 참여하면
            <br />
            3개월 무료
          </div>
          <div className={styles.desc}>
            베타 기간 동안 모든 기능을
            <br />
            무료로 사용하세요.
          </div>
        </div>
        <div className={styles.imageWrap}>
          <Image src={giftBox} alt="" width={360} height={360} />
        </div>
      </div>

      <div className={styles.inviteCard}>
        <div className={styles.cardContent}>
          <div className={styles.tagInvert}>친구 초대 이벤트</div>
          <div className={styles.titleInvert}>
            친구 초대하고
            <br />
            3개월 추가 무료
          </div>
          <a
            href={INVITE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.inviteButton}
          >
            친구 초대하기
            <ChevronRightIcon width={24} height={24} />
          </a>
        </div>
        <div className={styles.imageWrap}>
          <Image src={envelope} alt="" width={360} height={360} />
        </div>
      </div>
    </div>
  )
}
