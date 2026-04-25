'use client'

import { useMemo } from 'react'
import HomeHero from './_components/HomeHero/HomeHero'
import TodayLessons from './_components/TodayLessons/TodayLessons'
import AiInsightsCard from './_components/AiInsightsCard/AiInsightsCard'
import AttentionStudents from './_components/AttentionStudents/AttentionStudents'
import QuickActions from './_components/QuickActions/QuickActions'
import OnboardingGuide from './_components/OnboardingGuide/OnboardingGuide'
import BetaInviteCards from './_components/BetaInviteCards/BetaInviteCards'
import useHomeData from './_hooks/useHomeData'
import { MOCK_AT_RISK_SNAPSHOTS } from '../ai/_data/mockAtRisk'
import * as styles from './home.css'

export default function HomePage() {
  const { todayLessons, students, todayDate } = useHomeData()

  const riskHighCount = useMemo(
    () => MOCK_AT_RISK_SNAPSHOTS.filter((s) => s.level === 'HIGH').length,
    [],
  )

  const hasAnyData =
    (todayLessons?.length ?? 0) > 0 || (students?.length ?? 0) > 0
  const onboardingDefaultOpen =
    todayLessons !== null && students !== null && !hasAnyData

  return (
    <div className={styles.page}>
      <HomeHero
        todayLessons={todayLessons}
        students={students}
        riskHighCount={riskHighCount}
        todayDate={todayDate}
      />

      <div className={styles.row}>
        <TodayLessons today={todayDate} initialLessons={todayLessons} />
        <AiInsightsCard />
      </div>

      <AttentionStudents students={students} />

      <QuickActions />

      <OnboardingGuide defaultOpen={onboardingDefaultOpen} />

      <BetaInviteCards />
    </div>
  )
}
