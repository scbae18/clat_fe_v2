'use client'

import Image from 'next/image'
import LogoBetaIcon from '@/assets/logo/logo-beta.svg'
import bannerIllust from '@/assets/images/banner-illust.png'
import giftBox from '@/assets/images/gift-box.png'
import envelope from '@/assets/images/envelope.png'
import BookOpen from '@/assets/icons/icon-book-open.svg'
import ChevronRight from '@/assets/icons/icon-chevron-right.svg'
import HomeUpdateSection from './_components/HomeUpdateSection/HomeUpdateSection'
import * as styles from './home.css'

const GUIDE_MANUALS = [
  {
    tag: '조교용',
    title: ['클랫 조교', '사용 메뉴얼'],
    href: 'https://discovered-impatiens-00f.notion.site/363dab71334f801791c0cd42a519361d?pvs=74',
    variant: 'light' as const,
  },
  {
    tag: '선생님용',
    title: ['클랫 선생님', '사용 메뉴얼'],
    href: 'https://discovered-impatiens-00f.notion.site/363dab71334f8033bad4c5f93e34750a?pvs=74',
    variant: 'accent' as const,
  },
]

export default function HomePage() {
  return (
    <div className={styles.pageStyle}>
      {/* 웰컴 배너 */}
      <div className={styles.bannerStyle}>
        <div className={styles.bannerContentStyle}>
          <div className={styles.bannerLogoWrapStyle}>
            <LogoBetaIcon className={styles.bannerLogoStyle} />
          </div>
          <div>
            <div className={styles.bannerSubtitleStyle}>수업 기록부터 문자까지,</div>
            <div className={styles.bannerTitleStyle}>3분이면 끝</div>
          </div>
        </div>
        <div className={styles.bannerIllustWrapStyle}>
          <Image
            src={bannerIllust}
            alt="배너 일러스트"
            height={380}
            className={styles.bannerIllustStyle}
          />
        </div>
      </div>

      <HomeUpdateSection />

      {/* 사용 메뉴얼 */}
      <div>
        <div className={styles.sectionHeaderStyle}>
          <BookOpen width={24} height={24} />
          <span className={styles.sectionTitleStyle}>사용 메뉴얼</span>
        </div>
        <div className={styles.cardGridStyle}>
          {GUIDE_MANUALS.map((guide) => {
            const isLight = guide.variant === 'light'
            return (
              <a
                key={guide.href}
                href={guide.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.guideCardLinkStyle} ${isLight ? styles.betaCardStyle : styles.inviteCardStyle}`}
              >
                <div
                  className={`${styles.guideCardIconWrapStyle} ${isLight ? styles.guideCardIconLightStyle : styles.guideCardIconAccentStyle}`}
                >
                  <BookOpen width={56} height={56} aria-hidden />
                </div>
                <div className={styles.cardContentStyle}>
                  <div className={isLight ? styles.cardTagStyle : styles.cardTagInvertStyle}>
                    {guide.tag}
                  </div>
                  <div className={isLight ? styles.cardTitleStyle : styles.cardTitleInvertStyle}>
                    {guide.title[0]}
                    <br />
                    {guide.title[1]}
                  </div>
                  <span className={styles.inviteButtonStyle}>
                    메뉴얼 보기
                    <ChevronRight width={24} height={24} />
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      {/* 하단 2열 카드 */}
      <div className={styles.cardGridStyle}>
        {/* 베타 혜택 */}
        <div className={styles.betaCardStyle}>
          <div className={styles.cardContentStyle}>
            <div className={styles.cardTagStyle}>베타 테스터 혜택</div>
            <div className={styles.cardTitleStyle}>
              지금 참여하면
              <br />
              3개월 무료
            </div>
            <div className={styles.cardDescStyle}>
              베타 기간 동안 모든 기능을
              <br />
              무료로 사용하세요.
            </div>
          </div>
          <div className={styles.cardImageWrapStyle}>
            <Image
              src={giftBox}
              alt="선물상자"
              width={360}
              height={360}
              className={styles.cardImageStyle}
            />
          </div>
        </div>

        {/* 친구 초대 */}
        <div className={styles.inviteCardStyle}>
          <div className={styles.cardContentStyle}>
            <div className={styles.cardTagInvertStyle}>친구 초대 이벤트</div>
            <div className={styles.cardTitleInvertStyle}>
              친구 초대하고
              <br />
              3개월 추가 무료
            </div>
            <a
              href="https://forms.gle/GnAunK7KUQQuHCSY8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.inviteButtonStyle}
            >
              친구 초대하기
              <ChevronRight width={24} height={24} />
            </a>
          </div>
          <div className={styles.cardImageWrapStyle}>
            <Image
              src={envelope}
              alt="편지봉투"
              width={360}
              height={360}
              className={styles.cardImageStyle}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
