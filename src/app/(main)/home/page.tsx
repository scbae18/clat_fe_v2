'use client'

import { useState } from 'react'
import Image from 'next/image'
import LogoBetaIcon from '@/assets/logo/logo-beta.svg'
import bannerIllust from '@/assets/images/banner-illust.png'
import giftBox from '@/assets/images/gift-box.png'
import envelope from '@/assets/images/envelope.png'
import BookOpen from '@/assets/icons/icon-book-open.svg'
import ChevronRight from '@/assets/icons/icon-chevron-right.svg'
import * as styles from './home.css'

const steps = [
  {
    number: '1',
    tag: 'STEP 1',
    title: '반 & 학생 등록',
    items: [
      '[반 관리] 메뉴에서 반 이름 입력 후 반 생성 (예: "중등 수학 A반")',
      '생성된 반에 학생 개별 추가 또는 엑셀 파일로 일괄 등록',
      '학생 정보 입력 (이름, 학생 전화번호, 학부모 전화번호)',
      '등록 완료 → 이후 수업 입력 시 해당 반·학생 자동 연동',
    ],
  },
  {
    number: '2',
    tag: 'STEP 2',
    title: '수업 준비 — 템플릿 설정',
    items: [
      '템플릿 이름 입력 (예: "중등 수업 템플릿")',
      '공통 항목 추가 (예: 오늘 수업 내용, 과제 범위)',
      '개별 항목 추가 (시험 점수→숫자형 / 출결→선택형 / 과제→완료형)',
      '문자에 포함할 항목 선택 후 저장 → 이후 수업에서 반복 사용',
    ],
  },
  {
    number: '3',
    tag: 'STEP 3',
    title: '수업 데이터 입력 & 문자 발송',
    items: [
      '홈 화면에서 날짜 선택 → 해당 날짜 수업반 자동 표시',
      '반 선택 후 [입력하기] 클릭 → 템플릿 선택',
      '공통 내용 및 학생별 개별 내용 입력',
      '저장 → 완료율 자동 계산 및 미완료 항목 추적 시작',
      '학생별 문자 내용 미리보기 확인 후 엑셀 내보내기',
    ],
  },
  {
    number: '4',
    tag: 'STEP 4',
    title: '학생 추적',
    items: [
      '템플릿 생성 시 관리할 항목을 완료형으로 설정',
      '학생 목록에서 완료율이 낮은 학생 확인',
      '학생 개인 페이지 진입 → 미완료 항목 및 수업 확인',
      '페이지에서 바로 완료 처리 → 즉시 반영',
    ],
  },
]

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className={styles.pageStyle}>
      {/* 웰컴 배너 */}
      <div className={styles.bannerStyle}>
        <div className={styles.bannerContentStyle}>
          <div style={{ overflow: 'hidden', height: '24px', width: '120px' }}>
            <LogoBetaIcon style={{ height: '16px', width: 'auto', marginLeft: '3px' }} />
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
            style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
          />
        </div>
      </div>

      {/* 클랫 시작 가이드 */}
      <div>
        <div className={styles.sectionHeaderStyle}>
          <BookOpen width={24} height={24} />
          <span className={styles.sectionTitleStyle}>클랫 시작 가이드</span>
        </div>

        {/* 탭 */}
        <div className={styles.tabListStyle}>
          {steps.map((step, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={activeStep === i ? styles.tabButtonActiveStyle : styles.tabButtonStyle}
            >
              {step.tag}
            </button>
          ))}
        </div>

        {/* 스텝 카드 */}
        <div className={styles.stepCardStyle}>
          <div className={styles.stepCardHeaderStyle}>
            <div className={styles.stepCardTitleStyle}>{steps[activeStep].title}</div>
          </div>
          <div className={styles.stepItemListStyle}>
            {steps[activeStep].items.map((item, i) => (
              <div key={i} className={styles.stepItemStyle}>
                <div className={styles.stepNumberStyle}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.stepItemTextStyle}>{item}</div>
              </div>
            ))}
          </div>
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
              style={{ objectFit: 'contain' }}
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
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
