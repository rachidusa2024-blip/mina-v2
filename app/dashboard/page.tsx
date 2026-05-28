"use client";

import { useDashboardData } from "@/components/features/dashboard/useDashboardData";
import DashboardHeader from "@/components/features/dashboard/DashboardHeader";
import MinaInsightHero from "@/components/features/dashboard/sections/MinaInsightHero";
import NextBestAction from "@/components/features/dashboard/sections/NextBestAction";
import RecoveryReadiness from "@/components/features/dashboard/sections/RecoveryReadiness";
import LiveCallCenter from "@/components/features/dashboard/sections/LiveCallCenter";
import MinaMemory from "@/components/features/dashboard/sections/MinaMemory";
import PressureMap from "@/components/features/dashboard/sections/PressureMap";
import Workspaces from "@/components/features/dashboard/sections/Workspaces";
import RecoveryJourney from "@/components/features/dashboard/sections/RecoveryJourney";
import MinaNoticed from "@/components/features/dashboard/sections/MinaNoticed";

export default function DashboardPage() {
  const data = useDashboardData();
  return (
    <div style={{
      background: "var(--bg-base)", minHeight: "100vh",
      // @ts-ignore
      "--bg-base": "#090D1A", "--bg-card": "#111827",
      "--text-prime": "#F0F4FF", "--text-muted": "#8892A4",
      "--teal": "#00C9A7", "--teal-dim": "rgba(0,201,167,0.1)",
      "--gold": "#C9A84C", "--border": "rgba(255,255,255,0.08)",
    } as React.CSSProperties}>
      <DashboardHeader firstName={data.firstName} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 flex flex-col gap-8">

        {/* 1. Mina's Read */}
        <MinaInsightHero
          pressureState={data.pressureState}
          pressureStateColor={data.pressureStateColor}
          currentPhase={data.currentPhase}
          coachInsight={data.coachInsight}
          coachFocus={data.coachFocus}
          confidenceScore={0}
          recommendation={data.recommendation}
          recommendedRoute={data.recommendedRoute}
        />

        {/* 2. Next Best Action */}
        <NextBestAction {...data.nextBestAction} />

        {/* 3. Recovery Readiness + Emotional State */}
        <RecoveryReadiness
          score={data.recoveryReadiness}
          emotionalState={data.emotionalState}
          emotionalStateColor={data.emotionalStateColor}
        />

        {/* 4. Live Call Center */}
        <LiveCallCenter />

        {/* 5. Mina Memory */}
        <MinaMemory memoryCards={data.memoryCards} />

        {/* 6. Pressure Map */}
        <PressureMap areas={data.pressureAreas} />

        {/* 7. Workspaces */}
        <Workspaces />

        {/* 8. Recovery Journey */}
        <RecoveryJourney
          phases={data.journeyPhases}
          currentIndex={data.currentJourneyIndex}
          nextMilestoneName={data.nextMilestoneName}
          journeyProgress={data.journeyProgress}
        />

        {/* 9. Mina Noticed */}
        <MinaNoticed observation={data.behaviorObservation} />

      </main>
    </div>
  );
}
